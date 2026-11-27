<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminSavePlansRequest;
use App\Services\Billing\PlanService;
use Illuminate\Http\JsonResponse;

class AdminPlanController extends Controller
{
    public function __construct(
        private readonly PlanService $planService,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->planService->listAll());
    }

    public function update(AdminSavePlansRequest $request): JsonResponse
    {
        return response()->json($this->planService->replaceAll($request->validated()['plans']));
    }
}
