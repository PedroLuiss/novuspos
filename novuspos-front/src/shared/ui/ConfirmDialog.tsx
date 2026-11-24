import { useEffect } from 'react'
import { MS } from './MS'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}

/** Diálogo de confirmación reutilizable para acciones destructivas. */
export function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', busy = false, onConfirm, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onClose])

  return (
    <div
      className="fixed inset-0 z-[80] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col gap-space-md">
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
            <MS name="delete_outline" className="text-xl" />
          </div>
          <div>
            <h2 id="confirm-title" className="font-headline-sm text-headline-sm text-on-surface font-bold">{title}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-space-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-space-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md font-semibold disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="px-space-md py-2 rounded-lg bg-error hover:bg-error-container text-on-error font-label-md text-label-md font-semibold disabled:opacity-60"
          >
            {busy ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
