import { ValidationError } from '@/shared/services/apiClient'
import { plansStore } from '@/shared/services/plans/plansStore'
import { demoPayments, demoSubscription } from '../data/subscription-data'
import { isSubscriptionExpired } from '../lib/subscriptionStatus'
import type { PaymentRecord, SubmitPaymentRequest, Subscription } from '../types'
import type { BillingOverview, SubscriptionGateway } from './subscriptionGateway'

const STORAGE_KEY = 'novuspos:demo-billing'
const DEMO_DELAY_MS = 250

interface DemoBillingState {
  subscription: Subscription
  payments: PaymentRecord[]
}

function initialState(): DemoBillingState {
  return {
    subscription: { ...demoSubscription },
    payments: demoPayments.map((payment) => ({ ...payment })),
  }
}

function readState(): DemoBillingState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoBillingState
      if (parsed.subscription && Array.isArray(parsed.payments)) return parsed
    }
  } catch {
    // Se usa el estado inicial.
  }
  return initialState()
}

function writeState(state: DemoBillingState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // El modo demo sigue funcionando en memoria durante la sesión.
  }
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Adaptador demo: mismo contrato que la API, sin red. */
export const demoSubscriptionGateway: SubscriptionGateway = {
  async getOverview(): Promise<BillingOverview> {
    await wait()
    const state = readState()
    return { plans: plansStore.readActive(), subscription: state.subscription, payments: state.payments }
  },

  async submitPayment(request: SubmitPaymentRequest): Promise<PaymentRecord> {
    await wait()
    const state = readState()
    const duplicate = state.payments.some(
      (payment) => payment.reference === request.reference.trim() && payment.bank === request.bank.trim(),
    )
    if (duplicate) {
      throw new ValidationError({ reference: ['Esa referencia ya fue registrada. Revisa tu comprobante.'] })
    }

    const trial = !isSubscriptionExpired(state.subscription)
      && !state.payments.some((payment) => payment.status === 'approved')

    if (!isSubscriptionExpired(state.subscription) && !trial) {
      throw new ValidationError({
        planId: ['Ya tienes una suscripción pagada y activa. Podrás reportar otro pago cuando venza.'],
      })
    }

    if (state.subscription.status === 'pending_review') {
      throw new ValidationError({
        planId: ['Ya tienes un pago en revisión. Espera a que se evalúe antes de reportar otro.'],
      })
    }

    const catalog = plansStore.read()
    const plan = catalog.find((item) => item.id === request.planId) ?? catalog[0]
    if (!plan) throw new Error('No hay suscripciones configuradas.')
    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      subscriptionId: request.subscriptionId,
      planId: request.planId,
      reference: request.reference.trim(),
      method: request.method,
      bank: request.bank.trim(),
      paidAt: request.paidAt,
      amount: plan.price,
      currency: plan.currency,
      status: 'pending_review',
      proofName: request.proofName,
      proofDataUrl: request.proofDataUrl,
      createdAt: new Date().toISOString(),
    }

    state.payments = [payment, ...state.payments]
    state.subscription = { ...state.subscription, status: 'pending_review' }
    writeState(state)
    return payment
  },

}
