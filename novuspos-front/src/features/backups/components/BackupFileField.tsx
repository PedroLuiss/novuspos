import { useRef } from 'react'
import { FieldShell } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { formatBytes } from '../lib/backupFormatters'

interface Props {
  file: File | null
  error?: string
  onSelect: (file: File) => void
  onClear: () => void
}

/** Selector de archivo de copia, con el mismo aspecto que los campos del login. */
export function BackupFileField({ file, error, onSelect, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const clear = () => {
    if (inputRef.current) inputRef.current.value = ''
    onClear()
  }

  return (
    <FieldShell id="backup-file" label="Archivo de la copia" helper="Selecciona el archivo que creó NovusPOS en tu equipo." error={error}>
      <input
        ref={inputRef}
        id="backup-file"
        type="file"
        accept=".db,.sqlite,.sqlite3,.zip"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) onSelect(selected)
        }}
      />
      {file ? (
        <div className="flex items-center gap-space-sm p-space-xs rounded-lg bg-surface-container-low">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center shrink-0">
            <MS name="description" className="text-[20px]" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-body-sm text-body-sm text-on-surface truncate">{file.name}</span>
            <span className="font-label-sm text-label-sm text-secondary">{formatBytes(file.size)}</span>
          </div>
          <button type="button" onClick={clear} className="font-label-sm text-label-sm text-error hover:underline flex items-center gap-1">
            <MS name="close" className="text-[15px]" /> Quitar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-space-md rounded-lg border border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex flex-col items-center gap-1 transition-colors"
        >
          <MS name="folder_open" className="text-2xl text-primary" />
          <span className="font-label-md text-label-md font-semibold">Elegir archivo</span>
          <span className="font-body-sm text-body-sm">Copia de NovusPOS · hasta 500 MB</span>
        </button>
      )}
    </FieldShell>
  )
}
