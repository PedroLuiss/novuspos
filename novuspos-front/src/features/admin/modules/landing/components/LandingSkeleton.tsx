import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonPage,
} from '@/features/admin/core/ui/AdminSkeleton'

/** Forma del constructor de la landing mientras carga. */
export function LandingSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando el constructor de la landing…">
      <AdminSkeletonHeader />
      <div className="grid items-start grid-cols-1 gap-space-lg xl:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
        <AdminSkeletonCard className="min-h-[560px]" rows={8} />
        <AdminSkeletonCard className="min-h-[560px]" rows={3} />
      </div>
    </AdminSkeletonPage>
  )
}
