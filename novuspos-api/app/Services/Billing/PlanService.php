<?php

namespace App\Services\Billing;

use App\Contracts\Repositories\PlanRepositoryInterface;
use App\Models\Plan;

class PlanService
{
    public function __construct(
        private readonly PlanRepositoryInterface $planRepository,
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listActive(): array
    {
        return $this->planRepository->allActive()
            ->map(fn (Plan $plan): array => $this->toArray($plan))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Plan $plan): array
    {
        return [
            'id' => $plan->slug,
            'name' => $plan->name,
            'description' => $plan->description ?? '',
            'price' => (float) $plan->price,
            'currency' => $plan->currency,
            'interval' => $plan->interval,
            'features' => is_array($plan->features) ? $plan->features : [],
            'highlighted' => (bool) $plan->highlighted,
            'active' => (bool) $plan->active,
        ];
    }
}
