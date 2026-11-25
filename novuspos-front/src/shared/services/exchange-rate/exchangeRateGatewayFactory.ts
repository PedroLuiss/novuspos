import { bcvExchangeRateGateway } from './bcvExchangeRateGateway'
import { httpExchangeRateGateway } from './httpExchangeRateGateway'
import type { ExchangeRateGateway } from './exchangeRateGateway'

/**
 * Por defecto se consulta la API pública del BCV, que funciona sin backend.
 * Si Laravel define su propio endpoint, basta con VITE_EXCHANGE_RATE_API_URL
 * (ruta relativa a VITE_API_URL) para usarlo en su lugar.
 */
export function resolveExchangeRateGateway(): ExchangeRateGateway {
  return import.meta.env.VITE_EXCHANGE_RATE_API_URL?.trim() ? httpExchangeRateGateway : bcvExchangeRateGateway
}
