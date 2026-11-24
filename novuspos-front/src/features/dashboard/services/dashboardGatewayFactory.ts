import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoDashboardGateway } from './demoDashboardGateway'
import { httpDashboardGateway } from './httpDashboardGateway'
import type { DashboardGateway } from './dashboardGateway'

/** VITE_AUTH_MODE elige demo o API para todo el panel. */
export function resolveDashboardGateway(): DashboardGateway {
  return AUTH_BACKEND === 'demo' ? demoDashboardGateway : httpDashboardGateway
}
