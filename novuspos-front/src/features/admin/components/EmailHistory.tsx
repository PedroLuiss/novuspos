import { useEffect, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { formatAdminDate } from '../lib/adminFormatters'
import { adminCompactButton, adminInput } from '../lib/adminStyles'
import type { AdminEmail, AdminUser, EmailPageSize, EmailQuery } from '../types'
import { AdminBadge, AdminCard, AdminState } from './ui/AdminUi'

interface Props {
  emails: AdminEmail[]
  total: number
  page: number
  pageSize: EmailPageSize
  totalPages: number
  isLoading: boolean
  query: EmailQuery
  users: AdminUser[]
  onSearch: (value: string) => void
  onAudience: (value: string) => void
  onPageSize: (value: EmailPageSize) => void
  onPage: (page: number) => void
  onReset: () => void
}

const pageSizeOptions: EmailPageSize[] = [20, 50, 100]

/** Historial paginado: el gateway filtra y corta, esta vista solo renderiza la página actual. */
export function EmailHistory({
  emails,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  query,
  users,
  onSearch,
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
  const hasFilters = Boolean(query.search || query.audience)

  return (
    <AdminCard
      icon="history"
      title="Correos enviados"
      description="Mensajes ya enviados, con búsqueda, filtros y paginación"
      action={<span className="rounded-full bg-surface-container px-space-sm py-1 font-label-sm text-label-sm font-mono text-on-surface-variant">{total} {total === 1 ? 'correo' : 'correos'}</span>}
    >
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-3">
        <label className="flex flex-col gap-space-xs" htmlFor="admin-email-history-search">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Buscar</span>
          <span className="relative">
            <MS name="search" className="absolute left-3 top-3 text-outline text-[18px]" />
            <input
              id="admin-email-history-search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Asunto, mensaje o destinatario"
              className={`${adminInput} pl-9`}
            />
          </span>
        </label>

        <label className="flex flex-col gap-space-xs" htmlFor="admin-email-history-audience">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Destinatario</span>
          <select
            id="admin-email-history-audience"
            value={query.audience}
            onChange={(event) => onAudience(event.target.value)}
            className={adminInput}
          >
            <option value="">Todos los destinatarios</option>
            <option value="all">Correos a todos</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.businessName}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-space-xs" htmlFor="admin-email-history-size">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Por página</span>
          <select
            id="admin-email-history-size"
            value={pageSize}
            onChange={(event) => onPageSize(Number(event.target.value) as EmailPageSize)}
            className={adminInput}
          >
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size} correos</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-xs rounded-xl bg-surface-container-low/60 px-space-sm py-space-xs">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando <span className="font-mono font-semibold text-on-surface">{first}–{last}</span> de <span className="font-mono font-semibold text-on-surface">{total}</span> {total === 1 ? 'correo' : 'correos'}
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

      {isLoading && emails.length === 0 ? (
        <AdminState label="Cargando historial…" loading />
      ) : emails.length === 0 ? (
        <AdminState label="No hay correos con estos filtros." />
      ) : (
        <div className={`flex flex-col divide-y divide-outline-variant/50 transition ${isLoading ? 'opacity-60' : ''}`}>
          {emails.map((item) => (
            <div key={item.id} data-email-item={item.id} className="flex flex-col gap-space-xs py-space-xs first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="truncate font-label-md text-label-md font-semibold text-on-surface">{item.subject}</span>
                <AdminBadge tone="info">{item.audienceLabel}</AdminBadge>
              </div>
              <span className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{item.body}</span>
              <span className="font-label-sm text-label-sm text-outline font-mono">{formatAdminDate(item.createdAt)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/50 pt-space-sm">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {hasFilters ? 'Los filtros se aplican a todo el historial.' : `Tamaño de página: ${pageSize} correos.`}
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
