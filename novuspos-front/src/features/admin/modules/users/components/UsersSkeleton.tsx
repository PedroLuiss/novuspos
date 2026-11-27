import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonMetricGrid,
  AdminSkeletonPage,
  AdminSkeletonTable,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma del directorio de comercios mientras carga. */
export function UsersSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando usuarios…">
      <AdminSkeletonHeader />
      <AdminSkeletonMetricGrid count={3} />
      <AdminSkeletonCard rows={2} />
      <AdminSkeletonCard rows={6}>
        <AdminSkeletonTable rows={6} columns={6} />
      </AdminSkeletonCard>
    </AdminSkeletonPage>
  )
}
