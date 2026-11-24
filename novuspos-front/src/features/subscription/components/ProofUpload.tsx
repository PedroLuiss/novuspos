import { useRef, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { prepareProofImage, type ProofImageResult } from '../lib/proofImage'

interface Props {
  proofName?: string
  proofDataUrl?: string
  error?: string
  onSelect: (result: ProofImageResult) => void
  onClear: () => void
}

/** Captura del comprobante, con vista previa y preparación ligera de la imagen. */
export function ProofUpload({ proofName, proofDataUrl, error, onSelect, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setLocalError(null)
    try {
      onSelect(await prepareProofImage(file))
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : 'No pudimos leer la imagen.')
    } finally {
      // Permite volver a seleccionar el mismo archivo después de quitarlo.
      if (inputRef.current) inputRef.current.value = ''
      setBusy(false)
    }
  }

  const clear = () => {
    if (inputRef.current) inputRef.current.value = ''
    onClear()
  }

  return (
    <div className="flex flex-col gap-space-xs">
      <span className="font-label-md text-label-md text-on-surface font-semibold">Captura de tu comprobante</span>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Toma una captura donde se vean el banco, la fecha, el monto y los dígitos de la referencia.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      {proofDataUrl ? (
        <div className="flex items-center gap-space-sm p-space-xs rounded-lg bg-surface-container-low">
          <img src={proofDataUrl} alt="Vista previa del comprobante" className="w-14 h-14 object-cover rounded-md bg-surface" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-body-sm text-body-sm text-on-surface truncate">{proofName}</span>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
              <MS name="check_circle" className="text-[14px]" /> Listo para enviar
            </span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="font-label-sm text-label-sm text-error hover:underline flex items-center gap-1"
          >
            <MS name="close" className="text-[15px]" /> Quitar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full py-space-md rounded-lg border border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex flex-col items-center gap-1 transition-colors disabled:opacity-60"
        >
          <MS name={busy ? 'progress_activity' : 'add_photo_alternate'} className={`text-2xl ${busy ? 'animate-spin' : 'text-primary'}`} />
          <span className="font-label-md text-label-md font-semibold">
            {busy ? 'Preparando imagen…' : 'Subir comprobante'}
          </span>
          <span className="font-body-sm text-body-sm">JPG, PNG o WEBP · máximo 8 MB</span>
        </button>
      )}
      {(localError ?? error) && (
        <span className="font-body-sm text-body-sm text-error px-1" role="alert">
          {localError ?? error}
        </span>
      )}
    </div>
  )
}
