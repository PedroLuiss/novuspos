<?php

namespace App\Services\Admin;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\SupportTicket;
use App\Models\User;

class AdminOverviewService
{
    public function __construct(
        private readonly AdminPaymentService $adminPaymentService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function overview(): array
    {
        $totalUsers = User::query()->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'))->count();

        $unpaidUsers = User::query()
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'))
            ->whereHas('latestSubscription', fn ($q) => $q->whereIn('status', ['expired', 'cancelled', 'pending_review']))
            ->count();

        $pendingPayments = Payment::query()->where('status', 'pending_review')->count();
        $approvedPayments = Payment::query()->where('status', 'approved')->count();
        $revenueUsd = (float) Payment::query()->where('status', 'approved')->sum('amount');
        $openReports = SupportTicket::query()->where('status', 'open')->count();

        $planSales = Payment::query()
            ->where('status', 'approved')
            ->selectRaw("COALESCE(plan_slug, 'unknown') as plan_slug, COUNT(*) as count")
            ->groupBy('plan_slug')
            ->get()
            ->map(function ($row): array {
                $plan = Plan::query()->where('slug', $row->plan_slug)->first();

                return [
                    'planName' => $plan?->name ?? (string) $row->plan_slug,
                    'count' => (int) $row->count,
                ];
            })
            ->values()
            ->all();

        $recentPayments = Payment::query()
            ->with(['user', 'subscription'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Payment $payment): array => $this->adminPaymentService->toArray($payment))
            ->values()
            ->all();

        return [
            'totalUsers' => $totalUsers,
            'unpaidUsers' => $unpaidUsers,
            'pendingPayments' => $pendingPayments,
            'approvedPayments' => $approvedPayments,
            'revenueUsd' => $revenueUsd,
            'openReports' => $openReports,
            'planSales' => $planSales,
            'recentPayments' => $recentPayments,
        ];
    }
}
