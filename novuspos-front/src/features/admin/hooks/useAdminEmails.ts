import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import type { AdminEmail } from '../types'

export type EmailInput = Omit<AdminEmail, 'id' | 'createdAt'>

export function useAdminEmails() {
  const [emails, setEmails] = useState<AdminEmail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .listEmails()
      .then(setEmails)
      .catch(() => setError('No pudimos cargar los correos.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const send = useCallback(async (input: EmailInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const created = await adminService.createEmail(input)
      setEmails((current) => [created, ...current])
      return true
    } catch {
      setError('No pudimos registrar el correo.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { emails, isLoading, isSubmitting, error, refresh, send }
}
