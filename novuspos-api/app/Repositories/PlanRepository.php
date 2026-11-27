<?php

namespace App\Repositories;

use App\Contracts\Repositories\PlanRepositoryInterface;
use App\Models\Plan;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

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

    public function replaceAll(array $plans): Collection
    {
        return DB::transaction(function () use ($plans): Collection {
            $slugs = [];

            foreach ($plans as $planData) {
                $slug = (string) ($planData['id'] ?? $planData['slug'] ?? '');
                $slugs[] = $slug;

                Plan::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $planData['name'] ?? '',
                        'description' => $planData['description'] ?? '',
                        'price' => $planData['price'] ?? 0,
                        'currency' => $planData['currency'] ?? 'USD',
                        'interval' => $planData['interval'] ?? 'month',
                        'features' => is_array($planData['features'] ?? null) ? $planData['features'] : [],
                        'highlighted' => (bool) ($planData['highlighted'] ?? false),
                        'active' => (bool) ($planData['active'] ?? true),
                    ],
                );
            }

            if ($slugs !== []) {
                Plan::query()->whereNotIn('slug', $slugs)->delete();
            } else {
                Plan::query()->delete();
            }

            return $this->all();
        });
    }
}
