<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminLoginRequest;
use App\Services\Admin\AdminAuthService;
use Illuminate\Http\JsonResponse;

class AdminAuthController extends Controller
{
    public function __construct(
        private readonly AdminAuthService $adminAuthService,
    ) {}

    public function login(AdminLoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        return response()->json($this->adminAuthService->login($data['email'], $data['password']));
    }
}
