import { resolvePlansGateway } from './plansGatewayFactory'
import { normalizePlans, plansStore } from './plansStore'
import type { PlanOption } from './types'

const gateway = resolvePlansGateway()

/** Fachada de solo lectura para el portal y la landing. */
export const plansService = {
  list(): Promise<PlanOption[]> {
    return gateway
      .list()
      .then((plans) => (normalizePlans(plans) ?? []).filter((plan) => plan.active))
      .catch(() => plansStore.readActive())
  },
  /** Catálogo conocido, para evitar un parpadeo vacío mientras carga la API. */
  readCached(): PlanOption[] {
    return plansStore.readActive()
  },
}
