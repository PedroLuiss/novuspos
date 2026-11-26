import { useCallback, useEffect, useState } from 'react'
import { paymentMethodsService } from '@/shared/services/payment-methods/paymentMethodsService'
import {
  uniquePaymentMethodId,
} from '@/shared/services/payment-methods/paymentMethodsStore'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { adminService } from '../services/adminService'

/** Contenedor del catálogo: mantiene un borrador hasta que el dueño guarda. */
export function usePaymentMethodsEditor() {
  const [draft, setDraft] = useState<PaymentMethodOption[]>([])
  const [savedSnapshot, setSavedSnapshot] = useState('[]')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return paymentMethodsService
      .list()
      .catch(() => paymentMethodsService.readCached())
      .then((methods) => {
        setDraft(methods)
        setSavedSnapshot(JSON.stringify(methods))
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load())
  }, [load])

  const suggestId = useCallback(
    (label: string) => uniquePaymentMethodId(label, draft.map((item) => item.id)),
    [draft],
  )

  const upsert = useCallback((method: PaymentMethodOption) => {
    setSaved(false)
    setError(null)
    setDraft((current) => {
      const id = method.id.trim() || uniquePaymentMethodId(method.label, current.map((item) => item.id))
      const next = { ...method, id }
      return current.some((item) => item.id === id)
        ? current.map((item) => (item.id === id ? next : item))
        : [...current, next]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setSaved(false)
    setError(null)
    setDraft((current) => current.filter((item) => item.id !== id))
  }, [])

  const toggle = useCallback((id: string) => {
    setSaved(false)
    setError(null)
    setDraft((current) => current.map((item) => (item.id === id ? { ...item, active: !item.active } : item)))
  }, [])

  const save = useCallback(async () => {
    if (draft.length === 0) {
      setError('Agrega al menos un método de pago antes de guardar.')
      return false
    }
    setIsSaving(true)
    setSaved(false)
    setError(null)
    try {
      const updated = await adminService.savePaymentMethods(draft)
      setDraft(updated)
      setSavedSnapshot(JSON.stringify(updated))
      setSaved(true)
      return true
    } catch {
      setError('No pudimos guardar los métodos de pago. Inténtalo de nuevo.')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [draft])

  const reset = useCallback(() => {
    const methods = JSON.parse(savedSnapshot) as PaymentMethodOption[]
    setDraft(methods)
    setSaved(false)
    setError(null)
  }, [savedSnapshot])

  return {
    draft,
    isDirty: JSON.stringify(draft) !== savedSnapshot,
    isLoading,
    isSaving,
    saved,
    error,
    suggestId,
    upsert,
    remove,
    toggle,
    save,
    reset,
  }
}
