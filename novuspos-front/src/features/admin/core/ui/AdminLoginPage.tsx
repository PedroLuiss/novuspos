import { useState } from 'react'
import { IS_DEMO_AUTH } from '@/shared/lib/env'
import { PasswordField, TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { adminPrimaryButton } from '@/features/admin/core/lib/adminStyles'
import { useAdminSession } from '../hooks/useAdminSession'

const benefits = [
  { icon: 'admin_panel_settings', text: 'Acceso exclusivo para el dueño de NovusPOS' },
  { icon: 'key', text: 'Enlace de entrada configurable desde los ajustes' },
  { icon: 'shield', text: 'Sesión separada de la de tus usuarios' },
]

/** Acceso privado del dueño, separado del login de clientes. */
export function AdminLoginPage() {
  const { isSubmitting, error, login } = useAdminSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen w-full bg-surface font-body-md text-on-surface antialiased flex items-center justify-center p-space-md">
      <main className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_30px_80px_-40px_rgba(10,23,52,0.7)] lg:grid-cols-12">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-admin-ink via-admin-ink-soft to-primary p-space-lg text-white lg:col-span-5 lg:flex">
          <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="relative flex items-center gap-space-sm">
            <img src="/novuspos-logo-white.png" alt="NovusPOS" className="h-9 w-auto object-contain" />
            <span className="h-6 w-px bg-white/25" />
            <span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-white/70 font-mono">Centro de control</span>
          </div>

          <div className="relative flex flex-col gap-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-[#9fc5ff] font-mono">Panel maestro</span>
            <h1 className="font-headline-lg text-headline-lg font-bold leading-tight">Tu negocio bajo control, desde un solo lugar</h1>
            <p className="font-body-md text-body-md text-white/75">
              Gestiona usuarios, revisa pagos y mantén informados a tus comercios con avisos y correos.
            </p>
            <div className="flex flex-col gap-space-xs">
              {benefits.map((item) => (
                <div key={item.text} className="flex items-center gap-space-xs font-body-sm text-body-sm text-white/85">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                    <MS name={item.icon} className="text-[16px]" />
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-space-xs rounded-xl border border-white/15 bg-white/5 px-space-sm py-space-xs">
            <MS name="lock" className="text-[18px] text-[#6cf8bb]" />
            <span className="font-body-sm text-body-sm text-white/75">Esta sesión no comparte datos con el portal de clientes.</span>
          </div>
        </section>

        <section className="flex flex-col gap-space-md p-space-lg lg:col-span-7 lg:p-space-xl">
          <div className="flex items-start gap-space-sm">
            <div className="w-11 h-11 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
              <MS name="admin_panel_settings" className="text-[24px]" />
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Acceso del dueño</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Panel de administración de NovusPOS.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-space-xs rounded-xl bg-error-container px-space-sm py-space-xs font-body-sm text-body-sm text-on-error-container" role="alert">
              <MS name="error" className="text-[18px]" /> {error}
            </div>
          )}

          <form
            className="flex flex-col gap-space-md"
            onSubmit={(event) => {
              event.preventDefault()
              void login(email, password)
            }}
          >
            <TextField
              id="admin-email"
              label="Correo del dueño"
              icon="mail"
              type="email"
              autoComplete="username"
              placeholder="dueno@novuspos.com"
              value={email}
              onChange={setEmail}
              required
            />
            <PasswordField
              id="admin-password"
              label="Contraseña maestra"
              placeholder="Tu contraseña de acceso"
              value={password}
              onChange={setPassword}
              required
            />
            {IS_DEMO_AUTH && (
              <p className="font-label-sm text-label-sm text-outline">
                Modo demostración: usa cualquier correo con @ y contraseña de 4 caracteres o más.
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className={`${adminPrimaryButton} h-12 w-full`}>
              <MS name="login" className="text-[18px]" /> {isSubmitting ? 'Verificando…' : 'Entrar al panel maestro'}
            </button>
          </form>

          <div className="flex items-center justify-between border-t border-outline-variant/50 pt-space-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant">¿Necesitas el portal de clientes?</span>
            <a href="/auth/login" className="font-label-md text-label-md font-semibold text-primary hover:underline">Ir al acceso de usuarios →</a>
          </div>
          <a href="/" className="self-center font-body-sm text-body-sm text-on-surface-variant hover:text-primary">Volver al sitio principal</a>
        </section>
      </main>
    </div>
  )
}
