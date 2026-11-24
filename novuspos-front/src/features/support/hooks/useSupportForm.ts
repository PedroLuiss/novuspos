import { useCallback, useState, type FormEvent } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { createEmptyDraft } from '../data/support-data'
import { emptySupportErrors, toSupportFormError, type SupportFormErrorState } from '../lib/supportFormErrors'
import { supportService } from '../services/supportService'
import type { SupportDraft, SupportFieldErrors, SupportTicket } from '../types'

/** Contenedor del formulario: valida, envía y muestra la confirmación. */
export function useSupportForm() {
  const { user } = useAuth()
  const [draft, setDraft] = useState<SupportDraft>(() => createEmptyDraft(user?.email ?? ''))
  const [errorState, setErrorState] = useState<SupportFormErrorState>(emptySupportErrors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticket, setTicket] = useState<SupportTicket | null>(null)

  const setField = useCallback(<K extends keyof SupportDraft>(field: K, value: SupportDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrorState((current) => {
      if (!current.fieldErrors[field as keyof SupportFieldErrors]) return current
      const fieldErrors = { ...current.fieldErrors }
      delete fieldErrors[field as keyof SupportFieldErrors]
      return { ...current, fieldErrors }
    })
  }, [])

  const submit = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault()
      setErrorState(emptySupportErrors)
      setIsSubmitting(true)
      try {
        setTicket(await supportService.submit(draft))
      } catch (error) {
        setErrorState(toSupportFormError(error, 'No pudimos enviar tu reporte. Inténtalo de nuevo.'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [draft],
  )

  const startAgain = useCallback(() => {
    setDraft(createEmptyDraft(draft.email))
    setErrorState(emptySupportErrors)
    setTicket(null)
  }, [draft.email])

  return { draft, ticket, isSubmitting, ...errorState, setField, submit, startAgain }
}
