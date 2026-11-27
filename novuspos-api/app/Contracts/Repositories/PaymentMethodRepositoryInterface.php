<?php

namespace App\Contracts\Repositories;

use App\Models\PaymentMethod;
use Illuminate\Support\Collection;

interface PaymentMethodRepositoryInterface
{
    /**
     * @return Collection<int, PaymentMethod>
     */
    public function allActive(): Collection;

    /**
     * @return Collection<int, PaymentMethod>
     */
    public function all(): Collection;

    /**
     * @param  array<int, array<string, mixed>>  $methods
     * @return Collection<int, PaymentMethod>
     */
    public function replaceAll(array $methods): Collection;
}
