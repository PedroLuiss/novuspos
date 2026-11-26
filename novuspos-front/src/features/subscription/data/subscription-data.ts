import type { PaymentRecord, Subscription } from '../types'

export const DEMO_SUBSCRIPTION_ID = 'sub-demo-1'

function isoDate(offsetDays: number): string {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

export const demoSubscription: Subscription = {
  id: DEMO_SUBSCRIPTION_ID,
  planId: 'novus-mensual',
  status: 'active',
  startedAt: isoDate(-20),
  renewsAt: isoDate(10),
  amount: 4.99,
  currency: 'USD',
}

export const demoPayments: PaymentRecord[] = [
  {
    id: 'pay-demo-003',
    subscriptionId: DEMO_SUBSCRIPTION_ID,
    reference: '48291573',
    method: 'transfer',
    bank: 'Banco de Venezuela',
    paidAt: isoDate(-2),
    amount: 4.99,
    currency: 'USD',
    status: 'pending_review',
    proofName: 'comprobante-transferencia.jpg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pay-demo-002',
    subscriptionId: DEMO_SUBSCRIPTION_ID,
    reference: '77120498',
    method: 'mobile',
    bank: 'Banesco',
    paidAt: isoDate(-32),
    amount: 4.99,
    currency: 'USD',
    status: 'approved',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pay-demo-001',
    subscriptionId: DEMO_SUBSCRIPTION_ID,
    reference: '33918540',
    method: 'mobile',
    bank: 'Mercantil',
    paidAt: isoDate(-62),
    amount: 4.99,
    currency: 'USD',
    status: 'approved',
    createdAt: new Date().toISOString(),
  },
]

/** Bancos sugeridos al reportar desde qué institución se pagó. */
export const banks = [
  'Banesco',
  'Banco de Venezuela',
  'Mercantil',
  'BBVA Provincial',
  'Banco Provincial',
  'BOD',
  'Banco Exterior',
  'Banamérica',
  'Banco del Tesoro',
]

export const statusLabels = {
  active: 'Activa',
  pending_review: 'Pago en revisión',
  expired: 'Vencida',
  cancelled: 'Cancelada',
} as const

export const paymentStatusLabels = {
  pending_review: 'Por evaluar',
  approved: 'Aprobado',
  rejected: 'Rechazado',
} as const
