import type { PaymentRecord, Plan, Subscription, SubmitPaymentRequest } from '../types'

export interface BillingOverview {
  plans: Plan[]
  subscription: Subscription
  payments: PaymentRecord[]
}

export interface PaymentReviewResult {
  payment: PaymentRecord
  subscription: Subscription
}

/** Contrato único para el modo demo y para la futura API. */
export interface SubscriptionGateway {
  getOverview(): Promise<BillingOverview>
  submitPayment(request: SubmitPaymentRequest): Promise<PaymentRecord>
  reviewPayment(paymentId: string, approved: boolean, note?: string): Promise<PaymentReviewResult>
}
