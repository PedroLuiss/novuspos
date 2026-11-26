import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { TextField } from '@/shared/ui/FormFields'
import { adminInput, adminPrimaryButton, adminSecondaryButton } from '../lib/adminStyles'
import type { AdminUser, UserPatch } from '../types'
import { AdminAvatar, AdminBadge, AdminModal } from './ui/AdminUi'
import { statusLabels, subscriptionTone } from '../lib/adminFormatters'

interface Props {
  user: AdminUser
  busy: boolean
  onClose: () => void
  onSave: (patch: UserPatch) => void
  onSubscription: (planId: string, active: boolean) => void
}

/** Edición de datos y gestión de la suscripción de un usuario. */
export function UserEditModal({ user, busy, onClose, onSave, onSubscription }: Props) {
  const [patch, setPatch] = useState<UserPatch>({
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    businessType: user.businessType,
  })
  const [planId, setPlanId] = useState(user.planId)

  return (
    <AdminModal
      title="Editar usuario"
      subtitle={user.email}
      onClose={() => { if (!busy) onClose() }}
      footer={
        <>
          <button type="button" onClick={onClose} className={adminSecondaryButton}>Cancelar</button>
          <button type="submit" form="admin-user-form" disabled={busy} className={adminPrimaryButton}>
            <MS name="save" className="text-[18px]" /> Guardar cambios
          </button>
        </>
      }
    >
      <div className="flex items-center gap-space-sm rounded-xl bg-surface-container p-space-sm">
        <AdminAvatar name={user.businessName} tone="secondary" />
        <div className="min-w-0 flex-1">
          <span className="block truncate font-label-md text-label-md font-semibold text-on-surface">{user.businessName}</span>
          <span className="block font-body-sm text-body-sm text-on-surface-variant">{user.businessType}</span>
        </div>
        <AdminBadge tone={subscriptionTone(user.subscriptionStatus)}>{statusLabels[user.subscriptionStatus]}</AdminBadge>
      </div>

      <form id="admin-user-form" className="flex flex-col gap-space-sm" onSubmit={(event) => {
        event.preventDefault()
        onSave(patch)
      }}>
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          <TextField id="admin-user-name" label="Nombre y apellido" icon="person" value={patch.name} onChange={(name) => setPatch({ ...patch, name })} required />
          <TextField id="admin-user-email" label="Correo" icon="mail" type="email" value={patch.email} onChange={(email) => setPatch({ ...patch, email })} required />
          <TextField id="admin-user-business" label="Nombre del comercio" icon="storefront" value={patch.businessName} onChange={(businessName) => setPatch({ ...patch, businessName })} />
          <TextField id="admin-user-type" label="Tipo de comercio" icon="category" value={patch.businessType} onChange={(businessType) => setPatch({ ...patch, businessType })} />
        </div>

        <div className="flex flex-col gap-space-sm rounded-xl border border-outline-variant/50 p-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Suscripción</span>
          <select value={planId} onChange={(event) => setPlanId(event.target.value)} aria-label="Plan del usuario" className={adminInput}>
            <option value="novus-mensual">NovusPOS Mensual</option>
            <option value="novus-anual">NovusPOS Anual</option>
          </select>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Cambiar el plan o el estado afecta al acceso del usuario en su próximo ingreso.
          </p>
          <div className="flex flex-wrap gap-space-xs">
            <button type="button" disabled={busy} onClick={() => onSubscription(planId, true)} className={adminPrimaryButton}>
              <MS name="check_circle" className="text-[18px]" /> Activar suscripción
            </button>
            <button type="button" disabled={busy} onClick={() => onSubscription(planId, false)} className={adminSecondaryButton}>
              <MS name="block" className="text-[18px]" /> Desactivar suscripción
            </button>
          </div>
        </div>
      </form>
    </AdminModal>
  )
}
