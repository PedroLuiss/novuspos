<?php

namespace App\Providers;

use App\Contracts\Repositories\BackupRepositoryInterface;
use App\Contracts\Repositories\LandingConfigRepositoryInterface;
use App\Contracts\Repositories\PaymentMethodRepositoryInterface;
use App\Contracts\Repositories\PaymentRepositoryInterface;
use App\Contracts\Repositories\PlanRepositoryInterface;
use App\Contracts\Repositories\SubscriptionRepositoryInterface;
use App\Contracts\Repositories\SupportTicketRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Repositories\BackupRepository;
use App\Repositories\LandingConfigRepository;
use App\Repositories\PaymentMethodRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\PlanRepository;
use App\Repositories\SubscriptionRepository;
use App\Repositories\SupportTicketRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, class-string>
     */
    public array $bindings = [
        LandingConfigRepositoryInterface::class => LandingConfigRepository::class,
        PlanRepositoryInterface::class => PlanRepository::class,
        PaymentMethodRepositoryInterface::class => PaymentMethodRepository::class,
        UserRepositoryInterface::class => UserRepository::class,
        SupportTicketRepositoryInterface::class => SupportTicketRepository::class,
        BackupRepositoryInterface::class => BackupRepository::class,
        SubscriptionRepositoryInterface::class => SubscriptionRepository::class,
        PaymentRepositoryInterface::class => PaymentRepository::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //
    }
}
