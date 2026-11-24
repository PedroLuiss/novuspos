import { ApiError, ValidationError } from '@/shared/services/apiClient'
import type { PaymentFieldErrors } from '../types'

export interface PaymentFormErrorState {
  fieldErrors: PaymentFieldErrors
  formError: string | null
}

export const emptyPaymentErrors: PaymentFormErrorState = { fieldErrors: {}, formError: null }

const KNOWN_FIELDS = ['method', 'reference', 'paidAt', 'bank', 'proof'] as const

/** Traduce los errores de la API a mensajes que el modal puede mostrar. */
export function toPaymentFormError(error: unknown, fallback: string): PaymentFormErrorState {
  if (error instanceof ValidationError) {
    const fieldErrors: PaymentFieldErrors = {}
    let formError: string | null = null

    for (const [field, messages] of Object.entries(error.issues ?? {})) {
      const message = messages[0]
      if (!message) continue
      if ((KNOWN_FIELDS as readonly string[]).includes(field)) {
        fieldErrors[field as keyof PaymentFieldErrors] = message
      } else {
        formError = message
      }
    }

    return { fieldErrors, formError: formError ?? (Object.keys(fieldErrors).length ? 'Revisa los campos marcados.' : fallback) }
  }

  if (error instanceof ApiError) {
    return { fieldErrors: {}, formError: error.message }
  }

  return { fieldErrors: {}, formError: fallback }
}
