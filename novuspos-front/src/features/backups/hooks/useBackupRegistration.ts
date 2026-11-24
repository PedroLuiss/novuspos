import { useState } from 'react'
import { ValidationError } from '@/shared/services/apiClient'
import { toDateTimeLocalValue } from '../lib/backupFormatters'
import { hasBackupErrors, validateBackupForm } from '../lib/backupValidation'
import type { BackupFieldErrors, BackupKind, RegisterBackupRequest } from '../types'

interface FormState {
  device: string
  kind: BackupKind | null
  createdAt: string
  file: File | null
  note: string
}

function initialForm(): FormState {
  return { device: 'Caja Principal', kind: 'automatic', createdAt: toDateTimeLocalValue(), file: null, note: '' }
}

/** Estado del formulario de registro, con validación y errores de la API. */
export function useBackupRegistration(onRegister: (request: RegisterBackupRequest) => Promise<void>) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<BackupFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (partial: Partial<FormState>) => {
    setErrors({})
    setFormError(null)
    setForm((current) => ({ ...current, ...partial }))
  }

  const submit = async (): Promise<boolean> => {
    const found = validateBackupForm(form)
    if (hasBackupErrors(found)) {
      setErrors(found)
      return false
    }
    if (!form.file || !form.kind) return false

    setErrors({})
    setFormError(null)
    setIsSubmitting(true)
    try {
      await onRegister({
        device: form.device,
        kind: form.kind,
        createdAt: form.createdAt,
        file: form.file,
        note: form.note,
      })
      return true
    } catch (cause) {
      if (cause instanceof ValidationError && cause.issues) {
        setErrors(
          Object.fromEntries(
            Object.entries(cause.issues).map(([field, messages]) => [field, messages[0]]),
          ) as BackupFieldErrors,
        )
      }
      setFormError(cause instanceof Error ? cause.message : 'No pudimos registrar la copia. Inténtalo de nuevo.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { form, errors, formError, isSubmitting, update, submit }
}
