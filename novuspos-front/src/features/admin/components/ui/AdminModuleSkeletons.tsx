import {
  AdminSkeleton,
  AdminSkeletonCard,
  AdminSkeletonHeader,
  AdminSkeletonList,
  AdminSkeletonMetricGrid,
  AdminSkeletonPage,
  AdminSkeletonTable,
} from './AdminSkeleton'
import { AdminCard } from './AdminUi'

/** Cada módulo del panel maestro muestra la forma de su contenido mientras carga. */

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

export function PlansSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando suscripciones…">
      <AdminSkeletonHeader />
      <AdminSkeletonCard rows={6} />
    </AdminSkeletonPage>
  )
}

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

export function NotificationsSkeleton() {
  return (
    <AdminSkeletonPage label="Cargando notificaciones…">
      <AdminSkeletonHeader />
      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <AdminSkeletonCard className="lg:col-span-7 min-h-[420px]" rows={7} />
        <AdminSkeletonCard className="lg:col-span-5 min-h-[420px]" rows={4} />
      </div>
      <AdminSkeletonCard rows={5}>
        <AdminSkeletonList rows={4} />
      </AdminSkeletonCard>
    </AdminSkeletonPage>
  )
}

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

export function PaymentMethodsSkeleton() {
  return (
    <AdminCard icon="payments" title="Métodos de pago" description="Cuentas y datos que verán tus clientes al pagar su suscripción.">
      <AdminSkeletonList rows={3} />
    </AdminCard>
  )
}

/** Pantalla de espera del guardián maestro, con la misma familia visual. */
export function AdminGateSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-space-md bg-surface" role="status" aria-label="Abriendo el panel del dueño…">
      <AdminSkeleton className="h-12 w-12 rounded-full" />
      <AdminSkeleton className="h-3 w-56" />
      <AdminSkeleton className="h-2 w-32" />
    </div>
  )
}
