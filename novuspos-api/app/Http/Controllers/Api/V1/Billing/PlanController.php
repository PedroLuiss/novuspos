<?php

namespace App\Http\Controllers\Api\V1\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\PlanService;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    public function __construct(
        private readonly PlanService $planService,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'plans' => $this->planService->listActive(),
        ]);
    }
}
