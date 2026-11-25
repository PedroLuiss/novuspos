import { formatMoney } from './formatters'
import type { PaymentRecord, PaymentStatus, Plan, Subscription } from '../types'

export type PaymentFilter = 'all' | PaymentStatus

/** Presentación pura del historial: sin red y sin estado de React. */
export function paymentPlanName(payment: PaymentRecord, plans: Plan[], subscription: Subscription): string {
  const planId =
    payment.planId ?? (payment.subscriptionId === subscription.id ? subscription.planId : payment.subscriptionId)
  return plans.find((plan) => plan.id === planId)?.name ?? 'NovusPOS Mensual'
}

export function paymentPeriod(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const label = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function filterPayments(payments: PaymentRecord[], status: PaymentFilter, query: string): PaymentRecord[] {
  const needle = query.trim().toLowerCase()
  return payments
    .filter((payment) => status === 'all' || payment.status === status)
    .filter((payment) => {
      if (!needle) return true
      return [payment.reference, payment.bank, payment.method === 'mobile' ? 'pago móvil' : 'transferencia']
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
}

export function paymentTotals(payments: PaymentRecord[]) {
  const approved = payments.filter((payment) => payment.status === 'approved')
  const total = approved.reduce((sum, payment) => sum + payment.amount, 0)
  const currency = approved[0]?.currency ?? payments[0]?.currency ?? 'USD'
  const latest = [...approved].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())[0]
  return {
    approvedCount: approved.length,
    totalLabel: formatMoney(total, currency),
    latestLabel: latest ? paymentPeriod(latest.paidAt) : 'Sin pagos aprobados',
  }
}
