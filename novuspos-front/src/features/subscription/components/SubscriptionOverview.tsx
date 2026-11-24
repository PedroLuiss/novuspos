import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { useSubscriptionOverview } from '../hooks/useSubscriptionOverview'
import { PaymentHistoryTable } from './PaymentHistoryTable'
import { PaySubscriptionModal } from './PaySubscriptionModal'
import { PlanCatalog } from './PlanCatalog'
import { SubscriptionCard } from './SubscriptionCard'

/** Contenedor del módulo: obtiene datos y coordina el modal con el historial. */
export function SubscriptionOverview() {
  const { overview, isLoading, error, reviewingId, refresh, reviewPayment } = useSubscriptionOverview()
  const [isPayOpen, setIsPayOpen] = useState(false)

  if (isLoading && !overview) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm flex items-center justify-center gap-space-xs text-on-surface-variant">
        <MS name="progress_activity" className="animate-spin text-primary text-xl" />
        <span className="font-body-md text-body-md">Cargando tu suscripción…</span>
      </div>
    )
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

  const plan = overview.plans.find((item) => item.id === overview.subscription.planId) ?? overview.plans[0]

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

      <PlanCatalog plans={overview.plans} currentPlanId={overview.subscription.planId} />
      {plan && <SubscriptionCard subscription={overview.subscription} plan={plan} onPay={() => setIsPayOpen(true)} />}
      <PaymentHistoryTable
        payments={overview.payments}
        plans={overview.plans}
        subscription={overview.subscription}
        reviewingId={reviewingId}
        onReview={(id, approved) => void reviewPayment(id, approved)}
      />

      {isPayOpen && plan && (
        <PaySubscriptionModal
          subscription={overview.subscription}
          plan={plan}
          onClose={() => setIsPayOpen(false)}
          onPaid={() => void refresh()}
        />
      )}
    </div>
  )
}
