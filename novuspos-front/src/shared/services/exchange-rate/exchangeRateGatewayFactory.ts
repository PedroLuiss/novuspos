import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoExchangeRateGateway } from './demoExchangeRateGateway'
import { httpExchangeRateGateway } from './httpExchangeRateGateway'
import type { ExchangeRateGateway } from './exchangeRateGateway'

/** VITE_AUTH_MODE elige demo o API también para la tasa del día. */
export function resolveExchangeRateGateway(): ExchangeRateGateway {
  return AUTH_BACKEND === 'demo' ? demoExchangeRateGateway : httpExchangeRateGateway
}
