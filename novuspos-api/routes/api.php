<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Backup\BackupController;
use App\Http\Controllers\Api\V1\Billing\PaymentController;
use App\Http\Controllers\Api\V1\Billing\PaymentMethodController;
use App\Http\Controllers\Api\V1\Billing\PlanController;
use App\Http\Controllers\Api\V1\Billing\SubscriptionController;
use App\Http\Controllers\Api\V1\Dashboard\DashboardController;
use App\Http\Controllers\Api\V1\ExchangeRate\ExchangeRateController;
use App\Http\Controllers\Api\V1\LandingConfigController;
use App\Http\Controllers\Api\V1\Support\SupportTicketController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/landing/config', [LandingConfigController::class, 'show']);

    Route::prefix('auth')->group(function (): void {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
            ->name('verification.verify');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::post('/email/verification-notification', [AuthController::class, 'sendEmailVerification'])
                ->middleware('throttle:6,1');
        });
    });

    Route::get('/billing/plans', [PlanController::class, 'index']);
    Route::get('/billing/payment-methods', [PaymentMethodController::class, 'index']);
    Route::get('/billing/exchange-rate', [ExchangeRateController::class, 'today']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/panel/overview', [DashboardController::class, 'overview']);

        Route::get('/billing/subscription', [SubscriptionController::class, 'show']);
        Route::get('/billing/payments', [PaymentController::class, 'index']);
        Route::post('/billing/payments', [PaymentController::class, 'store']);
        Route::patch('/billing/payments/{payment}/review', [PaymentController::class, 'review']);

        Route::get('/backups/latest', [BackupController::class, 'latest']);
        Route::post('/backups', [BackupController::class, 'store']);

        Route::post('/support/tickets', [SupportTicketController::class, 'store']);
    });
});
