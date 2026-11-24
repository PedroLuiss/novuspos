import { ApiError, ValidationError } from '@/shared/services/apiClient'
import type { SupportFieldErrors } from '../types'

export interface SupportFormErrorState {
  fieldErrors: SupportFieldErrors
  formError: string | null
}

export const emptySupportErrors: SupportFormErrorState = { fieldErrors: {}, formError: null }

const KNOWN_FIELDS = ['email', 'topic', 'subject', 'description'] as const

/** Traduce 422 y errores de red a mensajes que entienda el formulario. */
export function toSupportFormError(error: unknown, fallback: string): SupportFormErrorState {
  if (error instanceof ValidationError) {
    const fieldErrors: SupportFieldErrors = {}
    let formError: string | null = null
    for (const [field, messages] of Object.entries(error.issues ?? {})) {
      const message = messages[0]
      if (!message) continue
      if ((KNOWN_FIELDS as readonly string[]).includes(field)) {
        fieldErrors[field as keyof SupportFieldErrors] = message
      } else {
        formError = message
      }
    }
    return {
      fieldErrors,
      formError: formError ?? (Object.keys(fieldErrors).length ? 'Revisa los campos marcados.' : fallback),
    }
  }

  if (error instanceof ApiError) return { fieldErrors: {}, formError: error.message }
  return { fieldErrors: {}, formError: fallback }
}
