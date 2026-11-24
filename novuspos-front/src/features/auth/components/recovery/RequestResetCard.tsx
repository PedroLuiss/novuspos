import { useState } from 'react'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'
import { buildRecoveryLink } from '@/features/auth/lib/recoveryLink'
import { DEMO_RESET_TOKEN } from '@/features/auth/services/demoPasswordRecoveryGateway'
import { IS_DEMO_AUTH } from '@/shared/lib/env'
import { MS } from '@/shared/ui/MS'

/** Tarjeta de "Solicitar enlace" — layout class-por-class de Stitch, copy auditado. */
export function RequestResetCard() {
  const [email, setEmail] = useState('')
  const { submit, isSubmitting, isSent, fieldErrors, formError } = useForgotPassword()

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-space-lg sm:p-space-xl relative backdrop-blur-md">
      {/* Icono principal con sello de verificación */}
      <div className="flex justify-center mb-space-md">
        <div className="relative w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
          <MS name="lock_reset" filled className="text-3xl" />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
            <MS name="verified_user" className="text-xs" />
          </span>
        </div>
      </div>

      {/* Títulos */}
      <div className="text-center mb-space-lg">
        <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-space-xs">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          No te preocupes. Ingresa el correo con el que accedes a tu cuenta y te enviaremos un enlace para crear una nueva
          contraseña.
        </p>
      </div>

      {/* Formulario */}
      <form
        className="space-y-space-md"
        onSubmit={(event) => {
          event.preventDefault()
          if (!isSubmitting && !isSent) submit(email.trim())
        }}
      >
        {formError && (
          <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
            {formError}
          </div>
        )}

        <div className="flex flex-col gap-space-xs">
          <label className="font-label-md text-label-md text-on-surface flex justify-between items-center" htmlFor="recovery-email">
            <span>Correo electrónico</span>
            <span className="font-label-sm text-label-sm text-outline">Requerido</span>
          </label>
          <div className="relative flex items-center">
            <MS name="mail" className="absolute left-3.5 text-on-surface-variant pointer-events-none text-xl" />
            <input
              id="recovery-email"
              name="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              required
              disabled={isSubmitting || isSent}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none transition-all duration-200 disabled:opacity-70"
            />
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant px-1">
            Usa el correo con el que inicias sesión en NovusPOS.
          </span>
          {fieldErrors.email?.[0] && (
            <span className="font-body-sm text-body-sm text-error px-1" role="alert">
              {fieldErrors.email[0]}
            </span>
          )}
        </div>

        {/* Aviso de vigencia del enlace */}
        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant">
          <MS name="schedule" filled className="text-primary text-xl flex-shrink-0 mt-0.5" />
          <p className="font-body-sm text-body-sm leading-snug">
            Por tu seguridad, el enlace <strong className="text-on-surface font-semibold">dejará de funcionar en 15 minutos</strong>.
          </p>
        </div>

        {/* Acción principal */}
        <button
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-body-lg font-semibold rounded-lg flex items-center justify-center gap-space-xs transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer disabled:opacity-70"
          type="submit"
          disabled={isSubmitting || isSent}
        >
          <span>{isSubmitting ? 'Enviando enlace…' : 'Enviar enlace de recuperación'}</span>
          <MS
            name={isSubmitting ? 'progress_activity' : 'arrow_forward'}
            className={isSubmitting ? 'text-xl animate-spin' : 'text-xl'}
          />
        </button>
      </form>

      {/* Confirmación visible tras el envío */}
      {isSent && (
        <div className="mt-space-md p-space-md rounded-lg bg-secondary-container text-on-secondary-container" role="status">
          <div className="flex items-start gap-space-sm">
            <MS name="check_circle" filled className="text-secondary text-2xl flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="font-label-md text-label-md font-bold text-on-secondary-fixed">¡Enlace enviado!</span>
              <span className="font-body-sm text-body-sm">
                Revisa tu correo (también la carpeta de spam) y sigue las instrucciones para crear tu nueva contraseña.
              </span>
              {IS_DEMO_AUTH && (
                <a
                  className="font-label-md text-label-md font-semibold text-on-secondary-fixed underline mt-space-xs self-start"
                  href={buildRecoveryLink(DEMO_RESET_TOKEN, email)}
                >
                  Abrir enlace de demostración →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navegación y asistencia */}
      <div className="mt-space-lg pt-space-md flex flex-col items-center gap-space-md">
        <a
          className="inline-flex items-center gap-space-xs text-primary hover:text-primary-container font-label-md text-label-md transition-colors duration-150 group"
          href="/auth/login"
        >
          <MS name="arrow_back" className="text-lg group-hover:-translate-x-1 transition-transform duration-150" />
          <span>Volver al inicio de sesión</span>
        </a>
        <div className="w-full flex items-center gap-space-sm">
          <span className="h-px bg-surface-container-high flex-1" />
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Asistencia</span>
          <span className="h-px bg-surface-container-high flex-1" />
        </div>
        <p className="font-body-sm text-body-sm text-center text-on-surface-variant">
          ¿No recuerdas tu correo?
          <br />
          <a className="text-primary hover:underline font-semibold" href="/">
            Contacta a soporte técnico de NovusPOS
          </a>
        </p>
      </div>
    </div>
  )
}
