<?php

namespace App\Services\Admin;

use App\Models\SupportTicket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminReportService
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
        $source = (string) ($filters['source'] ?? 'all');
        $status = (string) ($filters['status'] ?? 'all');

        $query = SupportTicket::query()->with('user');

        if ($source !== '' && $source !== 'all') {
            $query->where('source', $source);
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search): void {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('organization_name', 'like', "%{$search}%");
                    });
            });
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->latest()->paginate($pageSize, ['*'], 'page', $page);

        $base = SupportTicket::query();
        if ($search !== '') {
            $base->where(function ($q) use ($search): void {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search): void {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('organization_name', 'like', "%{$search}%");
                    });
            });
        }

        return [
            'items' => $paginator->getCollection()->map(fn (SupportTicket $t): array => $this->toArray($t))->values()->all(),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'summary' => [
                'total' => (clone $base)->count(),
                'open' => (clone $base)->where('status', 'open')->count(),
                'resolved' => (clone $base)->where('status', 'resolved')->count(),
                'web' => (clone $base)->where('source', 'web')->count(),
                'desktop' => (clone $base)->where('source', 'desktop')->count(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(SupportTicket $ticket): array
    {
        $user = $ticket->user;

        return [
            'id' => (string) $ticket->id,
            'userId' => (string) ($ticket->user_id ?? ''),
            'userName' => $user?->organization_name ?? $user?->name ?? $ticket->email,
            'subject' => $ticket->subject,
            'description' => $ticket->description,
            'source' => in_array($ticket->source, ['web', 'desktop'], true) ? $ticket->source : 'web',
            'status' => $ticket->status === 'resolved' ? 'resolved' : 'open',
            'createdAt' => $ticket->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }
}
