<?php

namespace App\Repositories;

use App\Contracts\Repositories\SubscriptionRepositoryInterface;
use App\Models\Subscription;

class SubscriptionRepository implements SubscriptionRepositoryInterface
{
    public function latestForUser(int $userId): ?Subscription
    {
        return Subscription::query()->where('user_id', $userId)->latest('id')->first();
    }

    public function create(array $attributes): Subscription
    {
        return Subscription::query()->create($attributes);
    }

    public function update(Subscription $subscription, array $attributes): Subscription
    {
        $subscription->fill($attributes)->save();

        return $subscription;
    }
}
