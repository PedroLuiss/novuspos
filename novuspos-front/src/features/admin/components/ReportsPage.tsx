import { useEffect, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { REPORT_PAGE_SIZES, useAdminReports } from '../hooks/useAdminReports'
import { formatAdminDate, reportTone } from '../lib/adminFormatters'
import { adminCompactButton, adminInput, adminTd, adminTh } from '../lib/adminStyles'
import type { AdminReport, ReportPageSize, ReportSourceFilter, ReportStatusFilter } from '../types'
import { AdminAlert, AdminAvatar, AdminBadge, AdminCard, AdminFilterChip, AdminModal, AdminPageHeader, AdminState } from './ui/AdminUi'

const sourceOptions: { value: ReportSourceFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'web', label: 'Portal' },
  { value: 'desktop', label: 'Escritorio' },
]
const statusOptions: { value: ReportStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abiertos' },
  { value: 'resolved', label: 'Atendidos' },
]

/** Historial paginado de reportes llegados desde el portal o desde NovusPOS Desktop. */
export function ReportsPage() {
  const {
    reports,
    total,
    page,
    pageSize,
    totalPages,
    summary,
    query,
    isLoading,
    error,
    setSearch,
    setSource,
    setStatus,
    setPageSize,
    setPage,
    resetFilters,
  } = useAdminReports()
  const [searchDraft, setSearchDraft] = useState(query.search)
  const [selected, setSelected] = useState<AdminReport | null>(null)

  useEffect(() => {
    if (searchDraft === query.search) return
    const timer = window.setTimeout(() => setSearch(searchDraft), 300)
    return () => window.clearTimeout(timer)
  }, [searchDraft, query.search, setSearch])

  const clearFilters = () => {
    setSearchDraft('')
    resetFilters()
  }

  const first = total > 0 ? (page - 1) * pageSize + 1 : 0
  const last = total > 0 ? Math.min(page * pageSize, total) : 0
  const hasFilters = Boolean(query.search || query.source !== 'all' || query.status !== 'all')

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Incidencias"
        title="Reportes de usuarios"
        description="Problemas enviados desde el portal o desde la aplicación de escritorio."
      />

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        {[
          { label: 'Reportes recibidos', value: summary.total, icon: 'report_problem', tone: 'text-primary', bg: 'bg-primary-fixed/50' },
          { label: 'Abiertos', value: summary.open, icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
          { label: 'Desde el escritorio', value: summary.desktop, icon: 'desktop_windows', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-space-md py-space-sm shadow-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{item.label}</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{item.value}</span>
            </div>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} ${item.tone}`}>
              <MS name={item.icon} className="text-[19px]" />
            </span>
          </div>
        ))}
      </div>

      {error && <AdminAlert>{error}</AdminAlert>}

      <AdminCard icon="filter_list" title="Filtrar reportes" description="Busca por usuario o asunto y filtra por origen y estado">
        <div className="flex flex-col gap-space-sm">
          <div className="relative w-full sm:max-w-md">
            <MS name="search" className="absolute left-3 top-2.5 text-outline text-[19px]" />
            <input
              id="admin-report-search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Buscar por usuario, asunto o mensaje"
              aria-label="Buscar reportes"
              className={`${adminInput} pl-10`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Origen</span>
              {sourceOptions.map((item) => (
                <AdminFilterChip key={item.value} label={item.label} active={query.source === item.value} onClick={() => setSource(item.value)} />
              ))}
            </div>
            <span className="hidden h-6 w-px bg-outline-variant/70 sm:block" />
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Estado</span>
              {statusOptions.map((item) => (
                <AdminFilterChip key={item.value} label={item.label} active={query.status === item.value} onClick={() => setStatus(item.value)} />
              ))}
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden" icon="article" title={`${total} ${total === 1 ? 'reporte encontrado' : 'reportes encontrados'}`}>
        <div className="flex flex-wrap items-center justify-between gap-space-xs rounded-xl bg-surface-container-low/60 px-space-sm py-space-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando <span className="font-mono font-semibold text-on-surface">{first}–{last}</span> de{' '}
            <span className="font-mono font-semibold text-on-surface">{total}</span> reportes
          </span>
          <span className="font-label-sm text-label-sm font-mono text-outline">Página {page} de {totalPages}</span>
        </div>

        {isLoading && reports.length === 0 ? (
          <AdminState label="Cargando reportes…" loading />
        ) : reports.length === 0 ? (
          <AdminState label="No hay reportes con estos filtros." />
        ) : (
          <div className={`overflow-x-auto transition ${isLoading ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="bg-surface-container-low/70">
                  <th className={`${adminTh} rounded-l-xl`}>Usuario</th>
                  <th className={adminTh}>Asunto</th>
                  <th className={adminTh}>Origen</th>
                  <th className={adminTh}>Fecha</th>
                  <th className={adminTh}>Estado</th>
                  <th className={`${adminTh} rounded-r-xl text-right`}>Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm">
                {reports.map((item) => (
                  <tr key={item.id} data-report-item={item.id} className="transition hover:bg-surface-container-low/60">
                    <td className={adminTd}>
                      <div className="flex items-center gap-space-sm">
                        <AdminAvatar name={item.userName} />
                        <span className="font-label-md text-label-md font-semibold text-on-surface">{item.userName}</span>
                      </div>
                    </td>
                    <td className={`${adminTd} text-on-surface-variant`}>{item.subject}</td>
                    <td className={adminTd}>
                      <AdminBadge tone="neutral">
                        <MS name={item.source === 'web' ? 'public' : 'desktop_windows'} className="text-[14px]" />
                        {item.source === 'web' ? 'Portal' : 'Escritorio'}
                      </AdminBadge>
                    </td>
                    <td className={`${adminTd} font-mono text-on-surface-variant`}>{formatAdminDate(item.createdAt)}</td>
                    <td className={adminTd}><AdminBadge tone={reportTone(item.status)}>{item.status === 'open' ? 'Abierto' : 'Atendido'}</AdminBadge></td>
                    <td className={`${adminTd} text-right`}>
                      <button type="button" onClick={() => setSelected(item)} className="rounded-lg px-space-sm py-1.5 font-label-sm text-label-sm font-semibold text-primary hover:bg-primary-fixed/40">
                        Ver detalle →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/50 pt-space-sm">
          <label className="flex items-center gap-space-xs" htmlFor="admin-report-page-size">
            <span className="font-label-sm text-label-sm text-outline">Por página</span>
            <select
              id="admin-report-page-size"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value) as ReportPageSize)}
              className={`${adminInput} h-9 w-20`}
            >
              {REPORT_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-space-xs">
            {hasFilters && (
              <button type="button" onClick={clearFilters} className={adminCompactButton}>
                <MS name="filter_alt_off" className="text-[15px]" /> Limpiar filtros
              </button>
            )}
            <button type="button" disabled={page <= 1 || isLoading} onClick={() => setPage(page - 1)} className={adminCompactButton}>
              <MS name="chevron_left" className="text-[16px]" /> Anterior
            </button>
            <button type="button" disabled={page >= totalPages || isLoading} onClick={() => setPage(page + 1)} className={adminCompactButton}>
              Siguiente <MS name="chevron_right" className="text-[16px]" />
            </button>
          </div>
        </div>
      </AdminCard>

      {selected && (
        <AdminModal title={selected.subject} subtitle={selected.userName} onClose={() => setSelected(null)}>
          <div className="flex flex-wrap items-center gap-space-xs">
            <AdminBadge tone={reportTone(selected.status)}>{selected.status === 'open' ? 'Abierto' : 'Atendido'}</AdminBadge>
            <AdminBadge tone="neutral">{selected.source === 'web' ? 'Portal' : 'Escritorio'}</AdminBadge>
            <span className="font-label-sm text-label-sm text-outline font-mono">{formatAdminDate(selected.createdAt)}</span>
          </div>
          <div className="rounded-xl bg-surface-container p-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Mensaje del usuario</span>
            <p className="mt-1 font-body-md text-body-md text-on-surface">{selected.description}</p>
          </div>
        </AdminModal>
      )}
    </div>
  )
}
