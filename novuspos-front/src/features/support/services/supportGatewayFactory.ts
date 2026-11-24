import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoSupportGateway } from './demoSupportGateway'
import { httpSupportGateway } from './httpSupportGateway'
import type { SupportGateway } from './supportGateway'

/** VITE_AUTH_MODE elige demo o API también para el soporte. */
export function resolveSupportGateway(): SupportGateway {
  return AUTH_BACKEND === 'demo' ? demoSupportGateway : httpSupportGateway
}
