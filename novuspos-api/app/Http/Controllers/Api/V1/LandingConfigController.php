<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Landing\LandingConfigService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LandingConfigController extends Controller
{
    public function __construct(
        private readonly LandingConfigService $landingConfigService,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json($this->landingConfigService->getPublicConfig());
    }

    public function download(): StreamedResponse
    {
        return $this->landingConfigService->downloadResponse();
    }
}
