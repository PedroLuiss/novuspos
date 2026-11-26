import { useCallback, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { navigate } from '@/shared/router/navigation'
import { emptyFormErrors, toFormError, type FormErrorState } from '../lib/formErrors'
import { resetPasswordUseCase } from '../services/passwordRecoveryService'

interface ResetPasswordState extends FormErrorState {
  isSubmitting: boolean
}

const initialState: ResetPasswordState = { ...emptyFormErrors, isSubmitting: false }

/** Orquesta el restablecimiento y la sesión resultante; la UI solo renderiza. */
export function useResetPassword(token: string | null, email: string | null) {
  const { login } = useAuth()
  const [state, setState] = useState<ResetPasswordState>(initialState)

  const submit = useCallback(
    (password: string) => {
      if (!token) return
      setState({ ...initialState, isSubmitting: true })

      void resetPasswordUseCase
        .execute({ token, email, password })
        .then((session) => {
          login(session.token, session.user)
          setState(initialState)
          navigate('/panel', { replace: true })
        })
        .catch((error: unknown) => {
          setState({ ...initialState, ...toFormError(error, 'No pudimos actualizar tu contraseña. Inténtalo de nuevo.') })
        })
    },
    [email, login, token],
  )

  return { ...state, submit }
}
