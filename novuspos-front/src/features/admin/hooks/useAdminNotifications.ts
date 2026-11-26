import { useCallback, useEffect, useRef, useState } from 'react'
import { adminService } from '../services/adminService'
import type {
  AdminNoticeTypeFilter,
  AdminNotification,
  NotificationPage,
  NotificationPageSize,
  NotificationQuery,
} from '../types'

/** Tipo publicado es distinto del tipo de entrada, que aún no tiene id/fecha. */
export type NotificationInput = Omit<AdminNotification, 'id' | 'createdAt'>

export const NOTIFICATION_PAGE_SIZES: NotificationPageSize[] = [20, 50, 100]

const DEFAULT_QUERY: NotificationQuery = { page: 1, pageSize: 20, search: '', type: 'all', audience: '' }
const EMPTY_PAGE: NotificationPage = { items: [], total: 0, page: 1, pageSize: 20 }

/** Container del historial: deja el filtrado y el corte al gateway (demo o Laravel). */
export function useAdminNotifications() {
  const [query, setQuery] = useState<NotificationQuery>(DEFAULT_QUERY)
  const [result, setResult] = useState<NotificationPage>(EMPTY_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)

  // Los cambios de filtro encienden el loader desde el evento, no desde el effect.
  const beginLoad = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const load = useCallback(async (next: NotificationQuery) => {
    const request = ++requestRef.current
    try {
      const data = await adminService.listNotifications(next)
      if (request === requestRef.current) setResult(data)
    } catch {
      if (request === requestRef.current) setError('No pudimos cargar las notificaciones.')
    } finally {
      if (request === requestRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load(query))
  }, [load, query])

  const patchFilters = useCallback((changes: Partial<NotificationQuery>) => {
    beginLoad()
    setQuery((current) => ({ ...current, ...changes, page: changes.page ?? 1 }))
  }, [beginLoad])

  const setSearch = useCallback((search: string) => patchFilters({ search }), [patchFilters])
  const setType = useCallback((type: AdminNoticeTypeFilter) => patchFilters({ type }), [patchFilters])
  const setAudience = useCallback((audience: string) => patchFilters({ audience }), [patchFilters])
  const setPageSize = useCallback((pageSize: NotificationPageSize) => patchFilters({ pageSize }), [patchFilters])

  const setPage = useCallback((page: number) => {
    beginLoad()
    setQuery((current) => ({ ...current, page: Math.max(1, page) }))
  }, [beginLoad])

  const resetFilters = useCallback(() => {
    patchFilters({ search: '', type: 'all', audience: '' })
  }, [patchFilters])

  const refresh = useCallback(() => {
    beginLoad()
    return load(query)
  }, [beginLoad, load, query])

  const create = useCallback(async (input: NotificationInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await adminService.createNotification(input)
      beginLoad()
      await load(query)
      return true
    } catch {
      setError('No pudimos publicar la notificación.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [beginLoad, load, query])

  return {
    notifications: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / result.pageSize)),
    query,
    isLoading,
    isSubmitting,
    error,
    setSearch,
    setType,
    setAudience,
    setPageSize,
    setPage,
    resetFilters,
    refresh,
    create,
  }
}
