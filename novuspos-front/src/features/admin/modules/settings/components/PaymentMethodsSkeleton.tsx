import { AdminSkeletonList } from '@/features/admin/core/ui/AdminSkeleton'
import { AdminCard } from '@/features/admin/core/ui/AdminUi'

/** Forma del catálogo de métodos de pago dentro de Ajustes. */
export function PaymentMethodsSkeleton() {
  return (
    <AdminCard icon="payments" title="Métodos de pago" description="Cuentas y datos que verán tus clientes al pagar su suscripción.">
      <AdminSkeletonList rows={3} />
    </AdminCard>
  )
}
