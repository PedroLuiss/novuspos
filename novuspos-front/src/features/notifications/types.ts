export type UserNotificationType = 'info' | 'success' | 'warning'

export interface UserNotification {
  id: string
  title: string
  description: string
  link: string
  icon: string
  type: UserNotificationType
  audience: string
  audienceLabel: string
  createdAt: string
  isRead: boolean
  readAt: string | null
}

export interface UserNotificationPage {
  items: UserNotification[]
  total: number
  page: number
  pageSize: number
  unreadCount: number
}

export interface UserNotificationQuery {
  page: number
  pageSize: number
  search?: string
  type?: 'all' | UserNotificationType
  status?: 'all' | 'unread' | 'read'
}