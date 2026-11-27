import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonPage,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma del catálogo de suscripciones mientras carga. */
export function PlansSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando suscripciones…">
      <AdminSkeletonHeader />
      <AdminSkeletonCard rows={6} />
    </AdminSkeletonPage>
  )
}
