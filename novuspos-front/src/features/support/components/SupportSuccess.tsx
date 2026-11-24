import { MS } from '@/shared/ui/MS'
import type { SupportTicket } from '../types'

interface Props {
  ticket: SupportTicket
  email: string
  onAgain: () => void
}

/** Alerta de éxito con el número de reporte. */
export function SupportSuccess({ ticket, email, onAgain }: Props) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col items-center text-center gap-space-sm">
      <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
        <MS name="check_circle" className="text-[34px]" />
      </div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">¡Reporte enviado!</h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
        {ticket.message ?? 'Recibimos tu reporte. Te responderemos en cuanto lo revisemos.'}
      </p>
      <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Número de reporte
        </span>
        <span className="font-numeric-keypad text-numeric-keypad font-mono font-bold text-primary">
          {ticket.reference}
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Te escribiremos a <span className="font-semibold text-on-surface">{email}</span>.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-space-xs pt-space-xs">
        <button
          type="button"
          onClick={onAgain}
          className="px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
        >
          Enviar otro reporte
        </button>
        <a
          href="/panel"
          className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold"
        >
          Volver al panel
        </a>
      </div>
    </div>
  )
}
