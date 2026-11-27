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
}
