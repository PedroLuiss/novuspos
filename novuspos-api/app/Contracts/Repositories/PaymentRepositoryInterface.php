<?php

namespace App\Contracts\Repositories;

use App\Models\Payment;
use Illuminate\Support\Collection;

interface PaymentRepositoryInterface
{
    /**
     * @return Collection<int, Payment>
     */
    public function listForUser(int $userId): Collection;

    public function findForUser(int $userId, int $paymentId): ?Payment;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Payment;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Payment $payment, array $attributes): Payment;
}
