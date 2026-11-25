import type { Subscription } from '../types'

/**
 * Solo se puede cambiar de plan cuando la suscripción actual ya venció.
 * El backend debe aplicar la misma regla; esto evita ofrecer una acción inválida.
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

export function canSwitchPlan(subscription: Subscription): boolean {
  return isSubscriptionExpired(subscription)
}
