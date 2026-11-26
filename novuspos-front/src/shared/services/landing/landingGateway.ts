import type { LandingConfig } from './types'

/** Puerto de la landing: la edición y el sitio público comparten el mismo contrato. */
export interface LandingGateway {
  /** Configuración pública que debe renderizar la landing. */
  getLanding(): Promise<LandingConfig>
  /** Guarda la configuración completa; solo el dueño la escribe. */
  saveLanding(config: LandingConfig): Promise<LandingConfig>
}
