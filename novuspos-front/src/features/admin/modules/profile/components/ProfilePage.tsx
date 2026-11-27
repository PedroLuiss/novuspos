import { useEffect, useState } from 'react'
import { AdminAlert, AdminCard, AdminPageHeader, AdminState } from '@/features/admin/core/ui/AdminUi'
import { useAdminProfile } from '../hooks/useAdminProfile'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-label-md text-label-md text-on-surface font-semibold">{label}</span>
      {children}
      {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
    </label>
  )
}

const inputClass = 'h-11 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-space-sm font-body-md text-body-md text-on-surface outline-none focus:border-primary'

export function ProfilePage() {
  const { profile, loading, isSaving, isChangingPassword, fieldErrors, formError, successMessage, passwordSuccess, saveProfile, changePassword } = useAdminProfile()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  useEffect(() => {
    setName(profile.name)
    setEmail(profile.email)
  }, [profile.name, profile.email])

  if (loading) return <AdminState label="Cargando perfil..." loading />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Cuenta"
        title="Mi Perfil"
        description="Actualiza tus datos personales y cambia tu contraseña de acceso al panel maestro."
      />

      {formError && <AdminAlert tone="error">{formError}</AdminAlert>}
      {successMessage && <AdminAlert tone="success">{successMessage}</AdminAlert>}

      <AdminCard title="Datos personales" description="Esta información identifica tu cuenta de administrador en NovusPOS." icon="badge">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-space-md"
          onSubmit={(e) => {
            e.preventDefault()
            void saveProfile({ name, email })
          }}
        >
          <Field label="Nombre" error={fieldErrors.name?.[0]}>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required maxLength={255} />
          </Field>
          <Field label="Correo electrónico" error={fieldErrors.email?.[0]}>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
          </Field>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={isSaving} className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-60">
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Cambiar contraseña" description="Usa entre 8 y 10 caracteres. Se permiten caracteres especiales." icon="lock_reset">
        {passwordSuccess && <AdminAlert tone="success">{passwordSuccess}</AdminAlert>}
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-space-md"
          onSubmit={(e) => {
            e.preventDefault()
            void changePassword({ currentPassword, password, passwordConfirmation })
          }}
        >
          <Field label="Contraseña actual" error={fieldErrors.currentPassword?.[0]}>
            <input className={inputClass} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required minLength={8} maxLength={10} />
          </Field>
          <Field label="Nueva contraseña" error={fieldErrors.password?.[0]}>
            <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={10} />
          </Field>
          <Field label="Confirmar contraseña" error={fieldErrors.passwordConfirmation?.[0]}>
            <input className={inputClass} type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} maxLength={10} />
          </Field>
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" disabled={isChangingPassword} className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-60">
              {isChangingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  )
}
