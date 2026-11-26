import type { PlanOption } from './types'

/** Lectura pública del catálogo de suscripciones. */
export interface PlansGateway {
  list(): Promise<PlanOption[]>
}
