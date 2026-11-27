import { useEffect, useMemo, useState } from 'react'
import { usePaymentMethods } from '@/shared/hooks/usePaymentMethods'
import { paymentMethodLabel, paymentMethodLabels } from '@/shared/services/payment-methods/paymentMethodLabels'
import { MS } from '@/shared/ui/MS'
import { useAdminPayments } from '../hooks/useAdminPayments'
import { formatAdminDate, formatUsd, paymentTone, statusLabels } from '@/features/admin/core/lib/adminFormatters'
import { adminCompactButton, adminInput, adminPrimaryButton, adminSecondaryButton, adminTd, adminTh } from '@/features/admin/core/lib/adminStyles'
import type { AdminCreatePaymentPayload, AdminPayment, PaymentPageSize } from '../types'
import { PaymentsSkeleton } from './PaymentsSkeleton'
import { AdminAlert, AdminAvatar, AdminBadge, AdminCard, AdminFilterChip, AdminPageHeader, AdminState } from '@/features/admin/core/ui/AdminUi'
import { PaymentCreateModal } from './PaymentCreateModal'
import { PaymentReviewModal } from './PaymentReviewModal'
import { PAYMENT_PAGE_SIZES, PAYMENT_STATUS_CHIPS, PAYMENT_SUMMARY_CARDS } from '../constants'

