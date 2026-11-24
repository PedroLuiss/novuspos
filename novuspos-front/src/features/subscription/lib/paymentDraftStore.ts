import { toDateInputValue } from './formatters'
import type { PaymentDraft } from '../types'

/**
 * Guarda el avance del pago en el navegador. Si el usuario cierra el modal y
 * vuelve, encuentra lo que ya escribió. No guarda datos bancarios sensibles.
 */
export function createEmptyDraft(): PaymentDraft {
  return {
    method: null,
    reference: '',
    paidAt: toDateInputValue(),
    bank: '',
    updatedAt: new Date().toISOString(),
  }
}

export function loadDraft(subscriptionId: string): PaymentDraft {
  try {
    const raw = window.localStorage.getItem(storageKey(subscriptionId))
    if (!raw) return createEmptyDraft()
    const parsed = JSON.parse(raw) as Partial<PaymentDraft>
    return {
      method: parsed.method === 'mobile' || parsed.method === 'transfer' ? parsed.method : null,
      reference: typeof parsed.reference === 'string' ? parsed.reference : '',
      paidAt: typeof parsed.paidAt === 'string' ? parsed.paidAt : toDateInputValue(),
      bank: typeof parsed.bank === 'string' ? parsed.bank : '',
      proofName: typeof parsed.proofName === 'string' ? parsed.proofName : undefined,
      proofDataUrl: typeof parsed.proofDataUrl === 'string' ? parsed.proofDataUrl : undefined,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    }
  } catch {
    return createEmptyDraft()
  }
}

export function saveDraft(subscriptionId: string, draft: PaymentDraft): void {
  try {
    window.localStorage.setItem(storageKey(subscriptionId), JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }))
  } catch {
    // Si el navegador bloquea el almacenamiento, el pago sigue funcionando.
  }
}

export function clearDraft(subscriptionId: string): void {
  try {
    window.localStorage.removeItem(storageKey(subscriptionId))
  } catch {
    // Nada que limpiar.
  }
}

function storageKey(subscriptionId: string): string {
  return `novuspos:payment-draft:${subscriptionId}`
}
