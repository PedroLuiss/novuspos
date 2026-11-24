import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { subscriptionStatusLabels } from '../data/dashboard-data'
import { formatPanelDate, isOverdue } from '../lib/dashboardFormatters'
import type { DashboardSubscriptionStatus, DashboardSummary } from '../types'

interface Props {
  summary: DashboardSummary
}

const STATUS_STYLE: Record<DashboardSubscriptionStatus, string> = {
  active: 'bg-secondary-container text-on-secondary-container',
  pending_review: 'bg-tertiary-container text-on-tertiary-container',
  inactive: 'bg-error-container text-on-error-container',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

/** Clave vigente, plan contratado y estado del pago mensual. */
export function AccessCard({ summary }: Props) {
  const [copied, setCopied] = useState(false)
  const unpaid = summary.subscriptionStatus === 'inactive' && isOverdue(summary.dueAt)

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(summary.activationKey)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <MS name="key" className="text-primary text-[24px]" />
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Tu clave NovusPOS</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Con esta clave activas el sistema en tu computadora.
            </span>
          </div>
        </div>
        <span
          className={`self-start px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${STATUS_STYLE[summary.subscriptionStatus]}`}
        >
          {subscriptionStatusLabels[summary.subscriptionStatus]}
        </span>
      </div>

      <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Clave de activación
          </span>
          <span className="font-numeric-keypad text-numeric-keypad font-mono text-primary font-bold tracking-[0.05em] select-all break-all">
            {summary.activationKey}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Se renueva con cada pago mensual. Vigente hasta {formatPanelDate(summary.activationKeyRenewsAt)}.
          </span>
        </div>
        <button
          type="button"
          onClick={() => void copyKey()}
          className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold transition-all shrink-0"
        >
          <MS name={copied ? 'done' : 'content_copy'} className="text-[18px]" />
          <span>{copied ? '¡Copiada!' : 'Copiar clave'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {unpaid
            ? 'No registramos el pago de este mes. Al pagar, tu clave se renueva y todo vuelve a funcionar.'
            : summary.subscriptionStatus === 'pending_review'
              ? 'Estamos revisando tu comprobante. Tu clave se renueva en cuanto aprobemos el pago.'
              : `Suscripción ${summary.planName} al día. Próxima fecha: ${formatPanelDate(summary.dueAt)}.`}
        </p>
        {summary.subscriptionStatus !== 'active' && (
          <a
            href="/panel/suscripcion"
            className="px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shrink-0"
          >
            <MS name="payments" className="text-[18px]" /> Ir a Suscripción
          </a>
        )}
      </div>
    </div>
  )
}
