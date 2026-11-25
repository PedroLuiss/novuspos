import type { ExchangeRate } from './types'

/** Contrato único para el modo demo y para la API. */
export interface ExchangeRateGateway {
  getToday(): Promise<ExchangeRate>
}
