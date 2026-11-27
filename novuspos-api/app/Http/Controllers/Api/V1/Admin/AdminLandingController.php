<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminSaveLandingRequest;
use App\Services\Landing\LandingConfigService;
use Illuminate\Http\JsonResponse;

class AdminLandingController extends Controller
{
    public function __construct(
        private readonly LandingConfigService $landingConfigService,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json($this->landingConfigService->getAdminConfig());
    }

    public function update(AdminSaveLandingRequest $request): JsonResponse
    {
        return response()->json($this->landingConfigService->save($request->validated()['config']));
    }
}
