import type { PaymentPageSize, PaymentStatusFilter, PaymentSummary } from './types'

export const PAYMENT_PAGE_SIZES: readonly PaymentPageSize[] = [20, 50, 100]

export const PAYMENT_STATUS_CHIPS: readonly { value: PaymentStatusFilter; label: string }[] = [
  { value: 'pending', label: 'Por aprobar' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
  { value: 'all', label: 'Todos' },
]

export interface PaymentSummaryCard {
  label: string
  key: keyof PaymentSummary
  icon: string
  tone: string
  bg: string
}

export const PAYMENT_SUMMARY_CARDS: readonly PaymentSummaryCard[] = [
  { label: 'Por aprobar', key: 'pending', icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
  { label: 'Aprobados', key: 'approved', icon: 'check_circle', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
  { label: 'Rechazados', key: 'rejected', icon: 'cancel', tone: 'text-error', bg: 'bg-error-container/60' },
  { label: 'Total recibidos', key: 'total', icon: 'receipt_long', tone: 'text-primary', bg: 'bg-primary-fixed/50' },
]
