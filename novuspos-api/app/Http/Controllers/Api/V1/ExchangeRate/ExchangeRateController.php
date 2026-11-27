<?php

namespace App\Http\Controllers\Api\V1\ExchangeRate;

use App\Http\Controllers\Controller;
use App\Services\ExchangeRate\ExchangeRateService;
use Illuminate\Http\JsonResponse;

class ExchangeRateController extends Controller
{
    public function __construct(
        private readonly ExchangeRateService $exchangeRateService,
    ) {}

    public function today(): JsonResponse
    {
        return response()->json($this->exchangeRateService->today());
    }
}
