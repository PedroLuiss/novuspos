<?php

namespace App\Services\Billing;

use App\Contracts\Repositories\PaymentMethodRepositoryInterface;
use App\Models\PaymentMethod;

class PaymentMethodService
{
    public function __construct(
        private readonly PaymentMethodRepositoryInterface $paymentMethodRepository,
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listActive(): array
    {
        return $this->paymentMethodRepository->allActive()
            ->map(fn (PaymentMethod $method): array => $this->toArray($method))
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listAll(): array
    {
        return $this->paymentMethodRepository->all()
            ->map(fn (PaymentMethod $method): array => $this->toArray($method))
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $methods
     * @return array<int, array<string, mixed>>
     */
    public function replaceAll(array $methods): array
    {
        return $this->paymentMethodRepository->replaceAll($methods)
            ->map(fn (PaymentMethod $method): array => $this->toArray($method))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(PaymentMethod $method): array
    {
        return [
            'id' => $method->slug,
            'label' => $method->label,
            'description' => $method->description ?? '',
            'icon' => $method->icon,
            'active' => (bool) $method->active,
            'rows' => is_array($method->rows) ? $method->rows : [],
        ];
    }
}
