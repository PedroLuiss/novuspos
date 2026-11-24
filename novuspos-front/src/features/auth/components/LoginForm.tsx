import { useState } from 'react'
import type { LoginCredentials } from '@/features/auth/types'
import { IS_DEMO_AUTH } from '@/shared/lib/env'
import type { ValidationIssues } from '@/shared/services/apiClient'
import { MS } from '@/shared/ui/MS'
import { PasswordField, TextField } from './AuthFields'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
  fieldErrors?: ValidationIssues
  formError?: string | null
  isSubmitting?: boolean
}

/** Formulario de inicio de sesión (réplica de Stitch, conectado a la API). */
export function LoginForm({ onSubmit, fieldErrors = {}, formError, isSubmitting = false }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      className="space-y-space-md"
      onSubmit={(event) => {
        event.preventDefault()
        if (!isSubmitting) onSubmit({ email, password })
      }}
    >
      {formError && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {formError}
        </div>
      )}

      {IS_DEMO_AUTH && (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Modo demostración: entra con cualquier correo y contraseña de 4 caracteres o más.
        </p>
      )}

      <TextField
        id="logEmail"
        label="Correo Electrónico Registrado"
        icon="mail"
        type="email"
        placeholder="admin@tunegocio.com"
        tall
        required
        disabled={isSubmitting}
        value={email}
        onChange={setEmail}
        error={fieldErrors.email?.[0]}
      />
      <PasswordField
        id="logPassword"
        label="Contraseña"
        placeholder="••••••••••••"
        tall
        required
        disabled={isSubmitting}
        value={password}
        onChange={setPassword}
        error={fieldErrors.password?.[0]}
        action={
          <a className="font-label-sm text-label-sm text-primary hover:underline" href="/">
            ¿Olvidaste tu contraseña?
          </a>
        }
      />
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-space-xs cursor-pointer">
          <input defaultChecked type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">Recordar en este equipo de caja</span>
        </label>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-70"
        >
          <MS name={isSubmitting ? 'progress_activity' : 'login'} className={isSubmitting ? 'animate-spin' : ''} />
          <span>{isSubmitting ? 'Iniciando sesión…' : 'Acceder al Panel de Control'}</span>
        </button>
      </div>
    </form>
  )
}
