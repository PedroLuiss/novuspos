<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminCreateEmailRequest;
use App\Services\Admin\AdminEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEmailController extends Controller
{
    public function __construct(
        private readonly AdminEmailService $emailService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->emailService->list($request->query()));
    }

    public function store(AdminCreateEmailRequest $request): JsonResponse
    {
        return response()->json($this->emailService->create($request->validated()), 201);
    }
}
