import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import type { PaymentAccount } from '../types'

/** Datos bancarios de Novus. Se copian con un toque para evitar errores. */
export function PaymentAccountCard({ account }: { account: PaymentAccount }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      // El usuario puede seleccionar el texto manualmente.
    }
  }

  return (
    <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-xs">
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md font-bold text-on-surface">{account.label}</span>
        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
          Datos oficiales
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-space-md gap-y-space-xs">
        {account.rows.map((row) => (
          <div key={row.label} className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant">{row.label}</span>
            <div className="flex items-center justify-between gap-space-xs">
              <span className={`text-on-surface font-semibold ${row.mono ? 'font-mono font-body-sm' : 'font-body-md text-body-md'} truncate select-all`}>
                {row.value}
              </span>
              <button
                type="button"
                onClick={() => void copy(row.label, row.value)}
                className="text-primary hover:text-primary-container transition-colors shrink-0"
                aria-label={`Copiar ${row.label}`}
              >
                <MS name={copied === row.label ? 'done' : 'content_copy'} className="text-[17px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs">
        Copia los datos exactamente como aparecen aquí. Paga únicamente a esta cuenta.
      </p>
    </div>
  )
}
