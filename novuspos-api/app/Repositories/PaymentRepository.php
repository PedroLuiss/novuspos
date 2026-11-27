<?php

namespace App\Repositories;

use App\Contracts\Repositories\PaymentRepositoryInterface;
use App\Models\Payment;
use Illuminate\Support\Collection;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function listForUser(int $userId): Collection
    {
        return Payment::query()->where('user_id', $userId)->latest('id')->get();
    }

    public function findForUser(int $userId, int $paymentId): ?Payment
    {
        return Payment::query()->where('user_id', $userId)->where('id', $paymentId)->first();
    }

    public function create(array $attributes): Payment
    {
        return Payment::query()->create($attributes);
    }

    public function update(Payment $payment, array $attributes): Payment
    {
        $payment->fill($attributes)->save();

        return $payment;
    }
}
