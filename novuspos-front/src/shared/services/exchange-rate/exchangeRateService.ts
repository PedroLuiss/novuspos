import { resolveExchangeRateGateway } from './exchangeRateGatewayFactory'

/** Fachada pública: los hooks no conocen al adaptador demo ni al HTTP. */
const gateway = resolveExchangeRateGateway()

export const exchangeRateService = {
  getToday: () => gateway.getToday(),
}
