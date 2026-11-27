import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'

export type { AdminSettings } from '@/features/admin/core/types'
export type { PaymentMethodOption } from '@/shared/services/payment-methods/types'

/** Estado local del modal de alta/edición de métodos de cobro. */
export interface PaymentMethodEditorState {
  open: boolean
  method: PaymentMethodOption | null
}
