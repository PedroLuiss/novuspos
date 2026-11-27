<?php

namespace App\Repositories;

use App\Contracts\Repositories\PaymentMethodRepositoryInterface;
use App\Models\PaymentMethod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PaymentMethodRepository implements PaymentMethodRepositoryInterface
{
    public function allActive(): Collection
    {
        return PaymentMethod::query()->where('active', true)->orderBy('id')->get();
    }

    public function all(): Collection
    {
        return PaymentMethod::query()->orderBy('id')->get();
    }

    public function replaceAll(array $methods): Collection
    {
        return DB::transaction(function () use ($methods): Collection {
            $slugs = [];

            foreach ($methods as $methodData) {
                $slug = (string) ($methodData['id'] ?? $methodData['slug'] ?? '');
                $slugs[] = $slug;

                PaymentMethod::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'label' => $methodData['label'] ?? '',
                        'description' => $methodData['description'] ?? '',
                        'icon' => $methodData['icon'] ?? 'payments',
                        'active' => (bool) ($methodData['active'] ?? true),
                        'rows' => is_array($methodData['rows'] ?? null) ? $methodData['rows'] : [],
                    ],
                );
            }

            if ($slugs !== []) {
                PaymentMethod::query()->whereNotIn('slug', $slugs)->delete();
            } else {
                PaymentMethod::query()->delete();
            }

            return $this->all();
        });
    }
}
