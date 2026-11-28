import { apiClient } from '@/shared/services/apiClient'
import { BILLING_ENDPOINTS } from '@/shared/services/endpoints'
import type { PaymentRecord, Plan, SubmitPaymentRequest, Subscription } from '../types'
import type { BillingOverview, SubscriptionGateway } from './subscriptionGateway'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

/** Acepta tanto un arreglo como `{ items }`, `{ data }` o `{ plans/payments }`. */
function unwrapList<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (isRecord(payload)) {
    for (const candidate of [key, 'items', 'data']) {
      if (Array.isArray(payload[candidate])) return payload[candidate] as T[]
    }
  }
  return []
}

/**
 * Adaptador real: usa todos los endpoints de facturación.
 * Si `/billing/subscription` ya devuelve planes y pagos, no hace las otras dos
 * llamadas; si no, las completa con `/billing/plans` y `/billing/payments`.
 */
export const httpSubscriptionGateway: SubscriptionGateway = {
  async getOverview(): Promise<BillingOverview> {
    const current = await apiClient.get<unknown>(BILLING_ENDPOINTS.subscription)
    const hasNested = isRecord(current) && 'subscription' in current

    const subscription = hasNested
      ? (current as UnknownRecord).subscription as Subscription
      : current as Subscription

    let plans = hasNested ? unwrapList<Plan>((current as UnknownRecord).plans, 'plans') : []
    let payments = hasNested ? unwrapList<PaymentRecord>((current as UnknownRecord).payments, 'payments') : []

    if (plans.length === 0 || payments.length === 0 || !hasNested) {
      const [plansResponse, paymentsResponse] = await Promise.all([
        plans.length === 0 ? apiClient.get<unknown>(BILLING_ENDPOINTS.plans) : Promise.resolve(null),
        payments.length === 0 ? apiClient.get<unknown>(BILLING_ENDPOINTS.payments) : Promise.resolve(null),
      ])
      if (plansResponse !== null) plans = unwrapList<Plan>(plansResponse, 'plans')
      if (paymentsResponse !== null) payments = unwrapList<PaymentRecord>(paymentsResponse, 'payments')
    }

    return { plans: plans.filter((plan) => plan.active !== false), subscription, payments }
  },

  submitPayment(request: SubmitPaymentRequest): Promise<PaymentRecord> {
    return apiClient.post<PaymentRecord>(BILLING_ENDPOINTS.payments, request)
  },
}
