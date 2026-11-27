import { useEffect, useMemo, useState } from 'react'
import { AdminAlert, AdminCard, AdminPageHeader } from '@/features/admin/core/ui/AdminUi'
import { useAdminProfile } from '../hooks/useAdminProfile'
import { ProfileSkeleton } from './ProfileSkeleton'

type PasswordStrength = {
  score: number
  label: string
  barClass: string
  textClass: string
}

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: 'Ingresa una contraseña', barClass: 'bg-outline-variant/40', textClass: 'text-on-surface-variant' }

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (password.length < 8) return { score: 1, label: 'Muy débil', barClass: 'bg-error', textClass: 'text-error' }
  if (score <= 2) return { score: 2, label: 'Débil', barClass: 'bg-orange-500', textClass: 'text-orange-600' }
  if (score === 3) return { score: 3, label: 'Aceptable', barClass: 'bg-amber-500', textClass: 'text-amber-700' }
  if (score === 4) return { score: 4, label: 'Fuerte', barClass: 'bg-primary', textClass: 'text-primary' }
  return { score: 5, label: 'Muy fuerte', barClass: 'bg-secondary', textClass: 'text-secondary' }
}

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
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const strength = useMemo(() => getPasswordStrength(password), [password])

  useEffect(() => {
    setName(profile.name)
    setEmail(profile.email)
  }, [profile.name, profile.email])

  useEffect(() => {
    if (!passwordSuccess) return
    setPassword('')
    setPasswordConfirmation('')
  }, [passwordSuccess])

  if (loading) return <ProfileSkeleton />

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

      <AdminCard title="Cambiar contraseña" description="Usa entre 8 y 20 caracteres. Puedes incluir mayúsculas, números y caracteres especiales." icon="lock_reset">
        {passwordSuccess && <AdminAlert tone="success">{passwordSuccess}</AdminAlert>}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-space-md"
          onSubmit={(e) => {
            e.preventDefault()
            void changePassword({ password, passwordConfirmation })
          }}
        >
          <Field label="Nueva contraseña" error={fieldErrors.password?.[0]}>
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={20}
              autoComplete="new-password"
            />
            <div className="mt-1 flex flex-col gap-1.5" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${level <= strength.score ? strength.barClass : 'bg-outline-variant/30'}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between gap-space-sm">
                <span className={`font-label-sm text-label-sm font-medium ${strength.textClass}`}>
                  Seguridad: {strength.label}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{password.length}/20</span>
              </div>
            </div>
          </Field>
          <Field label="Confirmar contraseña" error={fieldErrors.passwordConfirmation?.[0]}>
            <input
              className={inputClass}
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={8}
              maxLength={20}
              autoComplete="new-password"
            />
            {passwordConfirmation && password === passwordConfirmation && (
              <span className="font-body-sm text-body-sm text-secondary">Las contraseñas coinciden.</span>
            )}
          </Field>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={isChangingPassword} className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-60">
              {isChangingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  )
}
