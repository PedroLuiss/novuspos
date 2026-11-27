import { FieldShell } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { PaymentAccount } from '../types'

interface Props {
  options: PaymentAccount[]
  value: string | null
  error?: string
  isLoading?: boolean
  onChange: (method: string) => void
}

/** Selección de los métodos que el dueño habilitó para cobrar la suscripción. */
export function PaymentMethodSelector({ options, value, error, isLoading = false, onChange }: Props) {
  return (
    <FieldShell id="payment-method" label="¿Cómo realizaste el pago?" error={error}>
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs"
          role="status"
          aria-label="Cargando métodos de pago…"
        >
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-space-sm p-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest"
            >
              <Skeleton className="h-6 w-6 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-32 max-w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs" role="group" aria-labelledby="payment-method-label">
          {options.map((account) => {
            const selected = value === account.id
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => onChange(account.id)}
                aria-pressed={selected}
                className={`flex items-center gap-space-sm p-space-sm rounded-lg border text-left transition-colors ${
                  selected
                    ? 'border-primary bg-primary-fixed/40 text-on-surface'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <MS
                  name={account.icon}
                  className={`text-[22px] ${selected ? 'text-primary' : 'text-on-surface-variant'}`}
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-semibold">{account.label}</span>
                  {account.description && (
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{account.description}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </FieldShell>
  )
}
