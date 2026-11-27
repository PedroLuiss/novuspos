<?php

use App\Http\Controllers\Api\V1\Admin\AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\AdminEmailController;
use App\Http\Controllers\Api\V1\Admin\AdminLandingController;
use App\Http\Controllers\Api\V1\Admin\AdminNotificationController;
use App\Http\Controllers\Api\V1\Admin\AdminOverviewController;
use App\Http\Controllers\Api\V1\Admin\AdminPaymentController;
use App\Http\Controllers\Api\V1\Admin\AdminPaymentMethodController as AdminPaymentMethodControllerAlias;
use App\Http\Controllers\Api\V1\Admin\AdminPlanController;
use App\Http\Controllers\Api\V1\Admin\AdminProfileController;
use App\Http\Controllers\Api\V1\Admin\AdminReportController;
use App\Http\Controllers\Api\V1\Admin\AdminSettingsController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
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
        Route::get('/landing/download', [LandingConfigController::class, 'download']);
        Route::get('/panel/overview', [DashboardController::class, 'overview']);

        Route::get('/billing/subscription', [SubscriptionController::class, 'show']);
        Route::get('/billing/payments', [PaymentController::class, 'index']);
        Route::post('/billing/payments', [PaymentController::class, 'store']);
        Route::patch('/billing/payments/{payment}/review', [PaymentController::class, 'review']);

        Route::get('/backups/latest', [BackupController::class, 'latest']);
        Route::post('/backups', [BackupController::class, 'store']);

        Route::post('/support/tickets', [SupportTicketController::class, 'store']);
    });

    Route::prefix('admin')->group(function (): void {
        Route::post('/login', [AdminAuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'role:super-admin'])->group(function (): void {
            Route::get('/overview', [AdminOverviewController::class, 'show']);

            Route::get('/payments', [AdminPaymentController::class, 'index']);
            Route::post('/payments', [AdminPaymentController::class, 'store']);
            Route::patch('/payments/{payment}/review', [AdminPaymentController::class, 'review']);

            Route::get('/users', [AdminUserController::class, 'index']);
            Route::post('/users', [AdminUserController::class, 'store']);
            Route::get('/users/options', [AdminUserController::class, 'options']);
            Route::patch('/users/{user}', [AdminUserController::class, 'update']);
            Route::patch('/users/{user}/subscription', [AdminUserController::class, 'setSubscription']);

            Route::get('/reports', [AdminReportController::class, 'index']);

            Route::get('/notifications', [AdminNotificationController::class, 'index']);
            Route::post('/notifications', [AdminNotificationController::class, 'store']);

            Route::get('/emails', [AdminEmailController::class, 'index']);
            Route::post('/emails', [AdminEmailController::class, 'store']);

            Route::get('/settings', [AdminSettingsController::class, 'show']);
            Route::put('/settings', [AdminSettingsController::class, 'update']);

            Route::get('/landing', [AdminLandingController::class, 'show']);
            Route::put('/landing', [AdminLandingController::class, 'update']);
            Route::post('/landing/download', [AdminLandingController::class, 'uploadDownload']);
            Route::delete('/landing/download', [AdminLandingController::class, 'deleteDownload']);

            Route::get('/plans', [AdminPlanController::class, 'index']);
            Route::put('/plans', [AdminPlanController::class, 'update']);

            Route::put('/payment-methods', [AdminPaymentMethodControllerAlias::class, 'update']);

            Route::get('/profile', [AdminProfileController::class, 'show']);
            Route::put('/profile', [AdminProfileController::class, 'update']);
            Route::put('/profile/password', [AdminProfileController::class, 'updatePassword']);
        });
    });
});
