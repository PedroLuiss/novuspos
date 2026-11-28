import { useEffect } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { subscribeToUserNotifications } from '../services/realtimeNotifications'
import type { UserNotification } from '../types'

/** Conecta al usuario a los canales privados de Reverb; sin sondeo periódico. */
export function useRealtimeNotifications(onNotification: (notification: UserNotification) => void): void {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    return subscribeToUserNotifications(String(user.id), onNotification)
  }, [isAuthenticated, user?.id, onNotification])
}
