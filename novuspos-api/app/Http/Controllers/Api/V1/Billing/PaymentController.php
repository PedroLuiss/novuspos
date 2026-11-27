<?php

namespace App\Http\Controllers\Api\V1\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Billing\ReviewPaymentRequest;
use App\Http\Requests\Api\V1\Billing\StorePaymentRequest;
use App\Services\Billing\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->subscriptionService->payments($request->user()));
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        return response()->json(
            $this->subscriptionService->submitPayment($request->user(), $request->validated()),
            201,
        );
    }

    public function review(ReviewPaymentRequest $request, int $payment): JsonResponse
    {
        $data = $request->validated();

        return response()->json(
            $this->subscriptionService->reviewPayment(
                $request->user(),
                $payment,
                (bool) $data['approved'],
                $data['note'] ?? null,
            ),
        );
    }
}
