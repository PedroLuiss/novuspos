import { useState } from 'react'
import { emptyPaymentErrors, toPaymentFormError, type PaymentFormErrorState } from '../lib/paymentFormErrors'
import { subscriptionService } from '../services/subscriptionService'
import type { PaymentRecord, SubmitPaymentRequest } from '../types'

interface SubmissionState extends PaymentFormErrorState {
  isSubmitting: boolean
}

/** Caso de uso de envío: valida, envía y avisa al contenedor para recargar. */
export function usePaymentSubmission(onSuccess: (payment: PaymentRecord) => void) {
  const [state, setState] = useState<SubmissionState>({ ...emptyPaymentErrors, isSubmitting: false })

  const submit = async (request: SubmitPaymentRequest) => {
    setState({ ...emptyPaymentErrors, isSubmitting: true })
    try {
      const payment = await subscriptionService.submitPayment(request)
      setState({ ...emptyPaymentErrors, isSubmitting: false })
      onSuccess(payment)
      return true
    } catch (error) {
      setState({
        ...toPaymentFormError(error, 'No pudimos enviar tu pago. Inténtalo de nuevo.'),
        isSubmitting: false,
      })
      return false
    }
  }

  const clearErrors = () => setState({ ...emptyPaymentErrors, isSubmitting: false })

  return { ...state, submit, clearErrors }
}
