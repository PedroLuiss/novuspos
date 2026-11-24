import { supportTopics } from '../data/support-data'
import type { SupportDraft, SupportFieldErrors } from '../types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Reglas puras del formulario; se ejecutan antes de llamar a la API. */
export function validateSupportDraft(draft: SupportDraft): SupportFieldErrors {
  const errors: SupportFieldErrors = {}

  if (!draft.email.trim()) errors.email = 'Escribe el correo donde podemos responderte.'
  else if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Revisa el formato del correo.'

  if (!draft.topic) errors.topic = 'Elige sobre qué necesitas ayuda.'
  else if (!supportTopics.some((item) => item.value === draft.topic)) errors.topic = 'Elige un tema de la lista.'

  const subject = draft.subject.trim()
  if (subject.length < 5) errors.subject = 'Escribe un asunto de al menos 5 caracteres.'
  else if (subject.length > 80) errors.subject = 'Usa un asunto más corto (máximo 80 caracteres).'

  const description = draft.description.trim()
  if (description.length < 20) errors.description = 'Cuéntanos un poco más (al menos 20 caracteres).'
  else if (description.length > 1000) errors.description = 'El detalle no puede superar los 1000 caracteres.'

  return errors
}

export function hasSupportErrors(errors: SupportFieldErrors): boolean {
  return Object.keys(errors).length > 0
}
