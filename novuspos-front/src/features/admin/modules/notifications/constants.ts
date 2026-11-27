import type { AdminNoticeType, NotificationPageSize, NotificationQuery } from './types'

export const NOTIFICATION_PAGE_SIZES: readonly NotificationPageSize[] = [20, 50, 100]

export const NOTIFICATION_ICON_OPTIONS: readonly { value: string; label: string }[] = [
  { value: 'campaign', label: 'Anuncio' },
  { value: 'schedule', label: 'Recordatorio' },
  { value: 'new_releases', label: 'Novedad' },
  { value: 'lock', label: 'Seguridad' },
]

export const NOTIFICATION_TYPE_OPTIONS: readonly { value: AdminNoticeType; label: string }[] = [
  { value: 'info', label: 'Información' },
  { value: 'success', label: 'Éxito' },
  { value: 'warning', label: 'Advertencia' },
]

export const DEFAULT_NOTIFICATION_QUERY: NotificationQuery = {
  page: 1,
  pageSize: 20,
  search: '',
  type: 'all',
  audience: '',
}
