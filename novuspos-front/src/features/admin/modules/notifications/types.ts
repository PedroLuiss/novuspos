import type { AdminNotification } from '@/features/admin/core/types'

export type {
  AdminNoticeType,
  AdminNoticeTypeFilter,
  AdminNotification,
  NotificationPage,
  NotificationPageSize,
  NotificationQuery,
  UserOption,
} from '@/features/admin/core/types'

/** Tipo publicado: aún no tiene id ni fecha de creación. */
export type NotificationInput = Omit<AdminNotification, 'id' | 'createdAt'>
