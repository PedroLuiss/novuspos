<?php

namespace App\Repositories;

use App\Contracts\Repositories\PaymentMethodRepositoryInterface;
use App\Models\PaymentMethod;
use Illuminate\Support\Collection;

class PaymentMethodRepository implements PaymentMethodRepositoryInterface
{
    public function allActive(): Collection
    {
        return PaymentMethod::query()->where('active', true)->orderBy('id')->get();
    }
}
