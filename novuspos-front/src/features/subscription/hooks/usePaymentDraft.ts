import { useEffect, useState } from 'react'
import { clearDraft, loadDraft, saveDraft } from '../lib/paymentDraftStore'
import type { PaymentDraft } from '../types'

/** Guarda lo que el usuario escribe para que pueda retomar el pago después. */
export function usePaymentDraft(subscriptionId: string) {
  const [state, setState] = useState(() => ({ key: subscriptionId, draft: loadDraft(subscriptionId) }))

  // Derivar el estado al cambiar de suscripción evita un render extra en un effect.
  if (state.key !== subscriptionId) {
    setState({ key: subscriptionId, draft: loadDraft(subscriptionId) })
  }

  useEffect(() => {
    if (state.key === subscriptionId) saveDraft(subscriptionId, state.draft)
  }, [state, subscriptionId])

  const update = (patch: Partial<PaymentDraft>) => {
    setState((current) => ({ ...current, draft: { ...current.draft, ...patch } }))
  }

  const clear = () => {
    clearDraft(subscriptionId)
    setState({ key: subscriptionId, draft: loadDraft(subscriptionId) })
  }

  return { draft: state.draft, update, clear }
}
