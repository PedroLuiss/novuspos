import { MS } from '@/shared/ui/MS'
import { useAdminOverview } from '../hooks/useAdminOverview'
import { formatAdminDate, formatUsd, paymentTone } from '@/features/admin/core/lib/adminFormatters'
import { adminCard, adminEyebrow, adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import { OverviewSkeleton } from './OverviewSkeleton'
import { AdminAvatar, AdminBadge, AdminCard, AdminPageHeader, AdminState } from '@/features/admin/core/ui/AdminUi'
import { planDonutLegend } from './PlanDonutLegend'
import { PlanDonut } from './PlanDonut'
import { OVERVIEW_METRICS, PAYMENT_STATUS_LABELS } from '../constants'

/** Portada maestra: resumen ejecutivo, distribución de planes y actividad. */
export function AdminOverview() {
  const { overview, isLoading, error, refresh } = useAdminOverview()

  if (isLoading && !overview) return <OverviewSkeleton />
  if (!overview) {
    return (
      <AdminCard title="No pudimos cargar el resumen" icon="cloud_off">
        <p className="font-body-md text-body-md text-on-surface-variant">{error ?? 'Inténtalo nuevamente en unos segundos.'}</p>
        <button type="button" onClick={() => void refresh()} className={`${adminPrimaryButton} self-start`}>
          <MS name="refresh" className="text-[18px]" /> Reintentar
        </button>
      </AdminCard>
    )
  }

  const totalSubscriptions = overview.planSales.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Vista general"
        title="Buen día, dueño de NovusPOS"
        description="Así va el negocio hoy. Evalúa pagos, atiende reportes y mantén a tus usuarios al día."
      />

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admin-ink via-admin-ink-soft to-primary p-space-lg text-white shadow-[0_24px_60px_-30px_rgba(10,23,52,0.9)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 top-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col gap-space-md lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex flex-col gap-space-xs">
            <span className={`${adminEyebrow} text-[#9fc5ff]`}>Centro de control</span>
            <h2 className="font-headline-md text-headline-md font-bold">Todo lo que pasa en NovusPOS, en un solo lugar</h2>
            <p className="font-body-md text-body-md text-white/75">
              Revisa los cobros que llegaron, da respuesta a los reportes y publica novedades para tus comercios.
            </p>
          </div>
          <div className="flex flex-col gap-space-sm lg:items-end">
            <span className="inline-flex items-center gap-space-xs rounded-full bg-white/10 px-space-sm py-1.5 font-label-sm text-label-sm text-white/90 backdrop-blur">
              <MS name="pending_actions" className="text-[16px]" />
              {overview.pendingPayments} {overview.pendingPayments === 1 ? 'pago esperando revisión' : 'pagos esperando revisión'}
            </span>
            <div className="flex flex-wrap gap-space-xs">
              <a href="/administracion/pagos" className={`${adminPrimaryButton} bg-white text-primary hover:bg-[#eef2ff]`}>
                <MS name="fact_check" className="text-[18px]" /> Revisar pagos
              </a>
              <a href="/administracion/usuarios" className="rounded-xl border border-white/30 px-space-md py-2.5 font-label-md text-label-md font-semibold text-white transition hover:bg-white/10">
                Ver usuarios
              </a>
            </div>
          </div>
        </div>
      </section>

      {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
        {OVERVIEW_METRICS.map((metric) => (
          <div key={metric.key} className={`${adminCard} border-t-[3px] ${metric.accent} p-space-md transition hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{metric.label}</span>
              <span className="w-9 h-9 shrink-0 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <MS name={metric.icon} className="text-[19px]" />
              </span>
            </div>
            <span className="font-headline-lg text-headline-lg font-bold leading-none text-on-surface">{overview[metric.key]}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{metric.hint}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <AdminCard
          className="lg:col-span-5"
          icon="pie_chart"
          title="Suscripciones más vendidas"
          description="Distribución según el plan vigente de cada comercio"
        >
          <div className="flex flex-col items-center gap-space-md sm:flex-row lg:flex-col xl:flex-row">
            <PlanDonut data={overview.planSales} total={totalSubscriptions} />
            <div className="flex w-full flex-1 flex-col gap-space-sm">
              {planDonutLegend(overview.planSales, totalSubscriptions)}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/50 pt-space-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Ingresos aprobados (USD)</span>
            <span className="font-headline-sm text-headline-sm font-mono font-bold text-primary">{formatUsd(overview.revenueUsd)}</span>
          </div>
        </AdminCard>

        <AdminCard
          className="lg:col-span-7"
          icon="receipt_long"
          title="Pagos recientes"
          description="Últimos comprobantes recibidos"
          action={<a href="/administracion/pagos" className="font-label-md text-label-md font-semibold text-primary hover:underline">Ver todos →</a>}
        >
          {overview.recentPayments.length === 0 ? (
            <AdminState label="Aún no hay pagos registrados." />
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/50">
              {overview.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-space-sm py-space-xs first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <AdminAvatar name={payment.userName} tone={payment.status === 'approved' ? 'secondary' : 'primary'} />
                    <div className="min-w-0">
                      <span className="block truncate font-label-md text-label-md font-semibold text-on-surface">{payment.userName}</span>
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">
                        {payment.planName} · {formatAdminDate(payment.paidAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-space-sm">
                    <span className="font-label-md text-label-md font-mono font-bold text-on-surface">{formatUsd(payment.amount)}</span>
                    <AdminBadge tone={paymentTone(payment.status)}>{statusLabel(payment.status)}</AdminBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <AdminCard icon="fact_check" title="Requiere tu atención" description="Dos cosas que conviene resolver hoy">
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          <a href="/administracion/pagos" className="flex items-center justify-between rounded-xl bg-[#fff8e8] px-space-md py-space-sm transition hover:bg-[#fff2d2]">
            <div className="flex items-center gap-space-sm">
              <MS name="pending_actions" className="text-[22px] text-[#a86a00]" />
              <div>
                <span className="block font-label-md text-label-md font-semibold text-on-surface">Pagos por aprobar</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Confirma cada comprobante con tu banco</span>
              </div>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-[#a86a00]">{overview.pendingPayments}</span>
          </a>
          <a href="/administracion/reportes" className="flex items-center justify-between rounded-xl bg-error-container/60 px-space-md py-space-sm transition hover:bg-error-container">
            <div className="flex items-center gap-space-sm">
              <MS name="report_problem" className="text-[22px] text-error" />
              <div>
                <span className="block font-label-md text-label-md font-semibold text-on-surface">Reportes abiertos</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Casos del portal y del escritorio</span>
              </div>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-error">{overview.openReports}</span>
          </a>
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <button type="button" onClick={() => void refresh()} className={adminSecondaryButton}>
          <MS name="refresh" className="text-[18px]" /> Actualizar resumen
        </button>
      </div>
    </div>
  )
}

function statusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status] ?? status
}
