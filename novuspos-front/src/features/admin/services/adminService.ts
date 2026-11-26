import { resolveAdminGateway } from './adminGatewayFactory'

/** Fachada pública: los hooks del panel no conocen al adaptador demo ni al HTTP. */
const gateway = resolveAdminGateway()

export const adminService = gateway
