import { MS } from '@/shared/ui/MS'

interface Props {
  approvedCount: number
  totalLabel: string
  latestLabel: string
}

/** Resumen calculado con los pagos reales del usuario. */
export function PaymentSummaryStrip({ approvedCount, totalLabel, latestLabel }: Props) {
  const items = [
    { icon: 'check_circle', label: 'Pagos aprobados', value: String(approvedCount) },
    { icon: 'payments', label: 'Total pagado', value: totalLabel },
    { icon: 'calendar_month', label: 'Último mes pagado', value: latestLabel },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
          <div className="w-9 h-9 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary shrink-0">
            <MS name={item.icon} className="text-[18px]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              {item.label}
            </span>
            <span className="font-label-md text-label-md font-mono font-bold text-on-surface truncate">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
