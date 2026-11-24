/** Tipos públicos del módulo de suscripción. */

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

export type PaymentMethod = 'mobile' | 'transfer'
export type PaymentStatus = 'pending_review' | 'approved' | 'rejected'

export interface PaymentRecord {
  id: string
  subscriptionId: string
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
  method: PaymentMethod
  reference: string
  paidAt: string
  bank: string
  proofName?: string
  proofDataUrl?: string
}

export interface PaymentAccount {
  method: PaymentMethod
  label: string
  description: string
  icon: string
  rows: { label: string; value: string; mono?: boolean }[]
}

export interface PaymentFieldErrors {
  reference?: string
  paidAt?: string
  bank?: string
  proof?: string
  method?: string
}
