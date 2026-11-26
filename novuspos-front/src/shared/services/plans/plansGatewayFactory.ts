import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoPlansGateway } from './demoPlansGateway'
import { httpPlansGateway } from './httpPlansGateway'
import type { PlansGateway } from './plansGateway'

/** Sigue el mismo modo que el resto del front; la API aún no está publicada. */
export function resolvePlansGateway(): PlansGateway {
  return AUTH_BACKEND === 'demo' ? demoPlansGateway : httpPlansGateway
}