/** Gestión manual de pagos: tabla paginada y revisión del comprobante. */
export function PaymentsPage() {
  const {
    payments,
    total,
    page,
    pageSize,
    totalPages,
    summary,
    query,
    isLoading,
    busyId,
    error,
    setSearch,
    setStatus,
    setPageSize,
    setPage,
    resetFilters,
    create,
    review,
  } = useAdminPayments()
  const [searchDraft, setSearchDraft] = useState(query.search)
  const [selected, setSelected] = useState<AdminPayment | null>(null)
  const [creating, setCreating] = useState(false)
  const [creatingBusy, setCreatingBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const { methods } = usePaymentMethods()
  const methodLabels = useMemo(() => paymentMethodLabels(methods), [methods])

  useEffect(() => {
    if (searchDraft === query.search) return
    const timer = window.setTimeout(() => setSearch(searchDraft), 300)
    return () => window.clearTimeout(timer)
  }, [searchDraft, query.search, setSearch])

  const clearFilters = () => {
    setSearchDraft('')
    resetFilters()
  }

  const first = total > 0 ? (page - 1) * pageSize + 1 : 0
  const last = total > 0 ? Math.min(page * pageSize, total) : 0
  const hasFilters = Boolean(query.search || query.status !== 'pending')

  if (isLoading && payments.length === 0) return <PaymentsSkeleton />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Gestión de cobros"
        title="Pagos"
        description="Evalúa cada comprobante contra tu banco. Al aprobar, la suscripción del usuario queda activa."
        actions={
          <div className="flex flex-wrap items-center gap-space-xs">
            <a href="/administracion" className={adminSecondaryButton}>
              <MS name="arrow_back" className="text-[18px]" /> Volver al resumen
            </a>
            <button type="button" onClick={() => setCreating(true)} className={adminPrimaryButton}>
              <MS name="add_card" className="text-[18px]" /> Registrar pago
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-space-sm lg:grid-cols-4">
        {PAYMENT_SUMMARY_CARDS.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-space-md py-space-sm shadow-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{item.label}</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{summary[item.key]}</span>
            </div>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} ${item.tone}`}>
              <MS name={item.icon} className="text-[19px]" />
            </span>
          </div>
        ))}
      </div>

      {error && <AdminAlert>{error}</AdminAlert>}
      {notice && <AdminAlert tone="success">{notice}</AdminAlert>}

      <AdminCard className="gap-space-sm" icon="filter_list" title="Filtrar pagos" description="Encuentra un cobro por usuario, referencia o banco">
        <div className="flex flex-col gap-space-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-space-xs">
            {PAYMENT_STATUS_CHIPS.map((chip) => (
              <AdminFilterChip
                key={chip.value}
                label={chip.label}
                active={query.status === chip.value}
                onClick={() => setStatus(chip.value)}
              />
            ))}
          </div>
          <div className="relative">
            <MS name="search" className="absolute left-3 top-2.5 text-outline text-[19px]" />
            <input
              id="admin-payment-search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Buscar pago"
              aria-label="Buscar pago"
              className={`${adminInput} pl-10 sm:w-56`}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard
        className="overflow-hidden"
        icon="table_rows"
        title="Pagos registrados"
        description="Revisa el comprobante y decide si aprobas cada cobro"
        action={
          <span className="rounded-full bg-surface-container px-space-sm py-1 font-label-sm text-label-sm font-mono text-on-surface-variant">
            {total} {total === 1 ? 'pago' : 'pagos'}
          </span>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-space-xs rounded-xl bg-surface-container-low/60 px-space-sm py-space-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando <span className="font-mono font-semibold text-on-surface">{first}–{last}</span> de{' '}
            <span className="font-mono font-semibold text-on-surface">{total}</span> pagos
          </span>
          <span className="font-label-sm text-label-sm font-mono text-outline">Página {page} de {totalPages}</span>
        </div>

        {payments.length === 0 ? (
          <AdminState label="No hay pagos con estos filtros." />
        ) : (
          <div className={`overflow-x-auto transition ${isLoading ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="bg-surface-container-low/70">
                  <th className={`${adminTh} rounded-l-xl`}>Usuario</th>
                  <th className={adminTh}>Suscripción</th>
                  <th className={adminTh}>Referencia</th>
                  <th className={adminTh}>Fecha</th>
                  <th className={adminTh}>Monto</th>
                  <th className={adminTh}>Estado</th>
                  <th className={`${adminTh} rounded-r-xl text-right`}>Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm">
                {payments.map((payment) => (
                  <tr key={payment.id} data-payment-item={payment.id} className="transition hover:bg-surface-container-low/60">
                    <td className={adminTd}>
                      <div className="flex items-center gap-space-sm">
                        <AdminAvatar name={payment.userName} />
                        <span className="font-label-md text-label-md font-semibold text-on-surface">{payment.userName}</span>
                      </div>
                    </td>
                    <td className={`${adminTd} text-on-surface-variant`}>{payment.planName}</td>
                    <td className={`${adminTd} font-mono text-on-surface-variant`}>{payment.reference}</td>
                    <td className={`${adminTd} font-mono text-on-surface-variant`}>{formatAdminDate(payment.paidAt)}</td>
                    <td className={`${adminTd} font-mono font-bold text-on-surface`}>{formatUsd(payment.amount)}</td>
                    <td className={adminTd}>
                      <AdminBadge tone={paymentTone(payment.status)}>{statusLabels[payment.status]}</AdminBadge>
                    </td>
                    <td className={`${adminTd} text-right`}>
                      <button type="button" onClick={() => setSelected(payment)} className={adminSecondaryButton}>
                        <MS name="visibility" className="text-[16px]" /> Ver comprobante
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/50 pt-space-sm">
          <label className="flex items-center gap-space-xs" htmlFor="admin-payment-page-size">
            <span className="font-label-sm text-label-sm text-outline">Por página</span>
            <select
              id="admin-payment-page-size"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value) as PaymentPageSize)}
              className={`${adminInput} h-9 w-20`}
            >
              {PAYMENT_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-space-xs">
            {hasFilters && (
              <button type="button" onClick={clearFilters} className={adminCompactButton}>
                <MS name="filter_alt_off" className="text-[15px]" /> Limpiar filtros
              </button>
            )}
            <button type="button" disabled={page <= 1 || isLoading} onClick={() => setPage(page - 1)} className={adminCompactButton}>
              <MS name="chevron_left" className="text-[16px]" /> Anterior
            </button>
            <button type="button" disabled={page >= totalPages || isLoading} onClick={() => setPage(page + 1)} className={adminCompactButton}>
              Siguiente <MS name="chevron_right" className="text-[16px]" />
            </button>
          </div>
        </div>
      </AdminCard>

      {creating && (
        <PaymentCreateModal
          busy={creatingBusy}
          methods={methods}
          onClose={() => { if (!creatingBusy) setCreating(false) }}
          onCreate={async (payload: AdminCreatePaymentPayload) => {
            setCreatingBusy(true)
            const ok = await create(payload)
            setCreatingBusy(false)
            if (ok) {
              setCreating(false)
              setNotice(payload.status === 'approved' ? 'Pago registrado y suscripción activada.' : 'Pago registrado como pendiente.')
            }
          }}
        />
      )}

      {selected && (
        <PaymentReviewModal
          payment={selected}
          methodLabel={paymentMethodLabel(selected.method, methodLabels)}
          busy={busyId === selected.id}
          onClose={() => setSelected(null)}
          onReview={async (approved, note) => {
            const ok = await review(selected.id, approved, note)
            if (ok) setSelected(null)
          }}
        />
      )}
    </div>
  )
}
