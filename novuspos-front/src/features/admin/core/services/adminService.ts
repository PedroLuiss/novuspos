import { setLandingAdminTokenReader } from '@/shared/services/landing/adminToken'
import { adminSessionStore } from '@/features/admin/core/lib/adminSession'
import { resolveAdminGateway } from './adminGatewayFactory'

/** Fachada pública: los hooks del panel no conocen al adaptador demo ni al HTTP. */
const gateway = resolveAdminGateway()

// La landing vive en `shared/`, pero el token maestro pertenece a esta feature.
setLandingAdminTokenReader(() => adminSessionStore.read()?.token)

export const adminService = gateway
