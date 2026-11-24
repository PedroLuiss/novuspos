import { apiClient } from '@/shared/services/apiClient'
import { SUPPORT_ENDPOINTS } from '@/shared/services/endpoints'
import type { SupportSubmitRequest, SupportTicket } from '../types'
import type { SupportGateway } from './supportGateway'

type Raw = Record<string, unknown>

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null
}

function normalize(payload: unknown): SupportTicket {
  const raw = isRecord(payload)
    ? ((payload.ticket ?? payload.data ?? payload) as Raw)
    : {}
  const id = typeof raw.id === 'string' ? raw.id : ''
  const reference = typeof raw.reference === 'string' ? raw.reference : typeof raw.code === 'string' ? raw.code : id
  return {
    id,
    reference: reference || 'TK-000000',
    message: typeof raw.message === 'string' ? raw.message : undefined,
  }
}

/** Adaptador real: envía el reporte al endpoint de soporte. */
export const httpSupportGateway: SupportGateway = {
  async submit(request: SupportSubmitRequest): Promise<SupportTicket> {
    return normalize(await apiClient.post<unknown>(SUPPORT_ENDPOINTS.submit, request))
  },
}
