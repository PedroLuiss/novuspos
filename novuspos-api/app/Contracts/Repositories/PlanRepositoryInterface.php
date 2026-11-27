<?php

namespace App\Contracts\Repositories;

use App\Models\Plan;
use Illuminate\Support\Collection;

interface PlanRepositoryInterface
{
    /**
     * @return Collection<int, Plan>
     */
    public function allActive(): Collection;

    /**
     * @return Collection<int, Plan>
     */
    public function all(): Collection;

    public function findBySlug(string $slug): ?Plan;

    /**
     * @param  array<int, array<string, mixed>>  $plans
     * @return Collection<int, Plan>
     */
    public function replaceAll(array $plans): Collection;
}
