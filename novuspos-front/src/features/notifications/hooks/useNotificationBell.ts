import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationService } from '../services/notificationService'
import type { UserNotification } from '../types'

const PAGE_SIZE = 20
const POLL_MS = 15000

export function useNotificationBell() {
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [items, setItems] = useState<UserNotification[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadedPagesRef = useRef(0)
  const openRef = useRef(false)
  const itemsRef = useRef<UserNotification[]>([])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.unreadCount()
      setUnreadCount(result.unreadCount ?? 0)
    } catch {
      // Silencioso: el badge se reintentará en el próximo ciclo.
    }
  }, [])

  const loadPage = useCallback(async (pageToLoad: number, append: boolean) => {
    if (append) setIsLoadingMore(true)
    else setIsLoading(true)

    try {
      const result = await notificationService.list({ page: pageToLoad, pageSize: PAGE_SIZE, type: 'all', status: 'all' })
      setItems((current) => {
        if (!append) return result.items
        const seen = new Set(current.map((item) => item.id))
        return [...current, ...result.items.filter((item) => !seen.has(item.id))]
      })
      setTotal(result.total)
      setUnreadCount(result.unreadCount ?? 0)
      loadedPagesRef.current = pageToLoad
    } catch {
      // Mantener estado actual; el usuario puede reintentar haciendo scroll/cerrando.
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    loadedPagesRef.current = 0
    await loadPage(1, false)
  }, [loadPage])

  useEffect(() => {
    void fetchUnreadCount()
    const interval = window.setInterval(() => {
      void fetchUnreadCount()
      if (openRef.current) void loadPage(1, false)
    }, POLL_MS)

    const onFocus = () => {
      void fetchUnreadCount()
      if (openRef.current) void loadPage(1, false)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [fetchUnreadCount, loadPage])

  const markVisibleAsRead = useCallback(async () => {
    const unreadIds = itemsRef.current.filter((item) => !item.isRead).map((item) => item.id)
    if (unreadIds.length === 0) return

    try {
      const result = await notificationService.markRead(unreadIds)
      setUnreadCount(result.unreadCount ?? 0)
      setItems((current) => current.map((item) => (unreadIds.includes(item.id) ? { ...item, isRead: true } : item)))
    } catch {
      // Si falla, se sincronizará en la próxima carga.
    }
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    openRef.current = false
    void markVisibleAsRead()
  }, [markVisibleAsRead])

  const toggle = useCallback(() => {
    setOpen((current) => {
      const next = !current
      openRef.current = next
      if (next) {
        void loadPage(1, false)
      } else {
        void markVisibleAsRead()
      }
      return next
    })
  }, [loadPage, markVisibleAsRead])

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore) return
    if (items.length >= total) return
    const nextPage = loadedPagesRef.current + 1
    void loadPage(nextPage, true)
  }, [isLoading, isLoadingMore, items.length, loadPage, total])

  const hasMore = items.length < total

  return {
    open,
    unreadCount,
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    toggle,
    close,
    loadMore,
    refresh,
  }
}
