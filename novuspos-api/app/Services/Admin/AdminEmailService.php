<?php

namespace App\Services\Admin;

use App\Models\AdminEmail;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminEmailService
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
        $audience = (string) ($filters['audience'] ?? '');

        $query = AdminEmail::query();

        if ($audience !== '') {
            $query->where('audience', $audience);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('body_text', 'like', "%{$search}%")
                    ->orWhere('audience_label', 'like', "%{$search}%");
            });
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->latest()->paginate($pageSize, ['*'], 'page', $page);

        return [
            'items' => $paginator->getCollection()->map(fn (AdminEmail $e): array => $this->toArray($e))->values()->all(),
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
        $email = AdminEmail::query()->create([
            'subject' => $data['subject'],
            'body' => $data['body'],
            'body_text' => $data['bodyText'] ?? null,
            'audience' => $data['audience'] ?? 'all',
            'audience_label' => $data['audienceLabel'] ?? 'Todos los usuarios',
        ]);

        return $this->toArray($email);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(AdminEmail $email): array
    {
        return [
            'id' => (string) $email->id,
            'subject' => $email->subject,
            'body' => $email->body,
            'bodyText' => $email->body_text,
            'audience' => $email->audience,
            'audienceLabel' => $email->audience_label,
            'createdAt' => $email->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }
}
