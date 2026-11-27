<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminReviewPaymentRequest;
use App\Services\Admin\AdminPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function __construct(
        private readonly AdminPaymentService $paymentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->paymentService->list($request->query()));
    }

    public function review(AdminReviewPaymentRequest $request, string $payment): JsonResponse
    {
        $data = $request->validated();

        return response()->json($this->paymentService->review($payment, (bool) $data['approved'], $data['note'] ?? null));
    }
}
