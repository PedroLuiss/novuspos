<?php

namespace App\Services\Dashboard;

use App\Contracts\Repositories\BackupRepositoryInterface;
use App\Contracts\Repositories\PlanRepositoryInterface;
use App\Models\User;
use App\Services\Billing\SubscriptionService;

class DashboardService
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
        private readonly PlanRepositoryInterface $planRepository,
        private readonly BackupRepositoryInterface $backupRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function overview(User $user): array
    {
        $subscription = $this->subscriptionService->ensureSubscription($user);
        $plan = $this->planRepository->findBySlug($subscription->plan_slug);
        $backup = $this->backupRepository->latestForUser($user->id);

        $status = $subscription->status;
        if ($status === 'active' && $subscription->renews_at?->isPast()) {
            $status = 'inactive';
        }

        $seed = "{$subscription->id}-{$subscription->started_at?->toDateString()}";
        $hash = strtoupper(substr(hash('crc32b', $seed), 0, 8));
        $activationKey = sprintf('NVUS-%s-%s-%s-%s', substr($hash, 0, 4), substr($hash, 4, 4), 'DEMO', substr($hash, 0, 4));

        return [
            'organizationName' => $user->organization_name ?? $user->name,
            'planName' => $plan?->name ?? 'NovusPOS Mensual',
            'subscriptionStatus' => $status === 'expired' ? 'inactive' : $status,
            'dueAt' => $subscription->renews_at?->toDateString(),
            'activationKey' => $activationKey,
            'activationKeyRenewsAt' => $subscription->renews_at?->toDateString(),
            'lastBackupAt' => $backup?->backup_created_at?->toISOString() ?? $backup?->created_at?->toISOString(),
        ];
    }
}
