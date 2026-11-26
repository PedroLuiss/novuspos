import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoLandingGateway } from './demoLandingGateway'
import type { LandingGateway } from './landingGateway'
import { httpLandingGateway } from './httpLandingGateway'

/** Mismo interruptor que el resto del front: demo por defecto, API con VITE_AUTH_MODE=api. */
export function resolveLandingGateway(): LandingGateway {
  return AUTH_BACKEND === 'demo' ? demoLandingGateway : httpLandingGateway
}
