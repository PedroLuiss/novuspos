import { accessProfiles } from '@/features/auth/data/auth-data'
import { MS } from '@/shared/ui/MS'
import { PasswordField, SelectField, TextField } from './AuthFields'

/** Formulario de inicio de sesión (réplica de Stitch). */
export function LoginForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form
      className="space-y-space-md"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <TextField
        id="logEmail"
        label="Correo Electrónico Registrado"
        icon="mail"
        type="email"
        placeholder="admin@tunegocio.com"
        tall
      />
      <PasswordField
        id="logPassword"
        label="Contraseña"
        placeholder="••••••••••••"
        tall
        action={
          <a className="font-label-sm text-label-sm text-primary hover:underline" href="/">
            ¿Olvidaste tu contraseña?
          </a>
        }
      />
      <SelectField id="logProfile" label="Perfil de acceso" icon="badge" options={accessProfiles} tall />
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-space-xs cursor-pointer">
          <input defaultChecked type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">Recordar en este equipo de caja</span>
        </label>
      </div>
      <div>
        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg transition-all transform active:scale-[0.99]"
        >
          <MS name="login" />
          <span>Acceder al Panel de Control</span>
        </button>
      </div>
    </form>
  )
}
