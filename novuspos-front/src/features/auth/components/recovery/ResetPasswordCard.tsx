import { useState } from 'react'
import { useResetPassword } from '@/features/auth/hooks/useResetPassword'
import { analyzePassword } from '@/features/auth/lib/passwordStrength'
import { MS } from '@/shared/ui/MS'
import { PasswordRequirements } from './PasswordRequirements'

interface ResetPasswordCardProps {
  token: string | null
  email: string | null
}

/** Tarjeta de "Nueva contraseña" — layout class-por-class de Stitch, copy auditado. */
export function ResetPasswordCard({ token, email }: ResetPasswordCardProps) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { submit, isSubmitting, fieldErrors, formError } = useResetPassword(token, email)

  const strength = analyzePassword(password)
  const matches = confirmation.length > 0 && password === confirmation

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-space-lg md:p-space-xl flex flex-col">
      {/* Marca y sello de seguridad */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-space-sm mb-space-md">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-display font-bold text-headline-sm shadow-md">
            N
          </div>
          <div className="flex items-baseline">
            <span className="font-display font-bold text-headline-sm text-on-surface tracking-tight">Novus</span>
            <span className="font-display font-bold text-headline-sm text-primary-container tracking-tight">POS</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center shadow-sm mb-space-sm">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <MS name="lock_reset" className="text-[22px]" />
          </div>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-space-xs">
          Crear nueva contraseña
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-sm">
          Listo, pudimos verificar tu correo:{' '}
          <span className="font-label-md text-on-surface font-semibold">{email ?? 'tu correo'}</span>. Elige una nueva
          contraseña para entrar.
        </p>
      </div>

      <form
        className="flex flex-col mt-space-lg gap-space-md"
        onSubmit={(event) => {
          event.preventDefault()
          if (!isSubmitting && token && matches) submit(password)
        }}
      >
        {!token && (
          <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
            Este enlace ya no es válido.{' '}
            <a className="font-semibold underline" href="/auth/recuperar">
              Solicita uno nuevo.
            </a>
          </div>
        )}
        {formError && (
          <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
            {formError}
          </div>
        )}

        {/* Nueva contraseña */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex justify-between items-center">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="newPassword">
              Nueva contraseña
            </label>
            <span className={strength.labelClass} id="strengthText">
              {strength.label}
            </span>
          </div>
          <div className="relative flex items-center">
            <MS name="key" className="absolute left-3 text-outline pointer-events-none text-[20px]" />
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              required
              disabled={isSubmitting || !token}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              className="w-full h-11 pl-10 pr-11 bg-surface-container-lowest text-on-surface font-numeric-keypad text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-container-lowest transition-all"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-2.5 p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors flex items-center justify-center"
            >
              <MS name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
          </div>
          <PasswordRequirements password={password} />
          {fieldErrors.password?.[0] && (
            <span className="font-body-sm text-body-sm text-error" role="alert">
              {fieldErrors.password[0]}
            </span>
          )}
        </div>

        {/* Confirmación */}
        <div className="flex flex-col gap-space-xs mt-1">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">
            Confirmar nueva contraseña
          </label>
          <div className="relative flex items-center">
            <MS name="lock" className="absolute left-3 text-outline pointer-events-none text-[20px]" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmation ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              required
              disabled={isSubmitting || !token}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="w-full h-11 pl-10 pr-11 bg-surface-container-lowest text-on-surface font-numeric-keypad text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-container-lowest transition-all"
            />
            {matches ? (
              <MS name="check_circle" filled className="absolute right-3 text-[20px] text-secondary" />
            ) : (
              <button
                type="button"
                aria-label={showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                onClick={() => setShowConfirmation((current) => !current)}
                className="absolute right-2.5 p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors flex items-center justify-center"
              >
                <MS name={showConfirmation ? 'visibility_off' : 'visibility'} className="text-[20px]" />
              </button>
            )}
          </div>
          {confirmation.length > 0 && !matches && (
            <span className="font-body-sm text-body-sm text-error mt-0.5">Las contraseñas no coinciden</span>
          )}
        </div>

        {/* Acción principal */}
        <button
          className="w-full h-12 mt-space-xs rounded-lg bg-primary-container text-on-primary font-label-md text-body-md font-semibold tracking-wide flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
          type="submit"
          disabled={isSubmitting || !token || !matches}
        >
          <span>{isSubmitting ? 'Actualizando contraseña…' : 'Restablecer y acceder a mi cuenta'}</span>
          <MS name={isSubmitting ? 'progress_activity' : 'arrow_forward'} className={isSubmitting ? 'text-[18px] animate-spin' : 'text-[18px]'} />
        </button>

        {/* Acciones secundarias y aviso */}
        <div className="flex flex-col items-center gap-space-md mt-space-xs">
          <a
            className="flex items-center gap-1.5 font-label-md text-label-md text-primary hover:underline transition-all"
            href="/auth/login"
          >
            <MS name="arrow_back" className="text-[16px]" />
            <span>Cancelar y volver al inicio de sesión</span>
          </a>
          <div className="w-full flex items-center justify-center gap-2 bg-surface-container-low py-2 px-3 rounded-lg text-center">
            <MS name="verified_user" className="text-[16px] text-secondary" />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Tus credenciales se guardan de forma segura.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
