<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminOverviewService;
use Illuminate\Http\JsonResponse;

class AdminOverviewController extends Controller
{
    public function __construct(
        private readonly AdminOverviewService $overviewService,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json($this->overviewService->overview());
    }
}
