import { useState } from 'react'
import { TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { useAdminSettings } from '../hooks/useAdminSettings'
import { normalizeLoginPath } from '../lib/adminSettings'
import { adminPrimaryButton } from '../lib/adminStyles'
import type { AdminSettings } from '../types'
import { SettingsSkeleton } from './ui/AdminModuleSkeletons'
import { AdminAlert, AdminCard, AdminPageHeader } from './ui/AdminUi'
import { PaymentMethodsSection } from './PaymentMethodsSection'

/** Datos de la empresa y ruta secreta del login maestro. */
export function SettingsPage() {
  const { settings, isLoading, isSaving, saved, error, save } = useAdminSettings()
  const [form, setForm] = useState<AdminSettings>(settings)
  const [pathError, setPathError] = useState<string | null>(null)

  const patch = (key: keyof AdminSettings, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const normalizedPath = normalizeLoginPath(form.loginPath) ?? settings.loginPath

  if (isLoading) return <SettingsSkeleton />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Configuración"
        title="Ajustes del dueño"
        description="Datos de la empresa, enlace privado de acceso y cuentas para cobrar la suscripción."
      />

      {error && <AdminAlert>{error}</AdminAlert>}
      {saved && <AdminAlert tone="success">Ajustes guardados. El nuevo enlace ya está activo.</AdminAlert>}

      <form
        className="grid grid-cols-1 items-start gap-space-md lg:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault()
          const path = normalizeLoginPath(form.loginPath)
          if (!path) {
            setPathError('Usa una ruta como /acceso-maestro. No puede ser /, /auth, /panel ni /administracion.')
            return
          }
          setPathError(null)
          await save({ ...form, loginPath: path })
        }}
      >
        <AdminCard icon="business" title="Datos de la empresa" description="Información que identifica a NovusPOS">
          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            <TextField id="admin-company" label="Nombre de la empresa" icon="business" value={form.companyName} onChange={(value) => patch('companyName', value)} required />
            <TextField id="admin-contact" label="Correo de contacto" icon="mail" type="email" value={form.contactEmail} onChange={(value) => patch('contactEmail', value)} required />
            <TextField id="admin-phone" label="Teléfono" icon="call" value={form.phone} onChange={(value) => patch('phone', value)} />
            <TextField id="admin-address" label="Dirección" icon="location_on" value={form.address} onChange={(value) => patch('address', value)} />
          </div>
        </AdminCard>

        <AdminCard icon="key" title="Seguridad de acceso" description="Solo tú conoces este enlace de entrada">
          <div className="flex flex-col gap-space-sm">
            <TextField
              id="admin-login-path"
              label="Enlace de acceso maestro"
              icon="link"
              value={form.loginPath}
              onChange={(value) => patch('loginPath', value)}
              error={pathError ?? undefined}
              helper="Solo tú conoces este enlace. Ejemplo: /acceso-maestro"
              required
            />
            <div className="rounded-xl border border-primary/20 bg-primary-fixed/30 p-space-sm">
              <div className="flex items-center gap-space-xs text-on-primary-fixed">
                <MS name="shield" className="text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Enlace de acceso</span>
              </div>
              <a href={normalizedPath} className="mt-1 block break-all font-label-md text-label-md font-mono font-semibold text-primary hover:underline">
                {window.location.origin}{normalizedPath}
              </a>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Al guardar, el acceso anterior deja de responder y el panel te llevará al nuevo enlace.
              </p>
            </div>
            <button type="submit" disabled={isSaving} className={`${adminPrimaryButton} self-start`}>
              <MS name="save" className="text-[18px]" /> {isSaving ? 'Guardando…' : 'Guardar ajustes'}
            </button>
          </div>
        </AdminCard>
      </form>

      <PaymentMethodsSection />
    </div>
  )
}
