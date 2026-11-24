import { useCallback, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { ApiError, ValidationError, type ValidationIssues } from '@/shared/services/apiClient'
import { loginUseCase } from '../services/authService'
import type { LoginCredentials } from '../types'

interface LoginState {
  isSubmitting: boolean
  fieldErrors: ValidationIssues
  formError: string | null
}

const initialState: LoginState = { isSubmitting: false, fieldErrors: {}, formError: null }

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
          if (error instanceof ValidationError) {
            setState({ isSubmitting: false, fieldErrors: error.issues ?? {}, formError: error.message })
          } else if (error instanceof ApiError) {
            setState({ isSubmitting: false, fieldErrors: {}, formError: error.message })
          } else {
            setState({
              isSubmitting: false,
              fieldErrors: {},
              formError: 'No pudimos iniciar sesión. Inténtalo de nuevo.',
            })
          }
        })
    },
    [login],
  )

  return { ...state, submit }
}
