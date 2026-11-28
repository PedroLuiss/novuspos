import { statusLabels } from '../data/subscription-data'
import { formatDate, formatMoney } from '../lib/formatters'
import type { Plan, Subscription } from '../types'
import { MS } from '@/shared/ui/MS'

interface Props {
  subscription: Subscription
  plan: Plan
  isTrial?: boolean
  onPay: () => void
}

const STATUS_STYLE: Record<Subscription['status'], string> = {
  active: 'bg-secondary-container text-on-secondary-container',
  pending_review: 'bg-tertiary-container text-on-tertiary-container',
  expired: 'bg-error-container text-on-error-container',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

/** Tarjeta principal: a qué plan está suscrito y en qué estado está el pago. */
export function SubscriptionCard({ subscription, plan, isTrial = false, onPay }: Props) {
  const pending = subscription.status === 'pending_review'

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <MS name="workspace_premium" className="text-primary text-[24px]" />
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Mi suscripción</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Plan contratado y estado de tus pagos.</span>
          </div>
        </div>
        <span className={`self-start px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${STATUS_STYLE[subscription.status]}`}>
          {isTrial ? 'Prueba gratuita' : statusLabels[subscription.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Plan</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{plan.name}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{plan.description}</span>
        </div>
        <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            {plan.interval === 'year' ? 'Anualidad' : 'Mensualidad'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">
              {formatMoney(subscription.amount || plan.price, subscription.currency || plan.currency)}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              al {plan.interval === 'year' ? 'año' : 'mes'}
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Un comercio por suscripción.</span>
        </div>
        <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            {pending ? 'Último pago' : 'Vigencia'}
          </span>
          <span className="font-label-md text-label-md font-bold text-on-surface font-mono">
            {formatDate(pending ? subscription.startedAt : subscription.renewsAt)}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {pending
              ? 'Estamos revisando tu comprobante.'
              : isTrial
                ? 'Termina tu prueba gratuita el:'
                : 'Fecha de tu próxima renovación.'}
          </span>
        </div>
      </div>

      {pending && (
        <div className="flex items-start gap-space-xs rounded-lg bg-tertiary-fixed/50 p-space-sm">
          <MS name="pending_actions" className="text-tertiary text-[18px] shrink-0 mt-0.5" />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Ya registramos tu comprobante. En cuanto lo evaluemos, verás tu suscripción activa aquí.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {isTrial
            ? 'Puedes activar el plan que quieras desde ahora. Si no pagas, sigues usando el sistema hasta que termine la prueba.'
            : 'Paga desde tu banco y reporta los datos aquí. Es rápido y sin plazos forzosos.'}
        </p>
        <button
          type="button"
          onClick={onPay}
          className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
        >
          <MS name="payments" className="text-[18px]" />
          {pending ? 'Reportar otro pago' : isTrial ? 'Elegir y pagar un plan' : 'Pagar suscripción'}
        </button>
      </div>
    </div>
  )
}
