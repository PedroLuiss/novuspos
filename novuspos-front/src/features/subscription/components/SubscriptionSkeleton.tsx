import { Skeleton, SkeletonCard, SkeletonHeader, SkeletonLines, SkeletonPage, SkeletonTable } from '@/shared/ui/Skeleton'

/** Suscripción: catálogo, plan contratado e historial mientras cargan. */
export function SubscriptionSkeleton() {
  return (
    <SkeletonPage label="Cargando tu suscripción…">
      <SkeletonHeader />
      <SkeletonCard rows={3}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md pt-space-xs">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex flex-col gap-space-sm rounded-lg border border-outline-variant bg-surface-container-low p-space-md">
              <Skeleton className="h-5 w-32" />
              <SkeletonLines widths={['90%', '70%']} />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </SkeletonCard>
      <SkeletonCard rows={3} />
      <SkeletonCard rows={2}>
        <SkeletonTable rows={4} columns={8} />
      </SkeletonCard>
    </SkeletonPage>
  )
}
