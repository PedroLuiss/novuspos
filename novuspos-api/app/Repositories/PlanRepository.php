<?php

namespace App\Repositories;

use App\Contracts\Repositories\PlanRepositoryInterface;
use App\Models\Plan;
use Illuminate\Support\Collection;

class PlanRepository implements PlanRepositoryInterface
{
    public function allActive(): Collection
    {
        return Plan::query()->where('active', true)->orderBy('id')->get();
    }

    public function all(): Collection
    {
        return Plan::query()->orderBy('id')->get();
    }

    public function findBySlug(string $slug): ?Plan
    {
        return Plan::query()->where('slug', $slug)->first();
    }
}
