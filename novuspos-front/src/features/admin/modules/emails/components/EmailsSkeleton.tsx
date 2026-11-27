import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonList,
  AdminSkeletonPage,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma del compose e historial de correos mientras carga. */
export function EmailsSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando correos…">
      <AdminSkeletonHeader />
      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <AdminSkeletonCard className="lg:col-span-8 min-h-[420px]" rows={7} />
        <AdminSkeletonCard className="lg:col-span-4 min-h-[420px]" rows={4} />
      </div>
      <AdminSkeletonCard rows={5}>
        <AdminSkeletonList rows={4} />
      </AdminSkeletonCard>
    </AdminSkeletonPage>
  )
}
