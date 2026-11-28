import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationService } from '../services/notificationService'
import type { UserNotification, UserNotificationQuery } from '../types'

const PAGE_SIZE = 20

const DEFAULT_QUERY: UserNotificationQuery = {
  page: 1,
  pageSize: PAGE_SIZE,
  search: '',
  type: 'all',
  status: 'all',
}

export function useNotifications() {
  const [query, setQuery] = useState<UserNotificationQuery>(DEFAULT_QUERY)
  const [items, setItems] = useState<UserNotification[]>([])
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const requestRef = useRef(0)

  const load = useCallback(async (nextQuery: UserNotificationQuery) => {
    const requestId = ++requestRef.current
    setIsLoading(true)
    try {
      const result = await notificationService.list(nextQuery)
      if (requestRef.current !== requestId) return
      setItems(result.items)
      setTotal(result.total)
      setUnreadCount(result.unreadCount ?? 0)
    } catch {
      if (requestRef.current !== requestId) return
      setItems([])
      setTotal(0)
    } finally {
      if (requestRef.current === requestId) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(query)
  }, [load, query])

  useEffect(() => {
    const interval = window.setInterval(() => void load(query), 15000)
    const onFocus = () => void load(query)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void load(query)
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [load, query])

  const updateQuery = useCallback((patch: Partial<UserNotificationQuery>) => {
    setQuery((current) => ({ ...current, ...patch, page: patch.page ?? 1 }))
  }, [])

  const setPage = useCallback((page: number) => setQuery((current) => ({ ...current, page })), [])

  const refresh = useCallback(() => {
    void load(query)
  }, [load, query])

  const markAllRead = useCallback(async () => {
    try {
      const result = await notificationService.markAllRead()
      setUnreadCount(result.unreadCount ?? 0)
      setItems((current) => current.map((item) => ({ ...item, isRead: true })))
    } catch {
      // ignorar
    }
  }, [])

  return {
    query,
    items,
    total,
    unreadCount,
    isLoading,
    setSearch: (search: string) => updateQuery({ search, page: 1 }),
    setType: (type: UserNotificationQuery['type']) => updateQuery({ type, page: 1 }),
    setStatus: (status: UserNotificationQuery['status']) => updateQuery({ status, page: 1 }),
    setPage,
    refresh,
    markAllRead,
  }
}
