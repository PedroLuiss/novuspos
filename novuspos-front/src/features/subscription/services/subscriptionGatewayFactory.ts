import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoSubscriptionGateway } from './demoSubscriptionGateway'
import { httpSubscriptionGateway } from './httpSubscriptionGateway'
import type { SubscriptionGateway } from './subscriptionGateway'

/** Igual que auth: VITE_AUTH_MODE elige demo o API para todo el panel. */
export function resolveSubscriptionGateway(): SubscriptionGateway {
  return AUTH_BACKEND === 'demo' ? demoSubscriptionGateway : httpSubscriptionGateway
}
