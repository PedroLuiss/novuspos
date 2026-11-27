import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { TextField } from '@/shared/ui/FormFields'
import { adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import type { AdminCreateUserPayload } from '../types'
import { AdminModal } from '@/features/admin/core/ui/AdminUi'

interface Props {
  busy: boolean
  onClose: () => void
  onCreate: (payload: AdminCreateUserPayload) => void
}

const INITIAL: AdminCreateUserPayload = {
  name: '',
  email: '',
  password: '',
  businessName: '',
  businessType: '',
}

export function UserCreateModal({ busy, onClose, onCreate }: Props) {
  const [form, setForm] = useState<AdminCreateUserPayload>(INITIAL)
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (form.password.length < 8 || form.password.length > 20) {
      setLocalError('La contraseña debe tener entre 8 y 20 caracteres.')
      return
    }
    if (form.password !== confirm) {
      setLocalError('Las contraseñas no coinciden.')
      return
    }
    onCreate(form)
  }

  return (
    <AdminModal
      title="Nuevo usuario"
      subtitle="Crea un usuario cliente para gestionar su suscripción y pagos desde el panel."
      onClose={() => { if (!busy) onClose() }}
      footer={
        <>
          <button type="button" onClick={onClose} className={adminSecondaryButton}>Cancelar</button>
          <button type="submit" form="admin-user-create-form" disabled={busy} className={adminPrimaryButton}>
            <MS name="person_add" className="text-[18px]" /> {busy ? 'Creando…' : 'Crear usuario'}
          </button>
        </>
      }
    >
      <form id="admin-user-create-form" className="flex flex-col gap-space-sm" onSubmit={submit}>
        {localError && <p className="font-body-sm text-body-sm text-error">{localError}</p>}
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          <TextField id="admin-new-user-name" label="Nombre y apellido" icon="person" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
          <TextField id="admin-new-user-email" label="Correo" icon="mail" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
          <TextField id="admin-new-user-business" label="Nombre del comercio" icon="storefront" value={form.businessName} onChange={(businessName) => setForm({ ...form, businessName })} required />
          <TextField id="admin-new-user-type" label="Tipo de comercio" icon="category" value={form.businessType ?? ''} onChange={(businessType) => setForm({ ...form, businessType })} />
          <TextField id="admin-new-user-password" label="Contraseña" icon="lock" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} required />
          <TextField id="admin-new-user-confirm" label="Confirmar contraseña" icon="lock" type="password" value={confirm} onChange={setConfirm} required />
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Contraseña de 8 a 20 caracteres. Puedes incluir caracteres especiales.</p>
      </form>
    </AdminModal>
  )
}
