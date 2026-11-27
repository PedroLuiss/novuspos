import {
  AdminSkeleton,
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonMetricGrid,
  AdminSkeletonPage,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma de la portada mientras llega el resumen ejecutivo. */
export function OverviewSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando el resumen…">
      <AdminSkeletonHeader />
      <AdminSkeleton className="h-44 w-full rounded-2xl" />
      <AdminSkeletonMetricGrid />
      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <AdminSkeletonCard className="lg:col-span-5" rows={3} />
        <AdminSkeletonCard className="lg:col-span-7" rows={5} />
      </div>
    </AdminSkeletonPage>
  )
}
