<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminSetSubscriptionRequest;
use App\Http\Requests\Api\V1\Admin\AdminUpdateUserRequest;
use App\Services\Admin\AdminUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function __construct(
        private readonly AdminUserService $userService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->userService->list($request->query()));
    }

    public function options(): JsonResponse
    {
        return response()->json($this->userService->options());
    }

    public function update(AdminUpdateUserRequest $request, string $user): JsonResponse
    {
        return response()->json($this->userService->update($user, $request->validated()));
    }

    public function setSubscription(AdminSetSubscriptionRequest $request, string $user): JsonResponse
    {
        $data = $request->validated();

        return response()->json($this->userService->setSubscription($user, $data['planId'], (bool) $data['active']));
    }
}
