<?php

namespace App\Contracts\Repositories;

use App\Models\Subscription;

interface SubscriptionRepositoryInterface
{
    public function latestForUser(int $userId): ?Subscription;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Subscription;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Subscription $subscription, array $attributes): Subscription;
}
