import { AdminSkeletonCard, AdminSkeletonHeader, AdminSkeletonPage } from '@/features/admin/core/ui/AdminSkeleton'

/** Forma de la pantalla de perfil mientras carga. */
export function ProfileSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando perfil…">
      <AdminSkeletonHeader />
      <AdminSkeletonCard rows={4} />
      <AdminSkeletonCard rows={5} />
    </AdminSkeletonPage>
  )
}
