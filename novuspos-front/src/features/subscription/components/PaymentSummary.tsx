import { MS } from '@/shared/ui/MS'
import type { PaymentAccount, PaymentDraft } from '../types'

interface Props {
  planName: string
  account: PaymentAccount
  draft: PaymentDraft
  amount: string
  intervalLabel?: string
  rateLabel?: string | null
  totalLabel?: string | null
  onEditMethod: () => void
  onEditProof: () => void
}

/** Resumen del pago antes de enviarlo; aísla la vista del modal de 3 pasos. */
export function PaymentSummary({
  planName,
  account,
  draft,
  amount,
  intervalLabel,
  rateLabel,
  totalLabel,
  onEditMethod,
  onEditProof,
}: Props) {
  return (
    <>
      <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Resumen de tu pago
        </span>
        <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
          <span>Plan</span><span className="font-semibold">{planName}</span>
        </div>
        <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
          <span>Método</span>
          <span className="flex items-center gap-2">
            <span className="font-semibold">{account.label}</span>
            <button type="button" onClick={onEditMethod} className="font-label-sm text-label-sm text-primary hover:underline">Editar</button>
          </span>
        </div>
        <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
          <span>Banco</span><span className="font-semibold">{draft.bank}</span>
        </div>
        <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
          <span>Referencia</span><span className="font-mono font-semibold">{draft.reference}</span>
        </div>
        <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
          <span>Fecha</span><span className="font-semibold">{draft.paidAt}</span>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onEditProof} className="font-label-sm text-label-sm text-primary hover:underline">Editar datos del comprobante</button>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant pt-space-xs">
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Monto {intervalLabel && <span className="font-label-sm text-label-sm text-on-surface-variant">({intervalLabel})</span>}
          </span>
          <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold">{amount}</span>
        </div>
        {totalLabel && rateLabel && (
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Total en bolívares <span className="font-mono">(tasa {rateLabel})</span>
            </span>
            <span className="font-label-md text-label-md font-mono font-bold text-on-surface">{totalLabel}</span>
          </div>
        )}
      </div>
      <div className="flex items-start gap-space-xs rounded-lg bg-tertiary-fixed/50 p-space-sm">
        <MS name="schedule" className="text-tertiary text-[18px] shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Al enviar, tu suscripción queda pendiente de evaluación. No necesitas hacer nada más: revisaremos el
          comprobante y verás el cambio de estado aquí.
        </p>
      </div>
    </>
  )
}
