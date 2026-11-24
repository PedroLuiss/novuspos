import { useEffect, useState } from 'react'
import { IS_DEMO_AUTH } from '@/shared/lib/env'
import { MS } from '@/shared/ui/MS'
import { banks, paymentAccounts } from '../data/subscription-data'
import { usePaymentDraft } from '../hooks/usePaymentDraft'
import { usePaymentSubmission } from '../hooks/usePaymentSubmission'
import { formatMoney, toDateInputValue } from '../lib/formatters'
import { hasErrors, validatePaymentDraft } from '../lib/paymentValidation'
import type { PaymentFieldErrors, PaymentRecord, Plan, Subscription } from '../types'
import { PaymentAccountCard } from './PaymentAccountCard'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { PaymentSteps } from './PaymentSteps'
import { ProofUpload } from './ProofUpload'

interface Props {
  subscription: Subscription
  plan: Plan
  onClose: () => void
  onPaid: (payment: PaymentRecord) => void
}

/** Modal de tres pasos para reportar el pago de la suscripción. */
export function PaySubscriptionModal({ subscription, plan, onClose, onPaid }: Props) {
  const [step, setStep] = useState(1)
  const [stepErrors, setStepErrors] = useState<PaymentFieldErrors>({})
  const [submitted, setSubmitted] = useState<PaymentRecord | null>(null)
  const { draft, update, clear } = usePaymentDraft(subscription.id)
  const { isSubmitting, fieldErrors, formError, submit, clearErrors } = usePaymentSubmission((payment) => {
    clear()
    onPaid(payment)
    setSubmitted(payment)
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const errors = { ...stepErrors, ...fieldErrors }
  const account = draft.method ? paymentAccounts[draft.method] : null
  const amount = formatMoney(subscription.amount || plan.price, subscription.currency || plan.currency)

  const patch = (values: Parameters<typeof update>[0]) => {
    setStepErrors({})
    clearErrors()
    update(values)
  }

  const goNext = () => {
    const found = validatePaymentDraft(draft)
    const fields = step === 1 ? (['method'] as const) : (['reference', 'paidAt', 'bank', 'proof'] as const)
    const relevant: PaymentFieldErrors = {}
    for (const field of fields) {
      if (found[field]) relevant[field] = found[field]
    }
    setStepErrors(relevant)
    if (Object.keys(relevant).length === 0) setStep(step + 1)
  }

  const send = () => {
    const found = validatePaymentDraft(draft)
    if (hasErrors(found)) {
      setStepErrors(found)
      setStep(!draft.method ? 1 : 2)
      return
    }
    if (!draft.method || !draft.proofDataUrl) return
    void submit({
      subscriptionId: subscription.id,
      method: draft.method,
      reference: draft.reference,
      paidAt: draft.paidAt,
      bank: draft.bank,
      proofName: draft.proofName,
      proofDataUrl: draft.proofDataUrl,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-on-surface/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-space-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-subscription-title"
        className="w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-t-2xl sm:rounded-xl bg-surface-container-lowest shadow-2xl flex flex-col"
      >
        <header className="p-space-lg pb-space-sm flex items-start justify-between gap-space-sm">
          <div>
            <h2 id="pay-subscription-title" className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {submitted ? '¡Recibimos tu pago!' : 'Pagar suscripción'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {plan.name} · {amount} al mes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0"
          >
            <MS name="close" className="text-lg" />
          </button>
        </header>

        {submitted ? (
          <div className="px-space-lg pb-space-lg flex flex-col items-center text-center gap-space-sm">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <MS name="check_circle" filled className="text-3xl" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Tu pago está en revisión</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Guardamos tu comprobante con la referencia <strong className="font-mono">{submitted.reference}</strong>. Tu
              suscripción quedó pendiente de evaluación y se activará cuando se confirme el pago.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-space-sm px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
            >
              Entendido
            </button>
          </div>
        ) : (
          <>
            <div className="px-space-lg pb-space-md">
              <PaymentSteps current={step} />
            </div>
            <div className="px-space-lg pb-space-md flex flex-col gap-space-md">
              {formError && (
                <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
                  {formError}
                </div>
              )}

              {step === 1 && (
                <>
                  <div className="rounded-lg bg-primary-fixed/40 p-space-sm flex items-start gap-space-xs">
                    <MS name="info" className="text-primary text-[18px] shrink-0 mt-0.5" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Realiza el pago por {amount} con los datos de NovusPOS y luego regresa aquí para reportarlo.
                    </p>
                  </div>
                  <PaymentMethodSelector value={draft.method} error={errors.method} onChange={(method) => patch({ method })} />
                  {account ? <PaymentAccountCard account={account} /> : (
                    <div className="rounded-lg border border-dashed border-outline-variant p-space-lg text-center font-body-sm text-body-sm text-on-surface-variant">
                      Elige un método para ver los datos de pago.
                    </div>
                  )}
                  {IS_DEMO_AUTH && (
                    <p className="font-label-sm text-label-sm text-outline">Datos de ejemplo para probar el flujo.</p>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <label className="flex flex-col gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Dígitos de la referencia</span>
                      <input
                        inputMode="numeric"
                        value={draft.reference}
                        onChange={(event) => patch({ reference: event.target.value.replace(/[^\d]/g, '').slice(0, 20) })}
                        placeholder="Ej. 48291573"
                        className="h-11 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-mono focus:outline-none focus:bg-surface-container-lowest"
                      />
                      {errors.reference && <span className="font-body-sm text-body-sm text-error" role="alert">{errors.reference}</span>}
                    </label>
                    <label className="flex flex-col gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Fecha del pago</span>
                      <input
                        type="date"
                        max={toDateInputValue()}
                        value={draft.paidAt}
                        onChange={(event) => patch({ paidAt: event.target.value })}
                        className="h-11 px-space-sm rounded-lg bg-surface-container-low text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                      />
                      {errors.paidAt && <span className="font-body-sm text-body-sm text-error" role="alert">{errors.paidAt}</span>}
                    </label>
                  </div>
                  <label className="flex flex-col gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Banco desde el que pagaste</span>
                    <input
                      list="novus-banks"
                      value={draft.bank}
                      onChange={(event) => patch({ bank: event.target.value })}
                      placeholder="Selecciona o escribe tu banco"
                      className="h-11 px-space-sm rounded-lg bg-surface-container-low text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                    />
                    <datalist id="novus-banks">
                      {banks.map((bank) => <option key={bank} value={bank} />)}
                    </datalist>
                    {errors.bank && <span className="font-body-sm text-body-sm text-error" role="alert">{errors.bank}</span>}
                  </label>
                  <div className="rounded-lg bg-surface-container p-space-sm">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      <strong className="text-on-surface">Un tip:</strong> revisa el comprobante. En Banco de Venezuela el
                      número a reportar es el de operación; en depósitos en efectivo, el serial.
                    </p>
                  </div>
                  <ProofUpload
                    proofName={draft.proofName}
                    proofDataUrl={draft.proofDataUrl}
                    error={errors.proof}
                    onSelect={({ dataUrl, name }) => patch({ proofDataUrl: dataUrl, proofName: name })}
                    onClear={() => patch({ proofDataUrl: undefined, proofName: undefined })}
                  />
                </>
              )}

              {step === 3 && account && (
                <>
                  <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-xs">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Resumen de tu pago
                    </span>
                    <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
                      <span>Plan</span><span className="font-semibold">{plan.name}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
                      <span>Método</span>
                      <span className="flex items-center gap-2">
                        <span className="font-semibold">{account.label}</span>
                        <button type="button" onClick={() => setStep(1)} className="font-label-sm text-label-sm text-primary hover:underline">Editar</button>
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
                      <span>Banco</span><span className="font-semibold">{draft.bank}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
                      <span>Referencia</span><span className="font-mono font-semibold">{draft.reference}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-md text-body-md text-on-surface">
                      <span>Fecha</span><span className="font-semibold">{draft.paidAt}</span>
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setStep(2)} className="font-label-sm text-label-sm text-primary hover:underline">Editar datos del comprobante</button>
                    </div>
                    <div className="flex items-center justify-between border-t border-outline-variant pt-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Monto</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold">{amount}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-xs rounded-lg bg-tertiary-fixed/50 p-space-sm">
                    <MS name="schedule" className="text-tertiary text-[18px] shrink-0 mt-0.5" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Al enviar, tu suscripción queda pendiente de evaluación. No necesitas hacer nada más: revisaremos el
                      comprobante y verás el cambio de estado aquí.
                    </p>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {!submitted && (
          <footer className="sticky bottom-0 px-space-lg py-space-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between gap-space-sm rounded-b-xl">
            <button
              type="button"
              onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
              className="px-space-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md font-semibold"
            >
              {step === 1 ? 'Cancelar' : 'Atrás'}
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5"
              >
                Continuar <MS name="arrow_forward" className="text-[17px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={send}
                disabled={isSubmitting}
                className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 disabled:opacity-60"
              >
                {isSubmitting ? 'Enviando…' : 'Enviar pago'}
                {!isSubmitting && <MS name="send" className="text-[17px]" />}
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  )
}
