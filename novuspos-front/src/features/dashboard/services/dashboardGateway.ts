import type { DashboardSummary } from '../types'

/** Contrato único para el modo demo y para la API del panel. */
export interface DashboardGateway {
  getOverview(): Promise<DashboardSummary>
}
