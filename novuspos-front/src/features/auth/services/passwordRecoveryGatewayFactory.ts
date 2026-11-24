import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoPasswordRecoveryGateway } from './demoPasswordRecoveryGateway'
import { httpPasswordRecoveryGateway } from './httpPasswordRecoveryGateway'
import type { PasswordRecoveryGateway } from './passwordRecoveryGateway'

/** Selecciona el adaptador según VITE_AUTH_MODE (demo | api). */
export function resolvePasswordRecoveryGateway(): PasswordRecoveryGateway {
  return AUTH_BACKEND === 'demo' ? demoPasswordRecoveryGateway : httpPasswordRecoveryGateway
}
