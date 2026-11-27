<?php

use App\Http\Controllers\Api\V1\LandingConfigController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/landing/config', [LandingConfigController::class, 'show']);
});
