import { useMemo, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { useAdminPayments } from '../hooks/useAdminPayments'
import { formatAdminDate, formatUsd, paymentTone, statusLabels } from '../lib/adminFormatters'
import { adminInput, adminSecondaryButton, adminTd, adminTh } from '../lib/adminStyles'
import type { AdminPayment } from '../types'
import { AdminAlert, AdminAvatar, AdminBadge, AdminCard, AdminFilterChip, AdminPageHeader, AdminState } from './ui/AdminUi'
import { PaymentReviewModal } from './PaymentReviewModal'

const chips = [
  { value: 'pending', label: 'Por aprobar' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
  { value: 'all', label: 'Todos' },
]

/** Gestión manual de pagos: filtros por usuario y estado, con revisión del comprobante. */
export function PaymentsPage() {
  const { payments, isLoading, busyId, error, review } = useAdminPayments()
  const [status, setStatus] = useState('pending')
  const [user, setUser] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<AdminPayment | null>(null)

  const users = useMemo(() => [...new Set(payments.map((item) => item.userName))].sort(), [payments])
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return payments.filter((item) =>
      (status === 'all' || item.status === status) &&
      (user === 'all' || item.userName === user) &&
      (!needle || `${item.userName} ${item.reference} ${item.bank}`.toLowerCase().includes(needle)),
    )
  }, [payments, status, user, query])

  const summary = useMemo(() => ({
    pending: payments.filter((item) => item.status === 'pending').length,
    approved: payments.filter((item) => item.status === 'approved').length,
    rejected: payments.filter((item) => item.status === 'rejected').length,
    total: payments.length,
  }), [payments])

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Gestión de cobros"
        title="Pagos"
        description="Evalúa cada comprobante contra tu banco. Al aprobar, la suscripción del usuario queda activa."
        actions={
          <a href="/administracion" className={adminSecondaryButton}>
            <MS name="arrow_back" className="text-[18px]" /> Volver al resumen
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-space-sm lg:grid-cols-4">
        {[
          { label: 'Por aprobar', value: summary.pending, icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
          { label: 'Aprobados', value: summary.approved, icon: 'check_circle', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
          { label: 'Rechazados', value: summary.rejected, icon: 'cancel', tone: 'text-error', bg: 'bg-error-container/60' },
          { label: 'Total recibidos', value: summary.total, icon: 'receipt_long', tone: 'text-primary', bg: 'bg-primary-fixed/50' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-space-md py-space-sm shadow-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{item.label}</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{item.value}</span>
            </div>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} ${item.tone}`}>
              <MS name={item.icon} className="text-[19px]" />
            </span>
          </div>
        ))}
      </div>

      {error && <AdminAlert>{error}</AdminAlert>}

      <AdminCard className="gap-space-sm" icon="filter_list" title="Filtrar pagos" description="Encuentra un cobro por usuario, referencia o banco">
        <div className="flex flex-col gap-space-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-space-xs">
            {chips.map((chip) => (
              <AdminFilterChip key={chip.value} label={chip.label} active={status === chip.value} onClick={() => setStatus(chip.value)} />
            ))}
          </div>
          <div className="flex flex-col gap-space-xs sm:flex-row">
            <div className="relative">
              <MS name="search" className="absolute left-3 top-2.5 text-outline text-[19px]" />
              <input
                id="admin-payment-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar pago"
                aria-label="Buscar pago"
                className={`${adminInput} pl-10 sm:w-56`}
              />
            </div>
            <select
              value={user}
              onChange={(event) => setUser(event.target.value)}
              aria-label="Filtrar por usuario"
              className={adminInput}
            >
              <option value="all">Todos los usuarios</option>
              {users.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden" icon="table_rows" title={`${visible.length} ${visible.length === 1 ? 'pago encontrado' : 'pagos encontrados'}`}>
        {isLoading && payments.length === 0 ? (
          <AdminState label="Cargando pagos…" loading />
        ) : visible.length === 0 ? (
          <AdminState label="No hay pagos con estos filtros." />
        ) : (
          <div className="overflow-x-auto">
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
                {visible.map((payment) => (
                  <tr key={payment.id} className="transition hover:bg-surface-container-low/60">
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
      </AdminCard>

      {selected && (
        <PaymentReviewModal
          payment={selected}
          busy={busyId === selected.id}
          onClose={() => setSelected(null)}
          onReview={async (approved, note) => {
            await review(selected.id, approved, note)
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}
