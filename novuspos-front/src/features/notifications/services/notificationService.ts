import { apiClient } from '@/shared/services/apiClient'
import { PANEL_ENDPOINTS } from '@/shared/services/endpoints'
import type { UserNotificationPage, UserNotificationQuery } from '../types'

export const notificationService = {
  list(query: UserNotificationQuery): Promise<UserNotificationPage> {
    return apiClient.get<UserNotificationPage>(PANEL_ENDPOINTS.notifications(query))
  },

  unreadCount(): Promise<{ unreadCount: number }> {
    return apiClient.get<{ unreadCount: number }>(PANEL_ENDPOINTS.unreadNotificationCount)
  },

  markRead(ids: string[]): Promise<{ marked: number; unreadCount: number }> {
    return apiClient.post<{ marked: number; unreadCount: number }>(PANEL_ENDPOINTS.markNotificationsRead, {
      ids: ids.map((id) => Number(id)).filter((id) => Number.isFinite(id)),
    })
  },

  markAllRead(): Promise<{ marked: number; unreadCount: number }> {
    return apiClient.post<{ marked: number; unreadCount: number }>(PANEL_ENDPOINTS.markNotificationsRead, {
      all: true,
    })
  },
}