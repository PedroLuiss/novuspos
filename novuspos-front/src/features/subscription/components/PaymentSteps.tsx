import { MS } from '@/shared/ui/MS'

const STEPS = [
  { number: 1, label: 'Cómo pagar' },
  { number: 2, label: 'Tus datos' },
  { number: 3, label: 'Confirmar' },
]

/** Indicador visual de los pasos del pago. */
export function PaymentSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-space-xs">
      {STEPS.map((step, index) => {
        const done = step.number < current
        const active = step.number === current
        return (
          <li key={step.number} className="flex items-center gap-space-xs flex-1 last:flex-none">
            <div className="flex items-center gap-space-xs">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0 ${
                  done
                    ? 'bg-secondary text-on-secondary'
                    : active
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {done ? <MS name="check" className="text-[16px]" /> : step.number}
              </span>
              <span
                className={`font-label-sm text-label-sm font-semibold whitespace-nowrap ${
                  active ? 'text-on-surface' : 'text-on-surface-variant'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && <span className="h-px flex-1 bg-surface-container-high" />}
          </li>
        )
      })}
    </ol>
  )
}
