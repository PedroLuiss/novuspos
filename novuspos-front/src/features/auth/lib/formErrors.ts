import { ApiError, ValidationError, type ValidationIssues } from '@/shared/services/apiClient'

/** Normalización compartida de errores de formulario (evita duplicar catch en los hooks). */
export interface FormErrorState {
  fieldErrors: ValidationIssues
  formError: string | null
}

export const emptyFormErrors: FormErrorState = { fieldErrors: {}, formError: null }

export function toFormError(error: unknown, fallback: string): FormErrorState {
  if (error instanceof ValidationError) {
    return { fieldErrors: error.issues ?? {}, formError: error.message }
  }
  if (error instanceof ApiError) {
    return { fieldErrors: {}, formError: error.message }
  }
  return { fieldErrors: {}, formError: fallback }
}
