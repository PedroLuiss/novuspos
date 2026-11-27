import { useEffect, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { formatAdminDate, noticeTone, statusLabels } from '@/features/admin/core/lib/adminFormatters'
import { adminCompactButton, adminInput } from '@/features/admin/core/lib/adminStyles'
import type {
  AdminNoticeTypeFilter,
  AdminNotification,
  NotificationPageSize,
  NotificationQuery,
  UserOption,
} from '../types'
import { AdminBadge, AdminCard, AdminState } from '@/features/admin/core/ui/AdminUi'

interface Props {
  notifications: AdminNotification[]
  total: number
  page: number
  pageSize: NotificationPageSize
  totalPages: number
  isLoading: boolean
  query: NotificationQuery
  users: UserOption[]
  onSearch: (value: string) => void
  onType: (value: AdminNoticeTypeFilter) => void
  onAudience: (value: string) => void
  onPageSize: (value: NotificationPageSize) => void
  onPage: (page: number) => void
  onReset: () => void
}

const typeOptions: { value: AdminNoticeTypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'info', label: 'Información' },
  { value: 'success', label: 'Éxito' },
  { value: 'warning', label: 'Advertencia' },
]

const pageSizeOptions: NotificationPageSize[] = [20, 50, 100]

/** Historial paginado: el gateway filtra y corta, esta vista solo renderiza la página actual. */
export function NotificationHistory({
  notifications,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  query,
  users,
  onSearch,
  onType,
  onAudience,
  onPageSize,
  onPage,
  onReset,
}: Props) {
  const [searchDraft, setSearchDraft] = useState(query.search)

  useEffect(() => {
    if (searchDraft === query.search) return
    const timer = window.setTimeout(() => onSearch(searchDraft), 300)
    return () => window.clearTimeout(timer)
  }, [searchDraft, query.search, onSearch])

  const clearFilters = () => {
    setSearchDraft('')
    onReset()
  }

  const first = total > 0 ? (page - 1) * pageSize + 1 : 0
  const last = total > 0 ? Math.min(page * pageSize, total) : 0
  const hasFilters = Boolean(query.search || query.type !== 'all' || query.audience)

  return (
    <AdminCard
      icon="history"
      title="Historial"
      description="Avisos ya publicados, con búsqueda, filtros y paginación"
      action={<span className="rounded-full bg-surface-container px-space-sm py-1 font-label-sm text-label-sm font-mono text-on-surface-variant">{total} {total === 1 ? 'registro' : 'registros'}</span>}
    >
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-space-xs" htmlFor="admin-notice-history-search">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Buscar</span>
          <span className="relative">
            <MS name="search" className="absolute left-3 top-3 text-outline text-[18px]" />
            <input
              id="admin-notice-history-search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Título, mensaje o destinatario"
              className={`${adminInput} pl-9`}
            />
          </span>
        </label>

        <label className="flex flex-col gap-space-xs" htmlFor="admin-notice-history-type">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Tipo</span>
          <select
            id="admin-notice-history-type"
            value={query.type}
            onChange={(event) => onType(event.target.value as AdminNoticeTypeFilter)}
            className={adminInput}
          >
            {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-space-xs" htmlFor="admin-notice-history-audience">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Destinatario</span>
          <select
            id="admin-notice-history-audience"
            value={query.audience}
            onChange={(event) => onAudience(event.target.value)}
            className={adminInput}
          >
            <option value="">Todos los destinatarios</option>
            <option value="all">Avisos globales</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.businessName}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-space-xs" htmlFor="admin-notice-history-size">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Por página</span>
          <select
            id="admin-notice-history-size"
            value={pageSize}
            onChange={(event) => onPageSize(Number(event.target.value) as NotificationPageSize)}
            className={adminInput}
          >
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size} notificaciones</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-xs rounded-xl bg-surface-container-low/60 px-space-sm py-space-xs">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando <span className="font-mono font-semibold text-on-surface">{first}–{last}</span> de <span className="font-mono font-semibold text-on-surface">{total}</span> {total === 1 ? 'notificación' : 'notificaciones'}
        </span>
        <div className="flex flex-wrap items-center gap-space-xs">
          {hasFilters && (
            <button type="button" onClick={clearFilters} className={adminCompactButton}>
              <MS name="filter_alt_off" className="text-[15px]" /> Limpiar filtros
            </button>
          )}
          <span className="font-label-sm text-label-sm font-mono text-outline">Página {page} de {totalPages}</span>
        </div>
      </div>

      {isLoading && notifications.length === 0 ? (
        <AdminState label="Cargando historial…" loading />
      ) : notifications.length === 0 ? (
        <AdminState label="No hay notificaciones con estos filtros." />
      ) : (
        <div className={`flex flex-col divide-y divide-outline-variant/50 transition ${isLoading ? 'opacity-60' : ''}`}>
          {notifications.map((item) => (
            <div key={item.id} data-history-item={item.id} className="flex items-start gap-space-xs py-space-xs first:pt-0 last:pb-0">
              <span className="w-8 h-8 shrink-0 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center">
                <MS name={item.icon} className="text-[17px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="truncate font-label-md text-label-md font-semibold text-on-surface">{item.title}</span>
                  <AdminBadge tone={noticeTone(item.type)}>{statusLabels[item.type]}</AdminBadge>
                </div>
                <span className="block truncate font-body-sm text-body-sm text-on-surface-variant">{item.audienceLabel}</span>
                <span className="block font-label-sm text-label-sm text-outline font-mono">{formatAdminDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/50 pt-space-sm">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {hasFilters ? 'Los filtros se aplican a todo el historial.' : `Tamaño de página: ${pageSize} notificaciones.`}
        </span>
        <div className="flex gap-space-xs">
          <button type="button" disabled={page <= 1 || isLoading} onClick={() => onPage(page - 1)} className={adminCompactButton}>
            <MS name="chevron_left" className="text-[16px]" /> Anterior
          </button>
          <button type="button" disabled={page >= totalPages || isLoading} onClick={() => onPage(page + 1)} className={adminCompactButton}>
            Siguiente <MS name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </div>
    </AdminCard>
  )
}
