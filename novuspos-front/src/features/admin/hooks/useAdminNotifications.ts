import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import type { AdminNotification } from '../types'

/** Tipo publicado es distinto del tipo de entrada, que aún no tiene id/fecha. */
export type NotificationInput = Omit<AdminNotification, 'id' | 'createdAt'>

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .listNotifications()
      .then(setNotifications)
      .catch(() => setError('No pudimos cargar las notificaciones.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const create = useCallback(async (input: NotificationInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const created = await adminService.createNotification(input)
      setNotifications((current) => [created, ...current])
      return true
    } catch {
      setError('No pudimos publicar la notificación.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { notifications, isLoading, isSubmitting, error, refresh, create }
}
