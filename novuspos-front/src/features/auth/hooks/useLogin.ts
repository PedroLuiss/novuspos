import { useCallback, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { emptyFormErrors, toFormError, type FormErrorState } from '../lib/formErrors'
import { loginUseCase } from '../services/authService'
import type { LoginCredentials } from '../types'

interface LoginState extends FormErrorState {
  isSubmitting: boolean
}

const initialState: LoginState = { ...emptyFormErrors, isSubmitting: false }

/** Orquesta el caso de uso de login; el componente solo renderiza su estado. */
export function useLogin() {
  const { login } = useAuth()
  const [state, setState] = useState<LoginState>(initialState)

  const submit = useCallback(
    (credentials: LoginCredentials) => {
      setState({ isSubmitting: true, fieldErrors: {}, formError: null })

      void loginUseCase
        .execute(credentials)
        .then((session) => {
          login(session.token, session.user)
          setState(initialState)
          window.location.assign('/panel')
        })
        .catch((error: unknown) => {
          setState({
            ...initialState,
            ...toFormError(error, 'No pudimos iniciar sesión. Inténtalo de nuevo.'),
          })
        })
    },
    [login],
  )

  return { ...state, submit }
}
