import type { PaymentRecord, Subscription } from '../types'

/**
 * El periodo de prueba (30 días) permite elegir y pagar cualquier plan.
 * Después del primer pago aprobado, solo se puede renovar el plan vigente
 * hasta que venza; al vencerse vuelven a estar disponibles todos los planes.
 */
export function isSubscriptionExpired(subscription: Subscription): boolean {
  if (subscription.status === 'expired' || subscription.status === 'cancelled') return true
  if (subscription.status === 'pending_review') return false
  const due = new Date(subscription.renewsAt)
  if (Number.isNaN(due.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due.getTime() < today.getTime()
}

export function isTrialSubscription(subscription: Subscription): boolean {
  return subscription.isTrial === true && !isSubscriptionExpired(subscription)
}

/** Planes seleccionables en el catálogo: prueba o vencimiento = todos; pago activo = solo el actual. */
export function canSwitchPlan(subscription: Subscription): boolean {
  if (subscription.status === 'pending_review') return false
  return isSubscriptionExpired(subscription) || isTrialSubscription(subscription)
}

/** Plan que debe aparecer seleccionado (el del pago en revisión, si lo hay). */
export function selectedPlanId(subscription: Subscription, payments: PaymentRecord[] = []): string {
  const pending = payments.find((payment) => payment.status === 'pending_review' && payment.planId)
  return pending?.planId ?? subscription.planId
}
