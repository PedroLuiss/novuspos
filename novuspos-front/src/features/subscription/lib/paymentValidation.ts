import { toDateInputValue } from './formatters'
import type { PaymentDraft, PaymentFieldErrors } from '../types'

/** Reglas de captura inspiradas en el flujo de reporte de pago de Cashea. */
export function validatePaymentDraft(draft: PaymentDraft): PaymentFieldErrors {
  const errors: PaymentFieldErrors = {}

  if (!draft.method) {
    errors.method = 'Elige cómo realizaste el pago.'
  }

  const reference = draft.reference.trim()
  if (!reference) {
    errors.reference = 'Escribe los dígitos que aparecen en tu comprobante.'
  } else if (!/^\d{6,20}$/.test(reference)) {
    errors.reference = 'La referencia debe tener entre 6 y 20 dígitos.'
  }

  if (!draft.paidAt) {
    errors.paidAt = 'Selecciona la fecha en que pagaste.'
  } else if (draft.paidAt > toDateInputValue()) {
    errors.paidAt = 'La fecha del pago no puede ser futura.'
  }

  if (!draft.bank.trim()) {
    errors.bank = 'Indica el banco desde el cual pagaste.'
  }

  if (!draft.proofDataUrl) {
    errors.proof = 'Adjunta una captura o foto de tu comprobante.'
  }

  return errors
}

export function hasErrors(errors: PaymentFieldErrors): boolean {
  return Object.keys(errors).length > 0
}
