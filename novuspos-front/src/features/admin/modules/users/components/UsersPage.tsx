import { useEffect, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { formatAdminDate, statusLabels, subscriptionTone } from '@/features/admin/core/lib/adminFormatters'
import { adminCompactButton, adminInput, adminPrimaryButton, adminSecondaryButton, adminTd, adminTh } from '@/features/admin/core/lib/adminStyles'
import type { AdminCreateUserPayload, AdminUser, UserPageSize, UserPatch, UserStatusFilter } from '../types'
import { UsersSkeleton } from './UsersSkeleton'
import { AdminAlert, AdminAvatar, AdminBadge, AdminCard, AdminPageHeader, AdminState } from '@/features/admin/core/ui/AdminUi'
import { UserCreateModal } from './UserCreateModal'
import { UserEditModal } from './UserEditModal'
import { USER_PAGE_SIZES, USER_STATUS_OPTIONS, USER_SUMMARY_CARDS } from '../constants'

/** Directorio paginado de comercios con búsqueda, filtro de estado y gestión de suscripción. */
export function UsersPage() {
  const {
    users,
    total,
    page,
    pageSize,
    totalPages,
    summary,
    query,
    isLoading,
    busyId,
    error,
    setSearch,
    setStatus,
    setPageSize,
    setPage,
    resetFilters,
    create,
    update,
    setSubscription,
  } = useAdminUsers()
  const [searchDraft, setSearchDraft] = useState(query.search)
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [creating, setCreating] = useState(false)
  const [creatingBusy, setCreatingBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

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
  const hasFilters = Boolean(query.search || query.status !== 'all')

  if (isLoading && users.length === 0) return <UsersSkeleton />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Directorio de comercios"
        title="Usuarios"
        description={`${summary.total} comercios usando NovusPOS. Edita sus datos o activa y desactiva su suscripción.`}
        actions={
          <button type="button" onClick={() => setCreating(true)} className={adminPrimaryButton}>
            <MS name="person_add" className="text-[18px]" /> Nuevo usuario
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        {USER_SUMMARY_CARDS.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-space-md py-space-sm shadow-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{item.label}</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{summary[item.key]}</span>
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
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Buscar por nombre, correo o comercio"
              aria-label="Buscar usuarios"
              className={`${adminInput} pl-10`}
            />
          </div>
          <select
            id="admin-user-status"
            value={query.status}
            onChange={(event) => setStatus(event.target.value as UserStatusFilter)}
            aria-label="Filtrar por estado"
            className={adminInput}
          >
            {USER_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </AdminCard>

      <AdminCard
        className="overflow-hidden"
        icon="group"
        title="Directorio de comercios"
        description="Gestiona los datos y la suscripción de cada comercio"
        action={
          <span className="rounded-full bg-surface-container px-space-sm py-1 font-label-sm text-label-sm font-mono text-on-surface-variant">
            {total} {total === 1 ? 'usuario' : 'usuarios'}
          </span>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-space-xs rounded-xl bg-surface-container-low/60 px-space-sm py-space-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando <span className="font-mono font-semibold text-on-surface">{first}–{last}</span> de{' '}
            <span className="font-mono font-semibold text-on-surface">{total}</span> usuarios
          </span>
          <span className="font-label-sm text-label-sm font-mono text-outline">Página {page} de {totalPages}</span>
        </div>

        {users.length === 0 ? (
          <AdminState label="No hay usuarios con estos filtros." />
        ) : (
          <div className={`overflow-x-auto transition ${isLoading ? 'opacity-60' : ''}`}>
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
                {users.map((item) => (
                  <tr key={item.id} data-user-item={item.id} className="transition hover:bg-surface-container-low/60">
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

        <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/50 pt-space-sm">
          <label className="flex items-center gap-space-xs" htmlFor="admin-user-page-size">
            <span className="font-label-sm text-label-sm text-outline">Por página</span>
            <select
              id="admin-user-page-size"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value) as UserPageSize)}
              className={`${adminInput} h-9 w-20`}
            >
              {USER_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
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

      {creating && (
        <UserCreateModal
          busy={creatingBusy}
          onClose={() => { if (!creatingBusy) setCreating(false) }}
          onCreate={async (payload: AdminCreateUserPayload) => {
            setCreatingBusy(true)
            const ok = await create(payload)
            setCreatingBusy(false)
            if (ok) {
              setCreating(false)
              setNotice('Usuario creado correctamente. Ya puedes gestionar su suscripción y pagos.')
            }
          }}
        />
      )}

      {selected && (
        <UserEditModal
          user={selected}
          busy={busyId === selected.id}
          onClose={() => setSelected(null)}
          onSave={async (patch: UserPatch) => {
            const ok = await update(selected.id, patch)
            if (ok) {
              setSelected(null)
              setNotice('Datos del usuario actualizados.')
            }
          }}
          onSubscription={async (planId, active) => {
            const ok = await setSubscription(selected.id, planId, active)
            if (ok) setNotice(active ? 'Suscripción activada.' : 'Suscripción desactivada.')
          }}
        />
      )}
    </div>
  )
}
