<?php

namespace App\Services\Admin;

use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class AdminPaymentService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function list(array $filters): array
    {
        $page = max(1, (int) ($filters['page'] ?? 1));
        $pageSize = (int) ($filters['pageSize'] ?? 20);
        $pageSize = in_array($pageSize, [20, 50, 100], true) ? $pageSize : 20;
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? 'all');

        $query = Payment::query()->with(['user', 'subscription']);

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $this->toDbStatus($status));
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhere('bank', 'like', "%{$search}%")
                    ->orWhere('method', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search): void {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('organization_name', 'like', "%{$search}%");
                    });
            });
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->latest()->paginate($pageSize, ['*'], 'page', $page);

        $summaryQuery = Payment::query();
        if ($search !== '') {
            $summaryQuery->where(function ($q) use ($search): void {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhere('bank', 'like', "%{$search}%")
                    ->orWhere('method', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search): void {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('organization_name', 'like', "%{$search}%");
                    });
            });
        }

        $all = (clone $summaryQuery)->count();
        $pending = (clone $summaryQuery)->where('status', 'pending_review')->count();
        $approved = (clone $summaryQuery)->where('status', 'approved')->count();
        $rejected = (clone $summaryQuery)->where('status', 'rejected')->count();

        return [
            'items' => $paginator->getCollection()->map(fn (Payment $p): array => $this->toArray($p))->values()->all(),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'summary' => [
                'pending' => $pending,
                'approved' => $approved,
                'rejected' => $rejected,
                'total' => $all,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function review(string $paymentId, bool $approved, ?string $note = null): array
    {
        $payment = Payment::query()->with(['user', 'subscription'])->findOrFail($paymentId);

        if ($payment->status !== 'pending_review') {
            throw ValidationException::withMessages(['payment' => ['Este pago ya fue revisado.']]);
        }

        $payment->status = $approved ? 'approved' : 'rejected';
        $payment->review_note = $note;
        $payment->save();

        if ($approved && $payment->subscription) {
            $plan = Plan::query()->where('slug', $payment->plan_slug ?? $payment->subscription->plan_slug)->first();
            $months = $plan?->interval === 'year' ? 12 : 1;
            $start = now();
            $renewsAt = $start->copy()->addMonths($months);

            $payment->subscription->update([
                'plan_slug' => $payment->plan_slug ?? $payment->subscription->plan_slug,
                'status' => 'active',
                'started_at' => $start->toDateString(),
                'renews_at' => $renewsAt->toDateString(),
                'amount' => $payment->amount,
                'currency' => $payment->currency,
            ]);
        }

        if (! $approved && $payment->subscription) {
            $payment->subscription->update(['status' => 'expired']);
        }

        return $this->toArray($payment->fresh(['user', 'subscription']));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Payment $payment): array
    {
        $user = $payment->user;
        $plan = $payment->plan_slug ? Plan::query()->where('slug', $payment->plan_slug)->first() : null;
        $subscriptionPlan = $payment->subscription?->plan_slug
            ? Plan::query()->where('slug', $payment->subscription->plan_slug)->first()
            : null;
        $resolvedPlan = $plan ?? $subscriptionPlan;

        return [
            'id' => (string) $payment->id,
            'userId' => (string) $payment->user_id,
            'userName' => $user?->organization_name ?? $user?->name ?? 'Usuario',
            'planId' => $payment->plan_slug ?? $payment->subscription?->plan_slug ?? '',
            'planName' => $resolvedPlan?->name ?? ($payment->plan_slug ?? 'Plan'),
            'method' => $payment->method ?? '',
            'reference' => $payment->reference ?? '',
            'bank' => $payment->bank ?? '',
            'paidAt' => $payment->paid_at?->toISOString() ?? $payment->created_at?->toISOString() ?? now()->toISOString(),
            'amount' => (float) $payment->amount,
            'currency' => $payment->currency ?? 'USD',
            'status' => $this->fromDbStatus((string) $payment->status),
            'proofUrl' => $payment->proof_data_url ?? '',
            'reviewNote' => $payment->review_note,
            'createdAt' => $payment->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }

    private function toDbStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'pending_review',
            'approved' => 'approved',
            'rejected' => 'rejected',
            default => $status,
        };
    }

    private function fromDbStatus(string $status): string
    {
        return match ($status) {
            'pending_review' => 'pending',
            'approved' => 'approved',
            'rejected' => 'rejected',
            default => $status,
        };
    }
}
