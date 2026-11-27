import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonMetricGrid,
  AdminSkeletonPage,
  AdminSkeletonTable,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma del historial de pagos mientras carga. */
export function PaymentsSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando pagos…">
      <AdminSkeletonHeader />
      <AdminSkeletonMetricGrid count={4} />
      <AdminSkeletonCard rows={2} />
      <AdminSkeletonCard rows={6}>
        <AdminSkeletonTable rows={6} columns={7} />
      </AdminSkeletonCard>
    </AdminSkeletonPage>
  )
}
