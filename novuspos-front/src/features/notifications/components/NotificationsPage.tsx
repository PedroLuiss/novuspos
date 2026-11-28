import { useEffect, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationListSkeleton, NotificationsPageSkeleton } from './NotificationSkeleton'
import type { UserNotification, UserNotificationQuery } from '../types'

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' })
}

function typeLabel(type: UserNotification['type']): string {
  if (type === 'success') return 'Éxito'
  if (type === 'warning') return 'Advertencia'
  return 'Información'
}

function typeTone(type: UserNotification['type']): string {
  if (type === 'success') return 'bg-secondary-fixed/40 text-secondary'
  if (type === 'warning') return 'bg-amber-100 text-amber-700'
  return 'bg-primary-fixed/50 text-primary'
}

const TYPE_OPTIONS: { value: NonNullable<UserNotificationQuery['type']>; label: string }[] = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'info', label: 'Información' },
  { value: 'success', label: 'Éxito' },
  { value: 'warning', label: 'Advertencia' },
]

const STATUS_OPTIONS: { value: NonNullable<UserNotificationQuery['status']>; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Sin leer' },
  { value: 'read', label: 'Leídas' },
]

export function NotificationsPage() {
  const { query, items, total, unreadCount, isLoading, setSearch, setType, setStatus, setPage, markAllRead } = useNotifications()
  const [searchDraft, setSearchDraft] = useState(query.search ?? '')

  useEffect(() => {
    if (searchDraft === (query.search ?? '')) return
    const timer = window.setTimeout(() => setSearch(searchDraft), 300)
    return () => window.clearTimeout(timer)
  }, [searchDraft, query.search, setSearch])

  const pageSize = query.pageSize ?? 20
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const first = total > 0 ? (query.page - 1) * pageSize + 1 : 0
  const last = total > 0 ? Math.min(query.page * pageSize, total) : 0

  if (isLoading && items.length === 0) return <NotificationsPageSkeleton />

  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex flex-wrap items-start justify-between gap-space-md">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Centro de avisos</p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Notificaciones</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Revisa los avisos enviados por NovusPOS para tu cuenta.</p>
        </div>
        <button
          type="button"
          onClick={() => void markAllRead()}
          className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
        >
          <MS name="done_all" className="text-[18px]" />
          Marcar todas como leídas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm">
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Buscar</span>
          <div className="relative">
            <MS name="search" className="absolute left-3 top-3 text-outline text-[18px]" />
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Título o mensaje"
              className="w-full pl-9 pr-space-sm py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Tipo</span>
          <select
            value={query.type ?? 'all'}
            onChange={(e) => setType(e.target.value as UserNotificationQuery['type'])}
            className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface"
          >
            {TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Estado</span>
          <select
            value={query.status ?? 'all'}
            onChange={(e) => setStatus(e.target.value as UserNotificationQuery['status'])}
            className="w-full px-space-sm py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface"
          >
            {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
        <span>Mostrando {first}–{last} de {total} notificaciones</span>
        <span>{unreadCount} sin leer</span>
      </div>

      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden">
        {isLoading ? (
          <div className="py-space-xs">
            <NotificationListSkeleton rows={5} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-space-lg text-center text-on-surface-variant font-body-sm text-body-sm">No hay notificaciones con estos filtros.</div>
        ) : (
          <div className="divide-y divide-outline-variant/15">
            {items.map((item) => (
              <article key={item.id} className={`p-space-md flex gap-space-sm ${!item.isRead ? 'bg-primary-fixed/10' : ''}`}>
                <span className={`mt-0.5 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${typeTone(item.type)}`}>
                  <MS name={item.icon || 'notifications'} className="text-[20px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <h2 className="font-label-md text-label-md font-semibold text-on-surface">{item.title}</h2>
                    <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${typeTone(item.type)}`}>{typeLabel(item.type)}</span>
                    {!item.isRead && <span className="w-2 h-2 rounded-full bg-error" aria-label="Sin leer" />}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.description}</p>
                  <div className="mt-space-xs flex flex-wrap items-center gap-space-sm font-label-sm text-label-sm text-outline">
                    <span>{formatDate(item.createdAt)}</span>
                    {item.link && (
                      <a href={item.link} className="text-primary hover:underline">Abrir enlace</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-space-sm">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Página {query.page} de {totalPages}</span>
        <div className="flex gap-space-xs">
          <button
            type="button"
            disabled={query.page <= 1 || isLoading}
            onClick={() => setPage(query.page - 1)}
            className="px-space-md py-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container disabled:opacity-50 font-label-sm text-label-sm"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={query.page >= totalPages || isLoading}
            onClick={() => setPage(query.page + 1)}
            className="px-space-md py-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container disabled:opacity-50 font-label-sm text-label-sm"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}
