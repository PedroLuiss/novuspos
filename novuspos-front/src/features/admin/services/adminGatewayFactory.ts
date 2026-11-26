import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoAdminGateway } from './demoAdminGateway'
import { httpAdminGateway } from './httpAdminGateway'
import type { AdminGateway } from './adminGateway'

/** El panel maestro sigue la misma configuración VITE_AUTH_MODE del resto. */
export function resolveAdminGateway(): AdminGateway {
  return AUTH_BACKEND === 'demo' ? demoAdminGateway : httpAdminGateway
}
