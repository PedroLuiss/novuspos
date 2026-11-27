import { useEffect, useRef, useState } from 'react'
import type { LandingDownload } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'
import { adminCompactButton } from '@/features/admin/core/lib/adminStyles'
import { AdminAlert } from '@/features/admin/core/ui/AdminUi'
import { FieldGroup, LandingField } from './LandingField'

interface Props {
  download: LandingDownload | null
  isUploading: boolean
  uploadProgress: number
  onUpload: (file: File, version?: string) => Promise<LandingDownload | null>
  onDelete: () => Promise<boolean>
  onDownload: () => Promise<void>
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

function formatDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' })
}

/** Carga el instalador .exe del escritorio que la landing pública ofrece para descargar. */
export function LandingDownloadEditor({ download, isUploading, uploadProgress, onUpload, onDelete, onDownload }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [version, setVersion] = useState(download?.version ?? '')
  const [localError, setLocalError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<{ name: string; size: number } | null>(null)

  useEffect(() => {
    setVersion(download?.version ?? '')
  }, [download?.version, download?.updatedAt])

  const pickFile = () => {
    setLocalError(null)
    inputRef.current?.click()
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setLocalError(null)

    const lower = file.name.toLowerCase()
    if (!lower.endsWith('.exe')) {
      setLocalError('Solo se permiten archivos .exe.')
      return
    }

    const maxBytes = 512 * 1024 * 1024
    if (file.size > maxBytes) {
      setLocalError('El instalador no puede superar los 512 MB.')
      return
    }

    setUploadingFile({ name: file.name, size: file.size })
    try {
      const result = await onUpload(file, version)
      if (result?.version) setVersion(result.version)
    } finally {
      setUploadingFile(null)
    }
  }

  const handleDelete = async () => {
    setLocalError(null)
    const ok = await onDelete()
    if (ok) {
      setPendingDelete(false)
      setVersion('')
    }
  }

  return (
    <div className="flex flex-col gap-space-sm">
      <input
        ref={inputRef}
        type="file"
        accept=".exe,application/x-msdownload"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          void handleFile(file)
        }}
      />

      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 p-space-sm font-body-sm text-body-sm text-on-surface-variant">
        Sube aquí el instalador de NovusPOS Desktop (.exe). Este archivo será el que los visitantes podrán descargar desde la landing. Cada vez que subas una nueva versión, reemplazará la anterior.
      </div>

      {localError && <AdminAlert>{localError}</AdminAlert>}

      {isUploading && (
        <div className="rounded-xl border border-primary/20 bg-surface-container-lowest p-space-sm shadow-sm" role="status" aria-live="polite">
          <div className="flex items-start gap-space-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MS name="cloud_upload" className="text-[22px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-space-sm">
                <p className="truncate font-label-md text-label-md font-semibold text-on-surface">
                  {uploadProgress >= 100 ? 'Procesando instalador' : 'Subiendo instalador'}
                </p>
                <span className="shrink-0 font-label-sm text-label-sm font-semibold text-primary">{Math.round(uploadProgress)}%</span>
              </div>
              <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                {uploadingFile?.name ?? 'Archivo .exe'}
                {uploadingFile ? ` · ${formatBytes(uploadingFile.size)}` : ''}
              </p>
            </div>
          </div>

          <div className="mt-space-sm">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-[width] duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <span>{uploadProgress >= 100 ? 'Verificando y publicando el archivo en el servidor…' : 'No cierres esta ventana hasta completar la carga.'}</span>
              <span className="shrink-0">{uploadProgress >= 100 ? 'Casi listo' : 'En progreso'}</span>
            </div>
          </div>
        </div>
      )}

      <FieldGroup title="Instalador publicado" description="Archivo que se ofrece en los botones de descarga de la landing.">
        {download ? (
          <div className="flex flex-col gap-space-sm rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
            <div className="flex items-start gap-space-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MS name="deployed_code" className="text-[24px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-label-md text-label-md font-semibold text-on-surface">{download.fileName}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {formatBytes(download.sizeBytes)}{download.version ? ` · v${download.version}` : ''} · Actualizado {formatDate(download.updatedAt)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void onDownload()}
              className="inline-flex items-center gap-space-xs font-label-sm text-label-sm font-semibold text-primary hover:underline"
            >
              <MS name="download" className="text-[16px]" /> Descargar instalador
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-space-xs rounded-xl border border-dashed border-outline-variant/70 bg-surface-container-low/40 px-space-md py-space-lg text-center">
            <MS name="upload_file" className="text-[32px] text-outline" />
            <p className="font-label-md text-label-md font-semibold text-on-surface">No hay instalador publicado</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Sube un archivo .exe para que el botón de descarga de la landing funcione.</p>
          </div>
        )}

        <LandingField
          label="Versión (opcional)"
          value={version}
          hint="Ejemplo: 2.5.0. Se muestra como referencia interna."
          onChange={setVersion}
        />

        <div className="flex flex-wrap gap-1">
          <button type="button" className={adminCompactButton} disabled={isUploading} onClick={pickFile}>
            <MS name="upload_file" className="text-[14px]" />
            {isUploading ? 'Subiendo…' : download ? 'Reemplazar instalador' : 'Subir instalador'}
          </button>
          {download && !pendingDelete && (
            <button
              type="button"
              className={adminCompactButton}
              disabled={isUploading}
              onClick={() => setPendingDelete(true)}
            >
              <MS name="delete" className="text-[14px]" /> Quitar instalador
            </button>
          )}
        </div>

        {pendingDelete && (
          <div className="rounded-xl border border-error/30 bg-error-container/20 p-space-sm">
            <p className="font-body-sm text-body-sm text-on-surface">
              Esto quitará el instalador de la landing. Los botones de descarga dejarán de ofrecer el archivo hasta que subas uno nuevo.
            </p>
            <div className="mt-space-sm flex flex-wrap gap-1">
              <button type="button" className={adminCompactButton} disabled={isUploading} onClick={() => void handleDelete()}>
                <MS name="delete" className="text-[14px]" /> Sí, quitar
              </button>
              <button type="button" className={adminCompactButton} disabled={isUploading} onClick={() => setPendingDelete(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </FieldGroup>
    </div>
  )
}
