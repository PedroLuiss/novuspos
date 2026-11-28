<?php

namespace App\Services\Panel;

use App\Models\AdminNotification;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class UserNotificationService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function list(User $user, array $filters): array
    {
        $page = max(1, (int) ($filters['page'] ?? 1));
        $pageSize = (int) ($filters['pageSize'] ?? 20);
        $pageSize = in_array($pageSize, [20, 50, 100], true) ? $pageSize : 20;
        $search = trim((string) ($filters['search'] ?? ''));
        $type = (string) ($filters['type'] ?? 'all');
        $status = (string) ($filters['status'] ?? 'all');

        $query = $this->baseQuery($user);

        if ($type !== '' && $type !== 'all') {
            $query->where('admin_notifications.type', $type);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('admin_notifications.title', 'like', "%{$search}%")
                    ->orWhere('admin_notifications.description', 'like', "%{$search}%");
            });
        }

        if ($status === 'unread') {
            $query->whereNull('anr.id');
        } elseif ($status === 'read') {
            $query->whereNotNull('anr.id');
        }

        $query->orderByRaw('CASE WHEN anr.id IS NULL THEN 0 ELSE 1 END ASC')
            ->orderByDesc('admin_notifications.created_at')
            ->orderByDesc('admin_notifications.id');

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->paginate($pageSize, [
            'admin_notifications.*',
            'anr.read_at as user_read_at',
        ], 'page', $page);

        return [
            'items' => $paginator->getCollection()->map(function ($row): array {
                $readAt = $row->user_read_at ?? null;

                return [
                    'id' => (string) $row->id,
                    'title' => (string) $row->title,
                    'description' => (string) $row->description,
                    'link' => (string) ($row->link ?? ''),
                    'icon' => (string) ($row->icon ?? 'campaign'),
                    'type' => (string) $row->type,
                    'audience' => (string) $row->audience,
                    'audienceLabel' => (string) $row->audience_label,
                    'createdAt' => $row->created_at ? now()->parse($row->created_at)->toISOString() : now()->toISOString(),
                    'isRead' => $readAt !== null,
                    'readAt' => $readAt ? now()->parse($readAt)->toISOString() : null,
                ];
            })->values()->all(),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'unreadCount' => $this->unreadCount($user),
        ];
    }

    public function unreadCount(User $user): int
    {
        return $this->baseQuery($user)->whereNull('anr.id')->count();
    }

    /**
     * @param  array<int, string|int>  $ids
     */
    public function markRead(User $user, array $ids): int
    {
        $notificationIds = collect($ids)
            ->map(fn ($id) => (int) $id)
            ->filter(fn (int $id) => $id > 0)
            ->unique()
            ->values();

        if ($notificationIds->isEmpty()) {
            return 0;
        }

        $allowedIds = $this->visibleNotificationIds($user, $notificationIds->all());
        if ($allowedIds->isEmpty()) {
            return 0;
        }

        $now = now();
        $rows = $allowedIds->map(fn (int $id): array => [
            'admin_notification_id' => $id,
            'user_id' => $user->id,
            'read_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        DB::table('admin_notification_reads')->upsert(
            $rows,
            ['admin_notification_id', 'user_id'],
            ['read_at', 'updated_at'],
        );

        return count($rows);
    }

    public function markAllRead(User $user): int
    {
        $ids = $this->baseQuery($user)
            ->whereNull('anr.id')
            ->pluck('admin_notifications.id')
            ->map(fn ($id) => (int) $id)
            ->all();

        return $this->markRead($user, $ids);
    }

    /**
     * @param  array<int, int>  $notificationIds
     * @return Collection<int, int>
     */
    private function visibleNotificationIds(User $user, array $notificationIds)
    {
        return $this->baseQuery($user)
            ->whereIn('admin_notifications.id', $notificationIds)
            ->pluck('admin_notifications.id')
            ->map(fn ($id) => (int) $id)
            ->values();
    }

    private function baseQuery(User $user)
    {
        $userId = (string) $user->id;

        return AdminNotification::query()
            ->leftJoin('admin_notification_reads as anr', function ($join) use ($user): void {
                $join->on('anr.admin_notification_id', '=', 'admin_notifications.id')
                    ->where('anr.user_id', '=', $user->id);
            })
            ->where(function ($query) use ($userId): void {
                $query->where('admin_notifications.audience', 'all')
                    ->orWhere('admin_notifications.audience', $userId);
            });
    }
}
