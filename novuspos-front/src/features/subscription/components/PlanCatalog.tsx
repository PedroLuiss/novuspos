import { MS } from '@/shared/ui/MS'
import { formatDate, formatMoney } from '../lib/formatters'
import type { Plan } from '../types'

interface Props {
  plans: Plan[]
  currentPlanId: string
  canSwitch: boolean
  renewsAt: string
  onSelect: (plan: Plan) => void
}

/** Suscripciones disponibles; la lista la envía la API de Laravel. */
export function PlanCatalog({ plans, currentPlanId, canSwitch, renewsAt, onSelect }: Props) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center gap-space-xs">
        <MS name="auto_awesome" className="text-primary text-[22px]" />
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Suscripciones disponibles</h2>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Elige la que mejor se ajuste a tu negocio.
          </span>
        </div>
      </div>

      {!canSwitch && (
        <div className="flex items-start gap-space-xs rounded-lg bg-surface-container p-space-sm">
          <MS name="lock" className="text-primary text-[18px] shrink-0 mt-0.5" />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Tu suscripción sigue activa. Podrás elegir otro plan cuando venza el {formatDate(renewsAt)}. Hasta entonces
            puedes renovar el plan que ya tienes.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
        {plans.map((plan) => {
          const current = plan.id === currentPlanId
          return (
            <div
              key={plan.id}
              className={`flex flex-col gap-space-sm p-space-md rounded-lg border ${
                current ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant bg-surface-container-low'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{plan.name}</span>
                {plan.highlighted && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                    Recomendada
                  </span>
                )}
                {current && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
                    Tu plan actual
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-numeric-keypad text-numeric-keypad font-mono font-bold text-on-surface">
                  {formatMoney(plan.price, plan.currency)}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  al {plan.interval === 'year' ? 'año' : 'mes'}
                </span>
              </div>
              <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/60">
                {plan.features.map((feature) => (
                  <span key={feature} className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                    <MS name="check" className="text-secondary text-[16px] shrink-0 mt-0.5" />
                    {feature}
                  </span>
                ))}
              </div>
              {current ? (
                <span className="font-label-sm text-label-sm font-semibold text-secondary flex items-center gap-1">
                  <MS name="check_circle" className="text-[16px]" /> Plan contratado
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!canSwitch}
                  onClick={() => onSelect(plan)}
                  title={canSwitch ? undefined : 'Tu suscripción aún no ha vencido'}
                  className="mt-auto w-full py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 disabled:bg-surface-container disabled:text-outline disabled:cursor-not-allowed"
                >
                  <MS name={canSwitch ? 'payments' : 'lock'} className="text-[16px]" />
                  {canSwitch ? 'Elegir este plan' : 'Disponible al vencer'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
