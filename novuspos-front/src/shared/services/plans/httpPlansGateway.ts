import { apiClient } from '@/shared/services/apiClient'
import { BILLING_ENDPOINTS } from '@/shared/services/endpoints'
import { normalizePlans } from './plansStore'
import type { PlansGateway } from './plansGateway'

type UnknownRecord = Record<string, unknown>

function unwrap(payload: unknown): unknown {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    const record = payload as UnknownRecord
    for (const key of ['plans', 'items', 'data']) {
      if (Array.isArray(record[key])) return record[key]
    }
  }
  return []
}

/** El portal solo consume los planes que Laravel marca como disponibles. */
export const httpPlansGateway: PlansGateway = {
  async list() {
    const payload = await apiClient.get<unknown>(BILLING_ENDPOINTS.plans)
    return normalizePlans(unwrap(payload)) ?? []
  },
}
