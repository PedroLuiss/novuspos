import { useMemo, useState } from 'react'
import { usePaymentMethods } from '@/shared/hooks/usePaymentMethods'
import { paymentMethodLabels } from '@/shared/services/payment-methods/paymentMethodLabels'
import { MS } from '@/shared/ui/MS'
import { useSubscriptionOverview } from '../hooks/useSubscriptionOverview'
import { canSwitchPlan, isSubscriptionExpired, isTrialSubscription, selectedPlanId } from '../lib/subscriptionStatus'
import type { Plan } from '../types'
import { PaymentHistoryTable } from './PaymentHistoryTable'
import { PaySubscriptionModal } from './PaySubscriptionModal'
import { PlanCatalog } from './PlanCatalog'
import { SubscriptionCard } from './SubscriptionCard'
import { SubscriptionSkeleton } from './SubscriptionSkeleton'

/** Contenedor del módulo: obtiene datos y coordina el modal con el historial. */
export function SubscriptionOverview() {
  const { overview, isLoading, error, refresh } = useSubscriptionOverview()
  const { methods } = usePaymentMethods()
  const methodLabels = useMemo(() => paymentMethodLabels(methods), [methods])
  const [isPayOpen, setIsPayOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const currentPlanId = overview ? selectedPlanId(overview.subscription, overview.payments) : ''
  const canSwitch = overview ? canSwitchPlan(overview.subscription) : false
  const isTrial = overview ? isTrialSubscription(overview.subscription) : false
  const isExpired = overview ? isSubscriptionExpired(overview.subscription) : false
  const isPendingReview = overview?.subscription.status === 'pending_review'

  const openPayment = (plan: Plan) => {
    if (!overview || !canSwitch) return
    setSelectedPlan(plan)
    setIsPayOpen(true)
  }
  const closePayment = () => {
    setIsPayOpen(false)
    setSelectedPlan(null)
  }

  if (isLoading && !overview) {
    return <SubscriptionSkeleton />
  }

  if (!overview) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-sm">
        <p className="font-body-md text-body-md text-error">{error ?? 'No pudimos cargar tu suscripción.'}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="self-start px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const plan = overview.plans.find((item) => item.id === currentPlanId) ?? overview.plans[0]

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex items-center gap-space-xs">
        <MS name="auto_awesome" className="text-primary text-[20px]" />
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Suscripción</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Tu plan, tus pagos y todo lo que necesitas para mantenerlo activo.
            {isLoading && <span className="text-primary"> Actualizando…</span>}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {error}
        </div>
      )}

      <PlanCatalog
        plans={overview.plans}
        currentPlanId={currentPlanId}
        canSwitch={canSwitch}
        isTrial={isTrial}
        isExpired={isExpired}
        isPendingReview={isPendingReview}
        renewsAt={overview.subscription.renewsAt}
        isLoading={isLoading && overview.plans.length === 0}
        onSelect={openPayment}
      />
      {plan && (
        <SubscriptionCard
          subscription={overview.subscription}
          plan={plan}
          isTrial={isTrial}
          canPay={canSwitch}
          onPay={() => openPayment(plan)}
        />
      )}
      <PaymentHistoryTable
        payments={overview.payments}
        plans={overview.plans}
        subscription={overview.subscription}
        methodLabels={methodLabels}
      />

      {isPayOpen && (selectedPlan ?? plan) && (
        <PaySubscriptionModal
          subscription={overview.subscription}
          plan={(selectedPlan ?? plan)!}
          onClose={closePayment}
          onPaid={() => void refresh()}
        />
      )}
    </div>
  )
}
