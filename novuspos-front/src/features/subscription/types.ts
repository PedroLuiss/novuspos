/** Tipos públicos del módulo de suscripción. */
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'

export type PlanId = string

export interface Plan {
  id: PlanId
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  highlighted?: boolean
}

export type SubscriptionStatus = 'active' | 'pending_review' | 'expired' | 'cancelled'

export interface Subscription {
  id: string
  planId: PlanId
  status: SubscriptionStatus
  startedAt: string
  renewsAt: string
  amount: number
  currency: string
}

/** Clave del catálogo que configura el dueño; los iniciales son `mobile` y `transfer`. */
export type PaymentMethod = string
export type PaymentStatus = 'pending_review' | 'approved' | 'rejected'

export interface PaymentRecord {
  id: string
  subscriptionId: string
  /** Plan al que aplica el pago; la API puede omitirlo para pagos antiguos. */
  planId?: PlanId
  reference: string
  method: PaymentMethod
  bank: string
  paidAt: string
  amount: number
  currency: string
  status: PaymentStatus
  proofName?: string
  proofDataUrl?: string
  reviewNote?: string
  createdAt: string
}

/** Borrador cacheado mientras se completa el pago. */
export interface PaymentDraft {
  method: PaymentMethod | null
  reference: string
  paidAt: string
  bank: string
  proofName?: string
  proofDataUrl?: string
  updatedAt: string
}

export interface SubmitPaymentRequest {
  subscriptionId: string
  /** Plan que se quiere activar con este pago. */
  planId: string
  method: PaymentMethod
  reference: string
  paidAt: string
  bank: string
  proofName?: string
  proofDataUrl?: string
}

/** Los datos de cobro viven en el catálogo compartido; aquí solo se reexportan. */
export type PaymentAccount = PaymentMethodOption

export interface PaymentFieldErrors {
  reference?: string
  paidAt?: string
  bank?: string
  proof?: string
  method?: string
}
