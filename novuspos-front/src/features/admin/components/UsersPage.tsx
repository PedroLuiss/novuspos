import { useMemo, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { formatAdminDate, statusLabels, subscriptionTone } from '../lib/adminFormatters'
import { adminInput, adminSecondaryButton, adminTd, adminTh } from '../lib/adminStyles'
import type { AdminUser, UserPatch } from '../types'
import { AdminAlert, AdminAvatar, AdminBadge, AdminCard, AdminPageHeader, AdminState } from './ui/AdminUi'
import { UserEditModal } from './UserEditModal'

const PAGE_SIZE = 5

/** Directorio de usuarios con búsqueda, paginación y gestión de suscripción. */
export function UsersPage() {
  const { users, isLoading, busyId, error, update, setSubscription } = useAdminUsers()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return users.filter((item) => {
      const matchesText = !needle || [item.name, item.email, item.businessName, item.businessType].join(' ').toLowerCase().includes(needle)
      const matchesStatus = status === 'all' || item.subscriptionStatus === status
      return matchesText && matchesStatus
    })
  }, [users, query, status])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const counts = useMemo(() => ({
    active: users.filter((item) => item.subscriptionStatus === 'active').length,
    pending: users.filter((item) => item.subscriptionStatus === 'pending').length,
    inactive: users.filter((item) => ['expired', 'cancelled'].includes(item.subscriptionStatus)).length,
  }), [users])

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Directorio de comercios"
        title="Usuarios"
        description={`${users.length} comercios usando NovusPOS. Edita sus datos o activa y desactiva su suscripción.`}
      />

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        {[
          { label: 'Suscripciones activas', value: counts.active, icon: 'verified_user', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
          { label: 'Pago en revisión', value: counts.pending, icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
          { label: 'Sin suscripción al día', value: counts.inactive, icon: 'person_off', tone: 'text-error', bg: 'bg-error-container/60' },
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
      {notice && <AdminAlert tone="success">{notice}</AdminAlert>}

      <AdminCard className="gap-space-sm" icon="search" title="Buscar usuario" description="Filtra por nombre, correo o tipo de comercio">
        <div className="flex flex-col gap-space-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <MS name="search" className="absolute left-3 top-2.5 text-outline text-[19px]" />
            <input
              id="admin-user-search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              placeholder="Buscar por nombre, correo o comercio"
              aria-label="Buscar usuarios"
              className={`${adminInput} pl-10`}
            />
          </div>
          <div className="flex items-center gap-space-xs">
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} aria-label="Filtrar por estado" className={adminInput}>
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="pending">Pendientes</option>
              <option value="expired">Vencidas</option>
              <option value="cancelled">Canceladas</option>
            </select>
            <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant font-mono">{filtered.length} resultados</span>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden" icon="group" title={`${visible.length} ${visible.length === 1 ? 'usuario en la página' : 'usuarios en la página'}`}>
        {isLoading && users.length === 0 ? (
          <AdminState label="Cargando usuarios…" loading />
        ) : visible.length === 0 ? (
          <AdminState label="No hay usuarios con estos filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead>
                <tr className="bg-surface-container-low/70">
                  <th className={`${adminTh} rounded-l-xl`}>Comercio</th>
                  <th className={adminTh}>Correo</th>
                  <th className={adminTh}>Plan</th>
                  <th className={adminTh}>Estado</th>
                  <th className={adminTh}>Último pago</th>
                  <th className={`${adminTh} rounded-r-xl text-right`}>Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm">
                {visible.map((item) => (
                  <tr key={item.id} className="transition hover:bg-surface-container-low/60">
                    <td className={adminTd}>
                      <div className="flex items-center gap-space-sm">
                        <AdminAvatar name={item.businessName} tone="secondary" />
                        <div className="min-w-0">
                          <span className="block font-label-md text-label-md font-semibold text-on-surface">{item.businessName}</span>
                          <span className="block font-label-sm text-label-sm text-on-surface-variant">{item.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`${adminTd} text-on-surface-variant`}>{item.email}</td>
                    <td className={adminTd}><AdminBadge tone="info">{item.planName}</AdminBadge></td>
                    <td className={adminTd}><AdminBadge tone={subscriptionTone(item.subscriptionStatus)}>{statusLabels[item.subscriptionStatus]}</AdminBadge></td>
                    <td className={`${adminTd} font-mono text-on-surface-variant`}>{item.lastPaymentAt ? formatAdminDate(item.lastPaymentAt) : '—'}</td>
                    <td className={`${adminTd} text-right`}>
                      <button type="button" onClick={() => setSelected(item)} className={adminSecondaryButton}>
                        <MS name="manage_accounts" className="text-[16px]" /> Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-space-md py-space-sm shadow-sm">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Página {current} de {pages}</span>
        <div className="flex gap-space-xs">
          <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} className={adminSecondaryButton}>
            <MS name="chevron_left" className="text-[18px]" /> Anterior
          </button>
          <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} className={adminSecondaryButton}>
            Siguiente <MS name="chevron_right" className="text-[18px]" />
          </button>
        </div>
      </div>

      {selected && (
        <UserEditModal
          user={selected}
          busy={busyId === selected.id}
          onClose={() => setSelected(null)}
          onSave={async (patch: UserPatch) => {
            await update(selected.id, patch)
            setSelected(null)
            setNotice('Datos del usuario actualizados.')
          }}
          onSubscription={async (planId, active) => {
            await setSubscription(selected.id, planId, active)
            setNotice(active ? 'Suscripción activada.' : 'Suscripción desactivada.')
          }}
        />
      )}
    </div>
  )
}
