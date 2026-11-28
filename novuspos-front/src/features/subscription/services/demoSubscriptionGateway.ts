import { ValidationError } from '@/shared/services/apiClient'
import { plansStore } from '@/shared/services/plans/plansStore'
import { demoPayments, demoSubscription } from '../data/subscription-data'
import { isSubscriptionExpired } from '../lib/subscriptionStatus'
import type { PaymentRecord, SubmitPaymentRequest, Subscription } from '../types'
import type { BillingOverview, PaymentReviewResult, SubscriptionGateway } from './subscriptionGateway'

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
    const pendingPlan = state.payments.find((payment) => payment.status === 'pending_review')?.planId

    if (request.planId !== state.subscription.planId && !isSubscriptionExpired(state.subscription) && !trial) {
      throw new ValidationError({
        planId: ['Tu suscripción sigue activa. Podrás cambiar de plan cuando venza.'],
      })
    }

    if (state.subscription.status === 'pending_review' && request.planId !== pendingPlan) {
      throw new ValidationError({
        planId: ['Ya tienes un pago en revisión. Espera a que se evalúe antes de elegir otro plan.'],
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

  async reviewPayment(paymentId: string, approved: boolean, note?: string): Promise<PaymentReviewResult> {
    await wait()
    const state = readState()
    const payment = state.payments.find((item) => item.id === paymentId)
    if (!payment) throw new Error('No encontramos ese pago.')

    payment.status = approved ? 'approved' : 'rejected'
    payment.reviewNote = note
    if (approved) {
      const catalog = plansStore.read()
      const plan = catalog.find((item) => item.id === payment.planId) ?? catalog[0]
      if (!plan) throw new Error('No hay suscripciones configuradas.')
      const start = new Date(payment.paidAt)
      if (Number.isNaN(start.getTime())) start.setTime(Date.now())
      const renews = new Date(start)
      if (plan.interval === 'year') renews.setFullYear(renews.getFullYear() + 1)
      else renews.setMonth(renews.getMonth() + 1)
      state.subscription = {
        ...state.subscription,
        planId: plan.id,
        status: 'active',
        startedAt: start.toISOString().slice(0, 10),
        renewsAt: renews.toISOString().slice(0, 10),
        amount: plan.price,
        currency: plan.currency,
      }
    }
    writeState(state)
    return { payment: { ...payment }, subscription: { ...state.subscription } }
  },
}
