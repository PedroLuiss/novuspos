import { useEffect } from 'react'
import { SelectField, TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { kindOptions } from '../data/backup-data'
import { useBackupRegistration } from '../hooks/useBackupRegistration'
import type { BackupKind, RegisterBackupRequest } from '../types'
import { BackupFileField } from './BackupFileField'

interface Props {
  onClose: () => void
  onRegister: (request: RegisterBackupRequest) => Promise<void>
}

/** Alta de una copia creada por la aplicación de escritorio. */
export function RegisterBackupModal({ onClose, onRegister }: Props) {
  const { form, errors, formError, isSubmitting, update, submit } = useBackupRegistration(onRegister)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isSubmitting, onClose])

  const handleSubmit = () => {
    void submit().then((ok) => {
      if (ok) onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-on-surface/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-space-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="register-backup-title" className="w-full max-w-xl max-h-[94vh] overflow-y-auto rounded-t-2xl sm:rounded-xl bg-surface-container-lowest shadow-2xl flex flex-col">
        <header className="p-space-lg pb-space-sm flex items-start justify-between gap-space-sm">
          <div>
            <h2 id="register-backup-title" className="font-headline-sm text-headline-sm text-on-surface font-bold">Registrar copia</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Agrega al registro una copia creada desde la aplicación de escritorio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0"
          >
            <MS name="close" className="text-lg" />
          </button>
        </header>

        <div className="px-space-lg pb-space-md flex flex-col gap-space-md">
          {formError && (
            <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
              {formError}
            </div>
          )}
          <TextField
            id="backup-device"
            label="Equipo"
            icon="devices"
            placeholder="Ej. Caja Principal"
            tall
            required
            value={form.device}
            onChange={(device) => update({ device })}
            error={errors.device}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <SelectField
              id="backup-kind"
              label="Tipo de copia"
              icon="category"
              options={kindOptions}
              tall
              value={form.kind ?? ''}
              onChange={(kind) => update({ kind: kind as BackupKind })}
              error={errors.kind}
            />
            <TextField
              id="backup-created-at"
              label="Fecha y hora"
              icon="schedule"
              type="datetime-local"
              tall
              required
              value={form.createdAt}
              onChange={(createdAt) => update({ createdAt })}
              error={errors.createdAt}
            />
          </div>
          <BackupFileField file={form.file} error={errors.file} onSelect={(file) => update({ file })} onClear={() => update({ file: null })} />
          <TextField
            id="backup-note"
            label="Nota (opcional)"
            icon="sticky_note_2"
            placeholder="Ej. Copia antes de actualizar"
            tall
            value={form.note}
            onChange={(note) => update({ note })}
            error={errors.note}
          />
          <div className="flex items-start gap-space-xs rounded-lg bg-primary-fixed/40 p-space-sm">
            <MS name="info" className="text-primary text-[18px] shrink-0 mt-0.5" />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              La copia quedará en espera. Puedes verificarla y descargarla desde el registro cuando quieras.
            </p>
          </div>
        </div>

        <footer className="sticky bottom-0 px-space-lg py-space-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-end gap-space-xs rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-space-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md font-semibold disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 disabled:opacity-60"
          >
            {isSubmitting ? 'Registrando…' : 'Registrar copia'}
            {!isSubmitting && <MS name="save" className="text-[17px]" />}
          </button>
        </footer>
      </div>
    </div>
  )
}
