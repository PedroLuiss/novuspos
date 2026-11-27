<?php

namespace App\Services\Billing;

use App\Contracts\Repositories\PaymentRepositoryInterface;
use App\Contracts\Repositories\PlanRepositoryInterface;
use App\Contracts\Repositories\SubscriptionRepositoryInterface;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class SubscriptionService
{
    public function __construct(
        private readonly PlanRepositoryInterface $planRepository,
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PlanService $planService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function overview(User $user): array
    {
        $subscription = $this->ensureSubscription($user);

        return [
            'plans' => $this->planService->listActive(),
            'subscription' => $this->subscriptionToArray($subscription),
            'payments' => $this->paymentRepository->listForUser($user->id)
                ->map(fn (Payment $payment): array => $this->paymentToArray($payment))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function payments(User $user): array
    {
        $this->ensureSubscription($user);

        return $this->paymentRepository->listForUser($user->id)
            ->map(fn (Payment $payment): array => $this->paymentToArray($payment))
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function submitPayment(User $user, array $data): array
    {
        $subscription = $this->ensureSubscription($user);
        $plan = $this->planRepository->findBySlug((string) $data['planId']);

        if (! $plan) {
            throw ValidationException::withMessages(['planId' => ['El plan seleccionado no existe.']]);
        }

        if ($plan->slug !== $subscription->plan_slug && ! $this->isExpired($subscription)) {
            throw ValidationException::withMessages([
                'planId' => ['Tu suscripción sigue activa. Podrás cambiar de plan cuando venza.'],
            ]);
        }

        $duplicate = $this->paymentRepository->listForUser($user->id)
            ->first(fn (Payment $payment): bool => $payment->reference === $data['reference'] && $payment->bank === $data['bank']);

        if ($duplicate) {
            throw ValidationException::withMessages([
                'reference' => ['Esa referencia ya fue registrada. Revisa tu comprobante.'],
            ]);
        }

        $payment = $this->paymentRepository->create([
            'subscription_id' => $subscription->id,
            'user_id' => $user->id,
            'plan_slug' => $plan->slug,
            'reference' => $data['reference'],
            'method' => $data['method'],
            'bank' => $data['bank'],
            'paid_at' => $data['paidAt'],
            'amount' => $plan->price,
            'currency' => $plan->currency,
            'status' => 'pending_review',
            'proof_name' => $data['proofName'] ?? null,
            'proof_data_url' => $data['proofDataUrl'] ?? null,
        ]);

        $this->subscriptionRepository->update($subscription, ['status' => 'pending_review']);

        return $this->paymentToArray($payment->fresh());
    }

    /**
     * @return array<string, mixed>
     */
    public function reviewPayment(User $user, int $paymentId, bool $approved, ?string $note = null): array
    {
        $payment = $this->paymentRepository->findForUser($user->id, $paymentId);

        if (! $payment) {
            throw ValidationException::withMessages(['payment' => ['No encontramos ese pago.']]);
        }

        $subscription = $this->ensureSubscription($user);
        $this->paymentRepository->update($payment, [
            'status' => $approved ? 'approved' : 'rejected',
            'review_note' => $note,
        ]);

        if ($approved) {
            $plan = $this->planRepository->findBySlug((string) ($payment->plan_slug ?? $subscription->plan_slug));
            if ($plan) {
                $start = $payment->paid_at?->copy() ?? now();
                $renews = $start->copy();
                if ($plan->interval === 'year') {
                    $renews->addYear();
                } else {
                    $renews->addMonth();
                }

                $this->subscriptionRepository->update($subscription, [
                    'plan_slug' => $plan->slug,
                    'status' => 'active',
                    'started_at' => $start->toDateString(),
                    'renews_at' => $renews->toDateString(),
                    'amount' => $plan->price,
                    'currency' => $plan->currency,
                ]);
            }
        }

        $subscription = $subscription->fresh() ?? $subscription;
        $payment = $payment->fresh() ?? $payment;

        return [
            'payment' => $this->paymentToArray($payment),
            'subscription' => $this->subscriptionToArray($subscription),
        ];
    }

    public function ensureSubscription(User $user): Subscription
    {
        $subscription = $this->subscriptionRepository->latestForUser($user->id);
        if ($subscription) {
            return $subscription;
        }

        $plan = $this->planRepository->findBySlug('novus-mensual') ?? $this->planRepository->allActive()->first();
        $start = now();
        $renews = $start->copy()->addMonth();

        return $this->subscriptionRepository->create([
            'user_id' => $user->id,
            'plan_slug' => $plan?->slug ?? 'novus-mensual',
            'status' => 'active',
            'started_at' => $start->toDateString(),
            'renews_at' => $renews->toDateString(),
            'amount' => $plan ? (float) $plan->price : 4.99,
            'currency' => $plan?->currency ?? 'USD',
        ]);
    }

    private function isExpired(Subscription $subscription): bool
    {
        if (in_array($subscription->status, ['expired', 'cancelled'], true)) {
            return true;
        }

        return $subscription->renews_at !== null && $subscription->renews_at->isPast();
    }

    /**
     * @return array<string, mixed>
     */
    private function subscriptionToArray(Subscription $subscription): array
    {
        return [
            'id' => (string) $subscription->id,
            'planId' => $subscription->plan_slug,
            'status' => $subscription->status,
            'startedAt' => $subscription->started_at?->toDateString(),
            'renewsAt' => $subscription->renews_at?->toDateString(),
            'amount' => (float) $subscription->amount,
            'currency' => $subscription->currency,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function paymentToArray(Payment $payment): array
    {
        return [
            'id' => (string) $payment->id,
            'subscriptionId' => (string) $payment->subscription_id,
            'planId' => $payment->plan_slug,
            'reference' => $payment->reference,
            'method' => $payment->method,
            'bank' => $payment->bank,
            'paidAt' => $payment->paid_at?->toDateString(),
            'amount' => (float) $payment->amount,
            'currency' => $payment->currency,
            'status' => $payment->status,
            'proofName' => $payment->proof_name,
            'proofDataUrl' => $payment->proof_data_url,
            'reviewNote' => $payment->review_note,
            'createdAt' => $payment->created_at?->toISOString(),
        ];
    }
}
