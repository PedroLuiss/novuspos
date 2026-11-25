import type { ExchangeRateGateway } from './exchangeRateGateway'
import type { ExchangeRate } from './types'

/**
 * DolarApi publica la cotización oficial del BCV sin autenticación y con CORS abierto.
 * El escritorio consume la misma fuente en `bcv-exchange-rate.adapter.ts`.
 */
export const BCV_RATE_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'
const TIMEOUT_MS = 6000

type Raw = Record<string, unknown>

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null
}

function normalize(payload: unknown): ExchangeRate {
  const raw = isRecord(payload) ? payload : {}
  const rate = Number(raw.promedio ?? raw.venta ?? raw.compra)
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('La tasa del BCV no es válida.')
  const updated = typeof raw.fechaActualizacion === 'string' ? raw.fechaActualizacion.slice(0, 10) : ''
  return {
    rate,
    currency: 'USD',
    date: updated || new Date().toISOString().slice(0, 10),
    source: 'BCV',
  }
}

/** Adaptador real: trae la tasa oficial del día desde la API pública del BCV. */
export const bcvExchangeRateGateway: ExchangeRateGateway = {
  async getToday(): Promise<ExchangeRate> {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const response = await fetch(BCV_RATE_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`BCV respondió ${response.status}`)
      return normalize(await response.json())
    } finally {
      window.clearTimeout(timer)
    }
  },
}
