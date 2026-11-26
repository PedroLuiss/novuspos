import { useMemo, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { useAdminReports } from '../hooks/useAdminReports'
import { formatAdminDate, reportTone } from '../lib/adminFormatters'
import { adminTd, adminTh } from '../lib/adminStyles'
import type { AdminReport } from '../types'
import { AdminAlert, AdminAvatar, AdminBadge, AdminCard, AdminFilterChip, AdminModal, AdminPageHeader, AdminState } from './ui/AdminUi'

/** Reportes llegados desde la web o desde NovusPOS Desktop. */
export function ReportsPage() {
  const { reports, isLoading, error } = useAdminReports()
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<AdminReport | null>(null)

  const visible = useMemo(
    () => reports.filter((item) => (source === 'all' || item.source === source) && (status === 'all' || item.status === status)),
    [reports, source, status],
  )
  const openCount = reports.filter((item) => item.status === 'open').length
  const desktopCount = reports.filter((item) => item.source === 'desktop').length

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Incidencias"
        title="Reportes de usuarios"
        description="Problemas enviados desde el portal o desde la aplicación de escritorio."
      />

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        {[
          { label: 'Reportes recibidos', value: reports.length, icon: 'report_problem', tone: 'text-primary', bg: 'bg-primary-fixed/50' },
          { label: 'Abiertos', value: openCount, icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
          { label: 'Desde el escritorio', value: desktopCount, icon: 'desktop_windows', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
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

      <AdminCard icon="filter_list" title="Filtrar reportes" description="Por origen y estado">
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Origen</span>
            {[{ value: 'all', label: 'Todos' }, { value: 'web', label: 'Portal' }, { value: 'desktop', label: 'Escritorio' }].map((item) => (
              <AdminFilterChip key={item.value} label={item.label} active={source === item.value} onClick={() => setSource(item.value)} />
            ))}
          </div>
          <span className="hidden h-6 w-px bg-outline-variant/70 sm:block" />
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Estado</span>
            {[{ value: 'all', label: 'Todos' }, { value: 'open', label: 'Abiertos' }, { value: 'resolved', label: 'Atendidos' }].map((item) => (
              <AdminFilterChip key={item.value} label={item.label} active={status === item.value} onClick={() => setStatus(item.value)} />
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden" icon="article" title={`${visible.length} ${visible.length === 1 ? 'reporte encontrado' : 'reportes encontrados'}`}>
        {isLoading && reports.length === 0 ? (
          <AdminState label="Cargando reportes…" loading />
        ) : visible.length === 0 ? (
          <AdminState label="No hay reportes con estos filtros." />
        ) : (
          <div className="overflow-x-auto">
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
                {visible.map((item) => (
                  <tr key={item.id} className="transition hover:bg-surface-container-low/60">
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
