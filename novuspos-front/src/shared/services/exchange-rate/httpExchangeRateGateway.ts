import { apiClient } from '@/shared/services/apiClient'
import { EXCHANGE_RATE_ENDPOINTS } from '@/shared/services/endpoints'
import type { ExchangeRateGateway } from './exchangeRateGateway'
import type { ExchangeRate } from './types'

type Raw = Record<string, unknown>

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null
}

/** Acepta las formas habituales de respuesta mientras se define la API. */
function normalize(payload: unknown): ExchangeRate {
  const raw = isRecord(payload)
    ? ((payload.rate_data ?? payload.data ?? payload) as Raw)
    : {}
  const rate = Number(raw.rate ?? raw.value ?? raw.tasa)
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('La tasa del día no es válida.')
  const date = typeof raw.date === 'string' ? raw.date : new Date().toISOString().slice(0, 10)
  return {
    rate,
    currency: 'USD',
    date,
    source: typeof raw.source === 'string' ? raw.source : 'BCV',
  }
}

/** Adaptador opcional: usa el endpoint de Laravel cuando esté publicado. */
export const httpExchangeRateGateway: ExchangeRateGateway = {
  async getToday(): Promise<ExchangeRate> {
    const path = import.meta.env.VITE_EXCHANGE_RATE_API_URL?.trim() || EXCHANGE_RATE_ENDPOINTS.today
    return normalize(await apiClient.get<unknown>(path))
  },
}
