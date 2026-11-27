<?php

namespace App\Services\Admin;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class AdminUserService
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

        $query = User::query()
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'))
            ->with(['latestSubscription']);

        if ($status !== '' && $status !== 'all') {
            $this->applyStatusFilter($query, $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('organization_name', 'like', "%{$search}%")
                    ->orWhere('business_sector', 'like', "%{$search}%");
            });
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->latest()->paginate($pageSize, ['*'], 'page', $page);

        $base = User::query()->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'));
        if ($search !== '') {
            $base->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('organization_name', 'like', "%{$search}%")
                    ->orWhere('business_sector', 'like', "%{$search}%");
            });
        }

        $total = (clone $base)->count();
        $active = (clone $base)->whereHas('latestSubscription', fn ($q) => $q->where('status', 'active'))->count();
        $pending = (clone $base)->whereHas('latestSubscription', fn ($q) => $q->whereIn('status', ['pending', 'pending_review']))->count();
        $inactive = (clone $base)->where(function ($q): void {
            $q->whereHas('latestSubscription', fn ($sq) => $sq->whereIn('status', ['expired', 'cancelled']))
                ->orWhereDoesntHave('subscriptions');
        })->count();

        return [
            'items' => $paginator->getCollection()->map(fn (User $u): array => $this->toArray($u))->values()->all(),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'summary' => [
                'active' => $active,
                'pending' => $pending,
                'inactive' => $inactive,
                'total' => $total,
            ],
        ];
    }

    /**
     * @return array<int, array{id: string, businessName: string}>
     */
    public function options(): array
    {
        return User::query()
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'))
            ->orderBy('organization_name')
            ->get(['id', 'name', 'organization_name'])
            ->map(fn (User $u): array => [
                'id' => (string) $u->id,
                'businessName' => $u->organization_name ?? $u->name,
            ])
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function update(string $userId, array $data): array
    {
        $user = $this->findManagedUser($userId);

        $email = $data['email'] ?? null;
        if (is_string($email) && $email !== $user->email) {
            $exists = User::query()->where('email', $email)->where('id', '!=', $user->id)->exists();
            if ($exists) {
                throw ValidationException::withMessages(['email' => ['Este correo ya está en uso.']]);
            }
        }

        $user->fill(array_filter([
            'name' => $data['name'] ?? null,
            'email' => $email,
            'organization_name' => $data['businessName'] ?? null,
            'business_sector' => $data['businessType'] ?? null,
        ], fn ($v) => $v !== null));
        $user->save();

        return $this->toArray($user->fresh(['latestSubscription']));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'organization_name' => $data['businessName'],
            'business_sector' => $data['businessType'] ?? null,
        ]);

        $user->assignRole('client');

        return $this->toArray($user->fresh(['latestSubscription']));
    }

    /**
     * @return array<string, mixed>
     */
    public function setSubscription(string $userId, string $planId, bool $active): array
    {
        $user = $this->findManagedUser($userId);
        $plan = Plan::query()->where('slug', $planId)->first();

        if (! $plan) {
            throw ValidationException::withMessages(['planId' => ['El plan seleccionado no existe.']]);
        }

        $subscription = Subscription::query()->where('user_id', $user->id)->latest()->first();
        $months = $plan->interval === 'year' ? 12 : 1;
        $start = now();
        $renewsAt = $start->copy()->addMonths($months);

        $payload = [
            'user_id' => $user->id,
            'plan_slug' => $plan->slug,
            'status' => $active ? 'active' : 'cancelled',
            'started_at' => $start->toDateString(),
            'renews_at' => $active ? $renewsAt->toDateString() : $start->toDateString(),
            'amount' => $plan->price,
            'currency' => $plan->currency,
        ];

        if ($subscription) {
            $subscription->update($payload);
        } else {
            Subscription::query()->create($payload);
        }

        return $this->toArray($user->fresh(['latestSubscription']));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(User $user): array
    {
        $subscription = $user->latestSubscription;
        $plan = $subscription?->plan_slug ? Plan::query()->where('slug', $subscription->plan_slug)->first() : null;
        $lastPayment = Payment::query()->where('user_id', $user->id)->where('status', 'approved')->latest('paid_at')->latest()->first();
        $openReports = SupportTicket::query()->where('user_id', $user->id)->where('status', 'open')->count();

        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'businessName' => $user->organization_name ?? $user->name,
            'businessType' => $user->business_sector ?? '',
            'planId' => $subscription?->plan_slug ?? '',
            'planName' => $plan?->name ?? ($subscription?->plan_slug ?? 'Sin plan'),
            'subscriptionStatus' => $this->mapSubscriptionStatus($subscription?->status),
            'joinedAt' => $user->created_at?->toISOString() ?? now()->toISOString(),
            'lastPaymentAt' => $lastPayment?->paid_at?->toISOString() ?? $lastPayment?->created_at?->toISOString(),
            'openReports' => $openReports,
        ];
    }

    private function findManagedUser(string $userId): User
    {
        $user = User::query()->with(['latestSubscription'])->findOrFail($userId);

        if ($user->hasRole('super-admin')) {
            throw ValidationException::withMessages(['user' => ['No puedes modificar este usuario.']]);
        }

        return $user;
    }

    private function applyStatusFilter($query, string $status): void
    {
        if ($status === 'active') {
            $query->whereHas('latestSubscription', fn ($q) => $q->where('status', 'active'));

            return;
        }
        if ($status === 'pending') {
            $query->whereHas('latestSubscription', fn ($q) => $q->whereIn('status', ['pending', 'pending_review']));

            return;
        }
        if ($status === 'expired') {
            $query->whereHas('latestSubscription', fn ($q) => $q->where('status', 'expired'));

            return;
        }
        if ($status === 'cancelled') {
            $query->where(function ($q): void {
                $q->whereHas('latestSubscription', fn ($sq) => $sq->where('status', 'cancelled'))
                    ->orWhereDoesntHave('subscriptions');
            });
        }
    }

    private function mapSubscriptionStatus(?string $status): string
    {
        return match ($status) {
            'active' => 'active',
            'pending', 'pending_review' => 'pending',
            'expired' => 'expired',
            'cancelled' => 'cancelled',
            default => 'cancelled',
        };
    }
}
