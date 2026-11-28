import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationService } from '../services/notificationService'
import { useRealtimeNotifications } from './useRealtimeNotifications'
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
  const queryRef = useRef(query)

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
    queryRef.current = query
    void load(query)
  }, [load, query])

  // Recarga solo cuando llega un evento WebSocket; sin temporizadores.
  const onRealtimeNotification = useCallback(() => {
    void load(queryRef.current)
  }, [load])

  useRealtimeNotifications(onRealtimeNotification)

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
