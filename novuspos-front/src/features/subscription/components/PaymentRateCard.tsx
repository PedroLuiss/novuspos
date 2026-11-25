import { MS } from '@/shared/ui/MS'

interface Props {
  rateLabel: string | null
  totalLabel: string | null
  usdLabel: string
  sourceLabel: string
  dateLabel?: string
  isFallback: boolean
  isLoading: boolean
  error: string | null
}

/** Tasa real del día y total en bolívares, visibles al elegir el método de pago. */
export function PaymentRateCard({
  rateLabel,
  totalLabel,
  usdLabel,
  sourceLabel,
  dateLabel,
  isFallback,
  isLoading,
  error,
}: Props) {
  return (
    <div className="rounded-lg bg-surface-container-low p-space-sm flex flex-col gap-space-xs">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
        Total a pagar en bolívares
      </span>
      {isLoading ? (
        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
          <MS name="progress_activity" className="animate-spin text-primary text-[16px]" /> Consultando la tasa del día…
        </span>
      ) : totalLabel && rateLabel ? (
        <>
          <div className="flex items-baseline justify-between gap-space-xs">
            <span className="font-body-md text-body-md text-on-surface">Monto total</span>
            <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold">{totalLabel}</span>
          </div>
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>{sourceLabel}</span>
            <span className="font-mono">1 USD = Bs {rateLabel}</span>
          </div>
          {dateLabel && (
            <span className="font-label-sm text-label-sm text-outline">Tasa del {dateLabel}</span>
          )}
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Monto en dólares</span>
            <span className="font-mono">{usdLabel}</span>
          </div>
          {isFallback && (
            <span className="font-label-sm text-label-sm text-outline">
              No pudimos consultar la tasa en línea. Es una referencia; confirma el monto con tu banco antes de pagar.
            </span>
          )}
        </>
      ) : (
        <span className="font-body-sm text-body-sm text-on-surface-variant" role="status">
          {error ?? 'Consulta el monto en bolívares con tu banco antes de pagar.'}
        </span>
      )}
    </div>
  )
}
