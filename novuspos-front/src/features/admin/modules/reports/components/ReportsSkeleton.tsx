import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonMetricGrid,
  AdminSkeletonPage,
  AdminSkeletonTable,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma del historial de incidencias mientras carga. */
export function ReportsSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando reportes…">
      <AdminSkeletonHeader />
      <AdminSkeletonMetricGrid count={3} />
      <AdminSkeletonCard rows={3} />
      <AdminSkeletonCard rows={6}>
        <AdminSkeletonTable rows={6} columns={6} />
      </AdminSkeletonCard>
    </AdminSkeletonPage>
  )
}
