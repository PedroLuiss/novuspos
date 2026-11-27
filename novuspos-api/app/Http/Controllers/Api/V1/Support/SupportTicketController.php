<?php

namespace App\Http\Controllers\Api\V1\Support;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Support\StoreSupportTicketRequest;
use App\Services\Support\SupportTicketService;
use Illuminate\Http\JsonResponse;

class SupportTicketController extends Controller
{
    public function __construct(
        private readonly SupportTicketService $supportTicketService,
    ) {}

    public function store(StoreSupportTicketRequest $request): JsonResponse
    {
        $ticket = $this->supportTicketService->submit(
            $request->validated(),
            $request->user()?->id,
        );

        return response()->json($ticket, 201);
    }
}
