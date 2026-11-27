import { useCallback, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { navigate } from '@/shared/router/navigation'
import { emptyFormErrors, toFormError, type FormErrorState } from '../lib/formErrors'
import { registerUseCase } from '../services/authService'
import type { RegisterCredentials } from '../types'

interface RegisterState extends FormErrorState {
  isSubmitting: boolean
}

const initialState: RegisterState = { ...emptyFormErrors, isSubmitting: false }

/** Orquesta el caso de uso de registro; el componente solo renderiza su estado. */
export function useRegister() {
  const { login } = useAuth()
  const [state, setState] = useState<RegisterState>(initialState)

  const submit = useCallback(
    (credentials: RegisterCredentials) => {
      setState({ isSubmitting: true, fieldErrors: {}, formError: null })

      void registerUseCase
        .execute(credentials)
        .then((session) => {
          login(session.token, session.user)
          setState(initialState)
          navigate('/panel', { replace: true })
        })
        .catch((error: unknown) => {
          setState({
            ...initialState,
            ...toFormError(error, 'No pudimos crear tu cuenta. Inténtalo de nuevo.'),
          })
        })
    },
    [login],
  )

  return { ...state, submit }
}
