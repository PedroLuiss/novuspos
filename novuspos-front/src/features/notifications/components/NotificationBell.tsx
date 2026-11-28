import { useEffect, useRef } from 'react'
import { useNotificationBell } from '../hooks/useNotificationBell'
import { NotificationListSkeleton } from './NotificationSkeleton'
import type { UserNotification } from '../types'
import { navigate } from '@/shared/router/navigation'
import { MS } from '@/shared/ui/MS'

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' })
}

function badgeLabel(count: number): string {
  if (count <= 0) return ''
  return count > 10 ? '9+' : String(count)
}

function typeTone(type: UserNotification['type']): string {
  if (type === 'success') return 'text-secondary bg-secondary-fixed/40'
  if (type === 'warning') return 'text-amber-700 bg-amber-100'
  return 'text-primary bg-primary-fixed/50'
}

export function NotificationBell() {
  const bell = useNotificationBell()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!bell.open) return

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) bell.close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') bell.close()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [bell])

  const onScroll = () => {
    const el = listRef.current
    if (!el || !bell.hasMore || bell.isLoadingMore) return
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40
    if (nearBottom) bell.loadMore()
  }

  const openItem = (item: UserNotification) => {
    bell.close()
    if (item.link) navigate(item.link)
  }

  const countLabel = badgeLabel(bell.unreadCount)

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={bell.toggle}
        className="relative w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
        aria-label="Notificaciones"
        aria-haspopup="dialog"
        aria-expanded={bell.open}
      >
        <MS name="notifications" className="text-[20px]" />
        {countLabel && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-error text-on-error font-label-sm text-[11px] font-bold flex items-center justify-center">
            {countLabel}
          </span>
        )}
      </button>

      {bell.open && (
        <div className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
          <div className="px-space-md py-space-sm border-b border-outline-variant/20 flex items-center justify-between gap-space-sm">
            <div>
              <p className="font-label-md text-label-md font-semibold text-on-surface">Notificaciones</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {bell.unreadCount > 0 ? `${bell.unreadCount} sin leer` : 'Todo al día'}
              </p>
            </div>
            <a
              href="/panel/notificaciones"
              onClick={(e) => {
                e.preventDefault()
                bell.close()
                navigate('/panel/notificaciones')
              }}
              className="font-label-sm text-label-sm text-primary hover:underline"
            >
              Ver todas
            </a>
          </div>

          <div ref={listRef} onScroll={onScroll} className="max-h-[420px] overflow-y-auto">
            {bell.isLoading ? (
              <div className="py-space-xs">
                <NotificationListSkeleton rows={4} />
              </div>
            ) : bell.items.length === 0 ? (
              <div className="p-space-md text-center font-body-sm text-body-sm text-on-surface-variant">No tienes notificaciones.</div>
            ) : (
              <div className="divide-y divide-outline-variant/15">
                {bell.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openItem(item)}
                    className={`w-full text-left px-space-md py-space-sm hover:bg-surface-container-low transition-colors flex gap-space-sm ${!item.isRead ? 'bg-primary-fixed/10' : ''}`}
                  >
                    <span className={`mt-0.5 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${typeTone(item.type)}`}>
                      <MS name={item.icon || 'notifications'} className="text-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-space-xs">
                        <p className="font-label-md text-label-md font-semibold text-on-surface truncate">{item.title}</p>
                        {!item.isRead && <span className="mt-1.5 w-2 h-2 rounded-full bg-error shrink-0" aria-label="Sin leer" />}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{item.description}</p>
                      <p className="font-label-sm text-label-sm text-outline mt-1">{formatDate(item.createdAt)}</p>
                    </div>
                  </button>
                ))}
                {bell.isLoadingMore && (
                  <div className="p-space-sm text-center font-label-sm text-label-sm text-on-surface-variant">Cargando más…</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
