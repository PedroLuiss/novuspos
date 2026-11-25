import { demoExchangeRateGateway } from './demoExchangeRateGateway'
import { resolveExchangeRateGateway } from './exchangeRateGatewayFactory'
import type { ExchangeRate } from './types'

/** Fachada pública: los hooks no conocen al adaptador real, al de Laravel ni al respaldo. */
const gateway = resolveExchangeRateGateway()
const CACHE_KEY = 'novuspos:exchange-rate'

interface CachedRate {
  rate: number
  date: string
  fetchedAt: number
}

function readCache(): ExchangeRate | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as CachedRate
    if (!Number.isFinite(cached.rate) || cached.rate <= 0 || !Number.isFinite(cached.fetchedAt)) return null
    if (Date.now() - cached.fetchedAt > 24 * 60 * 60 * 1000) return null
    return { rate: cached.rate, currency: 'USD', date: cached.date, source: 'BCV', fallback: true }
  } catch {
    return null
  }
}

function writeCache(rate: ExchangeRate): void {
  try {
    const cached: CachedRate = { rate: rate.rate, date: rate.date, fetchedAt: Date.now() }
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch {
    // La tasa sigue disponible durante la sesión.
  }
}

export const exchangeRateService = {
  async getToday(): Promise<ExchangeRate> {
    try {
      const rate = await gateway.getToday()
      writeCache(rate)
      return rate
    } catch {
      return readCache() ?? demoExchangeRateGateway.getToday()
    }
  },
}
