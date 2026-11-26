import type { PaymentAccount } from '../types'
import { FieldShell } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'

interface Props {
  options: PaymentAccount[]
  value: string | null
  error?: string
  onChange: (method: string) => void
}

/** Selección de los métodos que el dueño habilitó para cobrar la suscripción. */
export function PaymentMethodSelector({ options, value, error, onChange }: Props) {
  return (
    <FieldShell id="payment-method" label="¿Cómo realizaste el pago?" error={error}>
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
              <MS name={account.icon} className={`text-[22px] ${selected ? 'text-primary' : 'text-on-surface-variant'}`} />
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
    </FieldShell>
  )
}
