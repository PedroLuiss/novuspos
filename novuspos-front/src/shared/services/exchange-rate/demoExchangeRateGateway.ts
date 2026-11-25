import type { ExchangeRateGateway } from './exchangeRateGateway'
import type { ExchangeRate } from './types'

/** Tasa de ejemplo mientras Laravel no publica el endpoint. */
export const DEMO_EXCHANGE_RATE = 128.45
const DEMO_DELAY_MS = 180

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Adaptador demo: mismo contrato que la API, sin red. */
export const demoExchangeRateGateway: ExchangeRateGateway = {
  async getToday(): Promise<ExchangeRate> {
    await wait()
    return { rate: DEMO_EXCHANGE_RATE, currency: 'USD', date: today(), source: 'BCV' }
  },
}
