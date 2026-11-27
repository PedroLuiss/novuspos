import {
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonPage,
} from '@/features/admin/core/ui/AdminSkeleton'
import { PaymentMethodsSkeleton } from './PaymentMethodsSkeleton'

/** Forma de los ajustes generales y del catálogo de cobro mientras cargan. */
export function SettingsSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando ajustes…">
      <AdminSkeletonHeader />
      <div className="grid grid-cols-1 items-start gap-space-md lg:grid-cols-2">
        <AdminSkeletonCard rows={6} />
        <AdminSkeletonCard rows={6} />
      </div>
      <PaymentMethodsSkeleton />
    </AdminSkeletonPage>
  )
}
