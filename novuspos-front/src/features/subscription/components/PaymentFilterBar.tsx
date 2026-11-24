import { TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import type { PaymentFilter } from '../lib/paymentPresentation'

interface Props {
  status: PaymentFilter
  query: string
  visible: number
  total: number
  onStatus: (status: PaymentFilter) => void
  onQuery: (query: string) => void
}

const OPTIONS: { value: PaymentFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'pending_review', label: 'En revisión' },
  { value: 'rejected', label: 'Rechazados' },
]

/** Filtros y búsqueda del historial de pagos. */
export function PaymentFilterBar({ status, query, visible, total, onStatus, onQuery }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Filtrar por estado
        </span>
        <div className="flex flex-wrap gap-space-xs">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatus(option.value)}
              aria-pressed={status === option.value}
              className={`px-space-sm py-1.5 rounded-full font-label-md text-label-md font-semibold transition-colors ${
                status === option.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full md:w-72 flex items-end gap-space-xs">
        <div className="flex-1">
          <TextField
            id="payment-search"
            label="Buscar pago"
            icon="search"
            placeholder="Referencia, banco o método"
            value={query}
            onChange={onQuery}
          />
        </div>
        <span className="pb-2 font-label-sm text-label-sm text-on-surface-variant font-mono whitespace-nowrap">
          <MS name="filter_list" className="text-[16px] align-text-bottom" /> {visible}/{total}
        </span>
      </div>
    </div>
  )
}
