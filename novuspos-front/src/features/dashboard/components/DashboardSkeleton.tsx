import { Skeleton, SkeletonCard, SkeletonLines, SkeletonPage } from '@/shared/ui/Skeleton'

/** Portada del panel mientras llega el resumen de clave, suscripción y respaldo. */
export function DashboardSkeleton() {
  return (
    <SkeletonPage label="Cargando tu panel…">
      <SkeletonCard className="min-h-[190px]" rows={4}>
        <div className="flex flex-col gap-space-sm pt-space-xs">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-80 max-w-full" />
          <SkeletonLines widths={['70%', '52%']} />
          <div className="flex gap-space-sm pt-space-xs">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </SkeletonCard>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        <SkeletonCard className="lg:col-span-8 min-h-[300px]" rows={5} />
        <SkeletonCard className="lg:col-span-4 min-h-[300px]" rows={4} />
      </div>
    </SkeletonPage>
  )
}
