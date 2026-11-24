import { paymentAccounts } from '../data/subscription-data'
import type { PaymentMethod } from '../types'
import { MS } from '@/shared/ui/MS'

interface Props {
  value: PaymentMethod | null
  error?: string
  onChange: (method: PaymentMethod) => void
}

/** Selección de pago móvil o transferencia. */
export function PaymentMethodSelector({ value, error, onChange }: Props) {
  const options: PaymentMethod[] = ['mobile', 'transfer']

  return (
    <div className="flex flex-col gap-space-xs">
      <span className="font-label-md text-label-md text-on-surface font-semibold">¿Cómo realizaste el pago?</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
        {options.map((method) => {
          const account = paymentAccounts[method]
          const selected = value === method
          return (
            <button
              key={method}
              type="button"
              onClick={() => onChange(method)}
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
                <span className="font-body-sm text-body-sm text-on-surface-variant">{account.description}</span>
              </div>
            </button>
          )
        })}
      </div>
      {error && (
        <span className="font-body-sm text-body-sm text-error px-1" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
