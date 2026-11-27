<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminSaveSettingsRequest;
use App\Services\Admin\AdminSettingsService;
use Illuminate\Http\JsonResponse;

class AdminSettingsController extends Controller
{
    public function __construct(
        private readonly AdminSettingsService $settingsService,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json($this->settingsService->get());
    }

    public function update(AdminSaveSettingsRequest $request): JsonResponse
    {
        return response()->json($this->settingsService->save($request->validated()));
    }
}
