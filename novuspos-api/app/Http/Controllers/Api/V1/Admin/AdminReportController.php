<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    public function __construct(
        private readonly AdminReportService $reportService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->reportService->list($request->query()));
    }
}
