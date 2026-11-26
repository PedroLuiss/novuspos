import { apiClient } from '@/shared/services/apiClient'
import { ADMIN_ENDPOINTS, LANDING_ENDPOINTS } from '@/shared/services/endpoints'
import { landingAdminHeaders } from './adminToken'
import { normalizeLandingConfig } from './landingStore'
import type { LandingGateway } from './landingGateway'

/** La landing pública no exige token; el panel maestro envía el suyo por inyección. */
export const httpLandingGateway: LandingGateway = {
  async getLanding() {
    const payload = await apiClient.get<unknown>(LANDING_ENDPOINTS.config, { auth: false })
    const data = payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>).config ?? (payload as Record<string, unknown>).landing ?? payload
      : payload
    return normalizeLandingConfig(data)
  },
  async saveLanding(config) {
    const payload = await apiClient.put<unknown>(ADMIN_ENDPOINTS.landing, { config }, { headers: landingAdminHeaders() })
    const data = payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>).config ?? payload
      : config
    return normalizeLandingConfig(data)
  },
}
