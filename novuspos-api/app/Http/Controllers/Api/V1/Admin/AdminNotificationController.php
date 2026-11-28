<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Events\UserNotificationCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminCreateNotificationRequest;
use App\Services\Admin\AdminNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function __construct(
        private readonly AdminNotificationService $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->notificationService->list($request->query()));
    }

    public function store(AdminCreateNotificationRequest $request): JsonResponse
    {
        $notification = $this->notificationService->create($request->validated());

        UserNotificationCreated::dispatch($notification);

        return response()->json($notification, 201);
    }
}
