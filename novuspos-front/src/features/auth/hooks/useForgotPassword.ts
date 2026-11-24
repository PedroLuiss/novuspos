import { useCallback, useState } from 'react'
import { emptyFormErrors, toFormError, type FormErrorState } from '../lib/formErrors'
import { requestPasswordResetUseCase } from '../services/passwordRecoveryService'

interface ForgotPasswordState extends FormErrorState {
  isSubmitting: boolean
  isSent: boolean
}

const initialState: ForgotPasswordState = { ...emptyFormErrors, isSubmitting: false, isSent: false }

/** Orquesta la solicitud de enlace; la UI solo renderiza el estado. */
export function useForgotPassword() {
  const [state, setState] = useState<ForgotPasswordState>(initialState)

  const submit = useCallback((email: string) => {
    setState({ ...initialState, isSubmitting: true })

    void requestPasswordResetUseCase
      .execute({ email })
      .then(() => setState({ ...initialState, isSent: true }))
      .catch((error: unknown) => {
        setState({ ...initialState, ...toFormError(error, 'No pudimos enviar el enlace. Inténtalo de nuevo.') })
      })
  }, [])

  return { ...state, submit }
}
