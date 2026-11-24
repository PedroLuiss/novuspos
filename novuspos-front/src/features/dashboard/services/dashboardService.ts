import { resolveDashboardGateway } from './dashboardGatewayFactory'

/** Fachada del panel: los hooks no conocen al adaptador demo ni al HTTP. */
const gateway = resolveDashboardGateway()

export const dashboardService = {
  getOverview: () => gateway.getOverview(),
}
