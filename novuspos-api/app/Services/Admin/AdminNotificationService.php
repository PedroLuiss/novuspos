<?php

namespace App\Services\Admin;

use App\Models\AdminNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminNotificationService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function list(array $filters): array
    {
        $page = max(1, (int) ($filters['page'] ?? 1));
        $pageSize = (int) ($filters['pageSize'] ?? 20);
        $pageSize = in_array($pageSize, [20, 50, 100], true) ? $pageSize : 20;
        $search = trim((string) ($filters['search'] ?? ''));
        $type = (string) ($filters['type'] ?? 'all');
        $audience = (string) ($filters['audience'] ?? '');

        $query = AdminNotification::query();

        if ($type !== '' && $type !== 'all') {
            $query->where('type', $type);
        }

        if ($audience !== '') {
            $query->where('audience', $audience);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('audience_label', 'like', "%{$search}%");
            });
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->latest()->paginate($pageSize, ['*'], 'page', $page);

        return [
            'items' => $paginator->getCollection()->map(fn (AdminNotification $n): array => $this->toArray($n))->values()->all(),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $notification = AdminNotification::query()->create([
            'title' => $data['title'],
            'description' => $data['description'],
            'link' => $data['link'] ?? '',
            'icon' => $data['icon'] ?? 'campaign',
            'type' => $data['type'] ?? 'info',
            'audience' => $data['audience'] ?? 'all',
            'audience_label' => $data['audienceLabel'] ?? 'Todos los usuarios',
        ]);

        return $this->toArray($notification);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(AdminNotification $notification): array
    {
        return [
            'id' => (string) $notification->id,
            'title' => $notification->title,
            'description' => $notification->description,
            'link' => $notification->link ?? '',
            'icon' => $notification->icon ?? 'campaign',
            'type' => $notification->type,
            'audience' => $notification->audience,
            'audienceLabel' => $notification->audience_label,
            'createdAt' => $notification->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }
}
