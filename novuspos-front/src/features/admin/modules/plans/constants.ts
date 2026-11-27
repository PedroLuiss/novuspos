import type { PlanOption } from '@/shared/services/plans/types'

/** Valores iniciales de una suscripción nueva. */
export const EMPTY_PLAN: PlanOption = {
  id: '',
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  interval: 'month',
  features: [''],
  highlighted: false,
  active: true,
}
