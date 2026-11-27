<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminSavePaymentMethodsRequest;
use App\Services\Billing\PaymentMethodService;
use Illuminate\Http\JsonResponse;

class AdminPaymentMethodController extends Controller
{
    public function __construct(
        private readonly PaymentMethodService $paymentMethodService,
    ) {}

    public function update(AdminSavePaymentMethodsRequest $request): JsonResponse
    {
        return response()->json($this->paymentMethodService->replaceAll($request->validated()['methods']));
    }
}
