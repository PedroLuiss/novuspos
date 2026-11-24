import { useEffect, useState } from 'react'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { MS } from '@/shared/ui/MS'
import { useBackups } from '../hooks/useBackups'
import type { BackupRecord, RegisterBackupRequest } from '../types'
import { BackupStats } from './BackupStats'
import { BackupTable } from './BackupTable'
import { RegisterBackupModal } from './RegisterBackupModal'

/** Contenedor del módulo: coordina el registro, el historial y las acciones. */
export function BackupOverview() {
  const { backups, isLoading, error, busyId, refresh, register, verify, remove, download } = useBackups()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [toDelete, setToDelete] = useState<BackupRecord | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const handleRegister = async (request: RegisterBackupRequest) => {
    await register(request)
    setNotice('Copia registrada correctamente.')
  }

  const handleDelete = async () => {
    if (!toDelete) return
    await remove(toDelete.id)
    setToDelete(null)
    setNotice('Registro eliminado.')
  }

  if (isLoading && backups.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm flex items-center justify-center gap-space-xs text-on-surface-variant">
        <MS name="progress_activity" className="animate-spin text-primary text-xl" />
        <span className="font-body-md text-body-md">Cargando tus copias…</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <MS name="cloud_sync" className="text-primary text-[22px]" />
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Copias de Seguridad</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Las copias que crea NovusPOS en tu equipo, registradas en un solo lugar.
              {isLoading && <span className="text-primary"> Actualizando…</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={() => void refresh()}
            className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center gap-1.5"
          >
            <MS name="sync" className="text-[18px]" /> Actualizar
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <MS name="add" className="text-[18px]" /> Registrar copia
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-space-sm rounded-lg bg-secondary-container text-on-secondary-container font-body-sm text-body-sm flex items-center gap-space-xs" role="status">
          <MS name="check_circle" className="text-[18px]" /> {notice}
        </div>
      )}
      {error && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {error}
        </div>
      )}

      <BackupStats backups={backups} />

      <div className="flex items-start gap-space-xs rounded-lg bg-surface-container p-space-sm">
        <MS name="info" className="text-primary text-[18px] shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          NovusPOS guarda tus copias en la computadora. Regístralas aquí para consultar su estado y descargarlas cuando las necesites.
        </p>
      </div>

      <BackupTable
        backups={backups}
        busyId={busyId}
        onVerify={(id) => void verify(id)}
        onDownload={(record) => void download(record)}
        onDelete={setToDelete}
      />

      {isRegisterOpen && (
        <RegisterBackupModal onClose={() => setIsRegisterOpen(false)} onRegister={handleRegister} />
      )}
      {toDelete && (
        <ConfirmDialog
          title="Eliminar registro"
          message="La copia seguirá en tu equipo. Solo se quitará del registro del portal."
          confirmLabel="Eliminar registro"
          busy={busyId === toDelete.id}
          onConfirm={() => void handleDelete()}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
