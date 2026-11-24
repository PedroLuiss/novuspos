import { useState } from 'react'
import { IS_DEMO_AUTH } from '@/shared/lib/env'
import { MS } from '@/shared/ui/MS'
import { paymentStatusLabels } from '../data/subscription-data'
import { formatDate, formatMoney } from '../lib/formatters'
import { filterPayments, paymentPeriod, paymentPlanName, paymentTotals, type PaymentFilter } from '../lib/paymentPresentation'
import type { PaymentRecord, Plan, Subscription } from '../types'
import { PaymentFilterBar } from './PaymentFilterBar'
import { PaymentSummaryStrip } from './PaymentSummaryStrip'

interface Props {
  payments: PaymentRecord[]
  plans: Plan[]
  subscription: Subscription
  reviewingId: string | null
  onReview: (paymentId: string, approved: boolean) => void
}

const STATUS_STYLE: Record<PaymentRecord['status'], string> = {
  pending_review: 'bg-tertiary-container text-on-tertiary-container',
  approved: 'bg-secondary-container text-on-secondary-container',
  rejected: 'bg-error-container text-on-error-container',
}

/** Historial de pagos: a qué suscripción corresponden y en qué estado están. */
export function PaymentHistoryTable({ payments, plans, subscription, reviewingId, onReview }: Props) {
  const [status, setStatus] = useState<PaymentFilter>('all')
  const [query, setQuery] = useState('')
  const visible = filterPayments(payments, status, query)
  const totals = paymentTotals(payments)

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center gap-space-xs">
        <MS name="history" className="text-primary text-[24px]" />
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Historial de pagos</h2>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Cada pago queda asociado a su suscripción y a su comprobante.
          </span>
        </div>
      </div>

      <PaymentSummaryStrip {...totals} />
      <PaymentFilterBar
        status={status}
        query={query}
        visible={visible.length}
        total={payments.length}
        onStatus={setStatus}
        onQuery={setQuery}
      />

      {visible.length === 0 ? (
        <div className="rounded-lg bg-surface-container-low p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
          {payments.length === 0
            ? 'Todavía no has reportado pagos. Cuando lo hagas, aparecerán aquí.'
            : 'No hay pagos que coincidan con ese filtro.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[880px]">
            <thead>
              <tr className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-high/40">
                <th className="py-space-sm px-space-md rounded-l-lg">Suscripción</th>
                <th className="py-space-sm px-space-md">Referencia</th>
                <th className="py-space-sm px-space-md">Fecha</th>
                <th className="py-space-sm px-space-md">Método</th>
                <th className="py-space-sm px-space-md">Banco</th>
                <th className="py-space-sm px-space-md">Monto</th>
                <th className="py-space-sm px-space-md">Estado</th>
                <th className="py-space-sm px-space-md text-right rounded-r-lg">Comprobante</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-surface-container">
              {visible.map((payment) => (
                <tr key={payment.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-space-md px-space-md">
                    <span className="block font-semibold text-on-surface">{paymentPlanName(payment, plans, subscription)}</span>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant font-mono">
                      {paymentPeriod(payment.paidAt)}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md font-mono font-semibold text-on-surface">{payment.reference}</td>
                  <td className="py-space-md px-space-md font-mono text-on-surface-variant">{formatDate(payment.paidAt)}</td>
                  <td className="py-space-md px-space-md text-on-surface-variant">
                    {payment.method === 'mobile' ? 'Pago móvil' : 'Transferencia'}
                  </td>
                  <td className="py-space-md px-space-md text-on-surface-variant">{payment.bank}</td>
                  <td className="py-space-md px-space-md font-mono font-bold text-on-surface">
                    {formatMoney(payment.amount, payment.currency)}
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${STATUS_STYLE[payment.status]}`}>
                      {paymentStatusLabels[payment.status]}
                    </span>
                    {payment.reviewNote && (
                      <span className="block font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-[180px]">
                        {payment.reviewNote}
                      </span>
                    )}
                    {payment.status === 'pending_review' && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        <button
                          type="button"
                          disabled={reviewingId === payment.id}
                          onClick={() => onReview(payment.id, true)}
                          className="font-label-sm text-label-sm text-secondary hover:underline font-semibold disabled:opacity-50"
                        >
                          {reviewingId === payment.id ? 'Actualizando…' : IS_DEMO_AUTH ? 'Simular aprobación' : 'Aprobar pago'}
                        </button>
                        <button
                          type="button"
                          disabled={reviewingId === payment.id}
                          onClick={() => onReview(payment.id, false)}
                          className="font-label-sm text-label-sm text-error hover:underline font-semibold disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-space-md px-space-md text-right">
                    {payment.proofDataUrl ? (
                      <a
                        href={payment.proofDataUrl}
                        download={payment.proofName ?? 'comprobante'}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold"
                      >
                        <MS name="image" className="text-[15px]" /> Ver imagen
                      </a>
                    ) : (
                      <span className="font-body-sm text-body-sm text-outline">Sin imagen</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
