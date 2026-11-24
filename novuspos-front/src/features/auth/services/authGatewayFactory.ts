import { AUTH_BACKEND } from '@/shared/lib/env'
import type { AuthGateway } from './authGateway'
import { demoAuthGateway } from './demoAuthGateway'
import { httpAuthGateway } from './httpAuthGateway'

/** Selecciona el adaptador según VITE_AUTH_MODE (demo | api). */
export function resolveAuthGateway(): AuthGateway {
  return AUTH_BACKEND === 'demo' ? demoAuthGateway : httpAuthGateway
}
