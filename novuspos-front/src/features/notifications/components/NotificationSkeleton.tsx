import { Skeleton, SkeletonLines } from '@/shared/ui/Skeleton'

export function NotificationListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-outline-variant/15" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="px-space-md py-space-sm flex gap-space-sm">
          <Skeleton className="mt-0.5 w-8 h-8 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <SkeletonLines widths={['100%', '60%']} />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NotificationsPageSkeleton() {
  return (
    <div className="flex flex-col gap-space-lg" role="status" aria-label="Cargando notificaciones…">
      <span className="sr-only">Cargando notificaciones…</span>
      <div className="flex flex-wrap items-start justify-between gap-space-md">
        <div className="flex flex-col gap-space-sm">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-56 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-52 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm">
        <Skeleton className="h-16 rounded-lg md:col-span-2" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden">
        <NotificationListSkeleton rows={6} />
      </div>
    </div>
  )
}
