import { useState } from 'react'
import { businessSectors } from '@/features/auth/data/auth-data'
import type { RegisterCredentials } from '@/features/auth/types'
import type { ValidationIssues } from '@/shared/services/apiClient'
import { MS } from '@/shared/ui/MS'
import { PasswordField, SelectField, TextField } from './AuthFields'

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => void
  fieldErrors?: ValidationIssues
  formError?: string | null
  isSubmitting?: boolean
}

/** Formulario de registro conectado a la API. */
export function RegisterForm({ onSubmit, fieldErrors = {}, formError, isSubmitting = false }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [businessSector, setBusinessSector] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      className="space-y-space-sm"
      onSubmit={(event) => {
        event.preventDefault()
        if (isSubmitting) return
        onSubmit({
          name,
          organization_name: organizationName,
          business_sector: businessSector,
          email,
          password,
        })
      }}
    >
      {formError && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
        <TextField
          id="regName"
          label="Nombre y Apellido"
          icon="person"
          placeholder="Ej. Roberto Morales"
          required
          value={name}
          onChange={setName}
          error={fieldErrors.name?.[0]}
          disabled={isSubmitting}
        />
        <TextField
          id="regBusiness"
          label="Nombre de tu Negocio / Tienda"
          icon="storefront"
          placeholder="Ej. Abarrotes San Juan"
          required
          value={organizationName}
          onChange={setOrganizationName}
          error={fieldErrors.organization_name?.[0] ?? fieldErrors.business?.[0]}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
        <SelectField
          id="regSector"
          label="Tipo de Comercio"
          icon="category"
          required
          options={[{ value: '', label: 'Selecciona el tipo de comercio' }, ...businessSectors]}
          value={businessSector}
          onChange={setBusinessSector}
          error={fieldErrors.business_sector?.[0] ?? fieldErrors.sector?.[0]}
          disabled={isSubmitting}
        />
        <TextField
          id="regEmail"
          label="Correo Electrónico"
          type="email"
          icon="mail"
          placeholder="correo@ejemplo.com"
          required
          value={email}
          onChange={setEmail}
          error={fieldErrors.email?.[0]}
          disabled={isSubmitting}
        />
      </div>
      <PasswordField
        id="regPassword"
        label="Crear Contraseña"
        placeholder="Mínimo 8 caracteres, números y letras"
        required
        value={password}
        onChange={setPassword}
        error={fieldErrors.password?.[0]}
        disabled={isSubmitting}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex items-center justify-center gap-space-sm w-full h-12 rounded-xl bg-primary font-label-md text-label-md text-on-primary hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:pointer-events-none"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta en NovusPOS'}
        {!isSubmitting && <MS name="arrow_forward" className="text-[20px] group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  )
}
