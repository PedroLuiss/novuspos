import { resolveLandingGateway } from './landingGatewayFactory'
import { landingStore, normalizeLandingConfig } from './landingStore'
import type { LandingConfig } from './types'

const gateway = resolveLandingGateway()

/** Fachada de solo lectura para el sitio público. */
export const landingService = {
  list(): Promise<LandingConfig> {
    return gateway.getLanding().then(normalizeLandingConfig).catch(() => landingStore.read())
  },
  readCached(): LandingConfig {
    return landingStore.read()
  },
}
