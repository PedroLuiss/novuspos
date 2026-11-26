import { useCallback, useEffect, useState } from 'react'
import { plansStore, uniquePlanId } from '@/shared/services/plans/plansStore'
import type { PlanOption } from '@/shared/services/plans/types'
import { adminService } from '../services/adminService'

/** Borrador del catálogo de suscripciones; solo se publica al guardar. */
export function usePlansEditor() {
  const [draft, setDraft] = useState<PlanOption[]>([])
  const [savedSnapshot, setSavedSnapshot] = useState('[]')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return adminService
      .listPlans()
      .catch(() => plansStore.read())
      .then((plans) => {
        setDraft(plans)
        setSavedSnapshot(JSON.stringify(plans))
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load())
  }, [load])

  const suggestId = useCallback(
    (name: string) => uniquePlanId(name, draft.map((plan) => plan.id)),
    [draft],
  )

  const upsert = useCallback((plan: PlanOption) => {
    setSaved(false)
    setError(null)
    setDraft((current) => {
      const id = plan.id.trim() || uniquePlanId(plan.name, current.map((item) => item.id))
      const next = { ...plan, id }
      return current.some((item) => item.id === id)
        ? current.map((item) => (item.id === id ? next : item))
        : [...current, next]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setSaved(false)
    setError(null)
    setDraft((current) => current.filter((plan) => plan.id !== id))
  }, [])

  const toggle = useCallback((id: string) => {
    setSaved(false)
    setError(null)
    setDraft((current) => current.map((plan) => (plan.id === id ? { ...plan, active: !plan.active } : plan)))
  }, [])

  const save = useCallback(async () => {
    if (draft.length === 0) {
      setError('Agrega al menos una suscripción antes de guardar.')
      return false
    }
    setIsSaving(true)
    setSaved(false)
    setError(null)
    try {
      const updated = await adminService.savePlans(draft)
      setDraft(updated)
      setSavedSnapshot(JSON.stringify(updated))
      setSaved(true)
      return true
    } catch {
      setError('No pudimos guardar las suscripciones. Inténtalo de nuevo.')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [draft])

  const reset = useCallback(() => {
    setDraft(JSON.parse(savedSnapshot) as PlanOption[])
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
