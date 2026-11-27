<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LandingConfig;
use App\Support\LandingDefaults;
use Illuminate\Http\JsonResponse;

class LandingConfigController extends Controller
{
    public function show(): JsonResponse
    {
        $landingConfig = LandingConfig::query()->latest('id')->first();

        if ($landingConfig === null) {
            return response()->json([
                'config' => LandingDefaults::config(),
            ]);
        }

        $config = is_array($landingConfig->config) ? $landingConfig->config : LandingDefaults::config();

        return response()->json([
            'config' => $config,
            'updatedAt' => $landingConfig->updated_at?->toISOString(),
        ]);
    }
}
