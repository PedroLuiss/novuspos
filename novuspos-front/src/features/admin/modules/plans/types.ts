import type { PlanOption } from '@/shared/services/plans/types'

export type { PlanOption } from '@/shared/services/plans/types'

/** Estado local del modal de alta/edición: `plan === null` significa "nuevo". */
export interface PlanEditorState {
  open: boolean
  plan: PlanOption | null
}
