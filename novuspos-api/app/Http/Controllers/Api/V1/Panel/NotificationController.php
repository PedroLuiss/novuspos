<?php

namespace App\Http\Controllers\Api\V1\Panel;

use App\Http\Controllers\Controller;
use App\Services\Panel\UserNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private readonly UserNotificationService $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->notificationService->list($request->user(), $request->query()));
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'unreadCount' => $this->notificationService->unreadCount($request->user()),
        ]);
    }

    public function markRead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['sometimes', 'array'],
            'ids.*' => ['integer'],
            'all' => ['sometimes', 'boolean'],
        ]);

        $marked = ! empty($validated['all'])
            ? $this->notificationService->markAllRead($request->user())
            : $this->notificationService->markRead($request->user(), $validated['ids'] ?? []);

        return response()->json([
            'marked' => $marked,
            'unreadCount' => $this->notificationService->unreadCount($request->user()),
        ]);
    }
}
