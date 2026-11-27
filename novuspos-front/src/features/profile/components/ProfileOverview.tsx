import { useEffect, useState } from 'react'
import { businessSectors } from '@/features/auth/data/auth-data'
import { MS } from '@/shared/ui/MS'
import { SelectField, TextField } from '@/shared/ui/FormFields'
import { useProfile } from '../hooks/useProfile'

export function ProfileOverview() {
  const { user, isSaving, isSendingVerification, fieldErrors, formError, successMessage, verificationMessage, saveProfile, sendVerification } = useProfile()

  const [name, setName] = useState(user?.name ?? '')
  const [organizationName, setOrganizationName] = useState(user?.organizationName ?? '')
  const [businessSector, setBusinessSector] = useState(user?.businessSector ?? '')

  useEffect(() => {
    setName(user?.name ?? '')
    setOrganizationName(user?.organizationName ?? '')
    setBusinessSector(user?.businessSector ?? '')
  }, [user?.name, user?.organizationName, user?.businessSector])

  const isVerified = Boolean(user?.emailVerifiedAt)

  return (
    <section className="max-w-4xl">
      <header className="mb-space-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Mi Perfil</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
          Actualiza los datos de tu cuenta. El correo no se puede cambiar, pero puedes verificarlo aquí.
        </p>
      </header>

      <div className="grid gap-space-lg">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg">
          <div className="flex items-start justify-between gap-space-md mb-space-md">
            <div>
              <h2 className="font-title-md text-title-md text-on-surface">Correo electrónico</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{user?.email}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm ${
                isVerified
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              <MS name={isVerified ? 'verified' : 'mail'} className="text-[16px]" />
              {isVerified ? 'Verificado' : 'Sin verificar'}
            </span>
          </div>

          {!isVerified && (
            <div className="bg-surface-container-low rounded-lg p-space-md border border-outline-variant/20">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                Verifica tu correo para activar tu cuenta. Puedes usar el periodo de prueba de 30 días sin verificación,
                pero después de ese periodo deberás verificar tu correo para comprar una suscripción.
              </p>
              <button
                type="button"
                onClick={sendVerification}
                disabled={isSendingVerification}
                className="inline-flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                <MS name="forward_to_inbox" className="text-[18px]" />
                {isSendingVerification ? 'Enviando...' : 'Enviar correo de verificación'}
              </button>
              {verificationMessage && (
                <p className="mt-space-sm font-body-sm text-body-sm text-secondary" role="status">{verificationMessage}</p>
              )}
            </div>
          )}

          {isVerified && user?.emailVerifiedAt && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Verificado el {new Date(user.emailVerifiedAt).toLocaleString()}
            </p>
          )}
        </div>

        <form
          className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg"
          onSubmit={(e) => {
            e.preventDefault()
            saveProfile({
              name,
              organization_name: organizationName,
              business_sector: businessSector || null,
            })
          }}
        >
          <h2 className="font-title-md text-title-md text-on-surface mb-space-md">Datos del perfil</h2>

          {formError && (
            <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
              {formError}
            </div>
          )}
          {successMessage && (
            <div className="mb-space-md p-space-sm rounded-lg bg-secondary-container text-on-secondary-container font-body-sm text-body-sm" role="status">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <TextField
              id="profileName"
              label="Nombre y Apellido"
              icon="person"
              value={name}
              onChange={setName}
              error={fieldErrors.name?.[0]}
              disabled={isSaving}
              required
            />
            <TextField
              id="profileBusiness"
              label="Nombre de tu Negocio / Tienda"
              icon="storefront"
              value={organizationName}
              onChange={setOrganizationName}
              error={fieldErrors.organization_name?.[0]}
              disabled={isSaving}
              required
            />
            <SelectField
              id="profileSector"
              label="Tipo de Comercio"
              icon="category"
              value={businessSector}
              onChange={setBusinessSector}
              error={fieldErrors.business_sector?.[0]}
              disabled={isSaving}
              options={[{ value: '', label: 'Selecciona el tipo de comercio' }, ...businessSectors]}
            />
            <TextField
              id="profileEmail"
              label="Correo Electrónico"
              icon="mail"
              type="email"
              value={user?.email ?? ''}
              onChange={() => {}}
              disabled
            />
          </div>

          <div className="mt-space-lg flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-space-xs h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              <MS name="save" className="text-[18px]" />
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
