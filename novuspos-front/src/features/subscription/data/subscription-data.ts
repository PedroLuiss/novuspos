import type { PaymentAccount, PaymentRecord, Plan, Subscription } from '../types'

/** Catálogo de planes. Hoy hay uno; agregar otro aquí no requiere tocar la UI. */
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

/**
 * Datos de cobro de Novus. Valores de demostración: reemplazar aquí cuando el
 * equipo defina las cuentas reales. La UI sigue siendo igual.
 */
export const paymentAccounts: Record<'mobile' | 'transfer', PaymentAccount> = {
  mobile: {
    method: 'mobile',
    label: 'Pago móvil',
    description: 'Transfiere desde tu banca móvil a este número.',
    icon: 'smartphone',
    rows: [
      { label: 'Banco', value: 'Banco de demostración' },
      { label: 'Número de teléfono', value: '0424-0000000', mono: true },
      { label: 'Titular', value: 'NovusPOS (Demo)' },
      { label: 'Identificación', value: 'J-00000000-0', mono: true },
    ],
  },
  transfer: {
    method: 'transfer',
    label: 'Transferencia',
    description: 'Transfiere a la cuenta bancaria de NovusPOS.',
    icon: 'account_balance',
    rows: [
      { label: 'Banco', value: 'Banco de demostración' },
      { label: 'Tipo de cuenta', value: 'Corriente' },
      { label: 'Número de cuenta', value: '0000-0000-00-0000000000', mono: true },
      { label: 'Titular', value: 'NovusPOS (Demo)' },
      { label: 'Identificación', value: 'J-00000000-0', mono: true },
    ],
  },
}

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
