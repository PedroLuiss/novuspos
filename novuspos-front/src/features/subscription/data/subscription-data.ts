import type { PaymentRecord, Plan, Subscription } from '../types'

/** Catálogo de planes. La API de Laravel puede enviar más; la UI se adapta sola. */
export const plans: Plan[] = [
  {
    id: 'novus-mensual',
    name: 'NovusPOS Mensual',
    description: 'Todo el sistema para un comercio, en una computadora.',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    highlighted: true,
    features: [
      'Ventas, inventario y caja en el mismo equipo',
      'Clientes y cuentas corrientes',
      'Respaldos de tu información',
      'Actualizaciones y soporte',
    ],
  },
  {
    id: 'novus-anual',
    name: 'NovusPOS Anual',
    description: 'El mismo sistema, pagando una sola vez al año.',
    price: 59.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'Ventas, inventario y caja en el mismo equipo',
      'Clientes y cuentas corrientes',
      'Respaldos de tu información',
      'Actualizaciones y soporte',
      'Un solo pago al año, sin mensualidades',
    ],
  },
]

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
