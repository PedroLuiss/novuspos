import { businessSectors } from '@/features/auth/data/auth-data'
import { MS } from '@/shared/ui/MS'
import { PasswordField, SelectField, TextField } from './AuthFields'

/** Formulario de registro / activar licencia (réplica de Stitch). */
export function RegisterForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form
      className="space-y-space-sm"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
        <TextField id="regName" label="Nombre y Apellido" icon="person" placeholder="Ej. Roberto Morales" required />
        <TextField
          id="regBusiness"
          label="Nombre de tu Negocio / Tienda"
          icon="storefront"
          placeholder="Ej. Abarrotes San Juan"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
        <SelectField id="regSector" label="Tipo de Comercio" icon="category" options={businessSectors} />
        <TextField
          id="regEmail"
          label="Correo Electrónico"
          icon="mail"
          type="email"
          placeholder="admin@tunegocio.com"
          required
        />
      </div>
      <PasswordField
        id="regPassword"
        label="Contraseña Maestra del Sistema"
        hint="Mínimo 8 caracteres"
        placeholder="Crea una contraseña segura"
        required
      />
      <div className="flex items-start gap-space-xs pt-1">
        <input
          id="termsCheck"
          type="checkbox"
          required
          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
        />
        <label htmlFor="termsCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
          Acepto los{' '}
          <a className="text-primary font-semibold hover:underline" href="#">
            Términos de Servicio
          </a>{' '}
          y la política de privacidad de datos comerciales de NovusPOS.
        </label>
      </div>
      <div className="pt-space-xs">
        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg transition-all transform active:scale-[0.99]"
        >
          <MS name="rocket_launch" />
          <span>Crear Cuenta y Descargar NovusPOS</span>
        </button>
      </div>
    </form>
  )
}
