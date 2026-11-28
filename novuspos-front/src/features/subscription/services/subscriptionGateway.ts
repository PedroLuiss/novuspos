import type { PaymentRecord, Plan, Subscription, SubmitPaymentRequest } from '../types'

export interface BillingOverview {
  plans: Plan[]
  subscription: Subscription
  payments: PaymentRecord[]
}

/** Contrato único para el modo demo y para la API. La evaluación del pago es exclusiva del super admin. */
export interface SubscriptionGateway {
  getOverview(): Promise<BillingOverview>
  submitPayment(request: SubmitPaymentRequest): Promise<PaymentRecord>
}
