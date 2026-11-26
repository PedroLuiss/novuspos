import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import type { AdminUser, UserPatch } from '../types'

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .listUsers()
      .then(setUsers)
      .catch(() => setError('No pudimos cargar los usuarios.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const update = useCallback(async (userId: string, patch: UserPatch) => {
    setBusyId(userId)
    try {
      const updated = await adminService.updateUser(userId, patch)
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError('No pudimos guardar los cambios.')
    } finally {
      setBusyId(null)
    }
  }, [])

  const setSubscription = useCallback(async (userId: string, planId: string, active: boolean) => {
    setBusyId(userId)
    try {
      const updated = await adminService.setSubscription(userId, planId, active)
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError('No pudimos actualizar la suscripción.')
    } finally {
      setBusyId(null)
    }
  }, [])

  return { users, isLoading, busyId, error, refresh, update, setSubscription }
}
