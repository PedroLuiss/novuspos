import { useCallback, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { ApiError, ValidationError, type ValidationIssues } from '@/shared/services/apiClient'
import { profileService, type UpdateProfileRequest } from '../services/profileService'

interface FormErrorState {
  fieldErrors: ValidationIssues
  formError: string | null
}

const emptyFormErrors: FormErrorState = { fieldErrors: {}, formError: null }

function toFormError(error: unknown, fallback: string): FormErrorState {
  if (error instanceof ValidationError) {
    return { fieldErrors: error.issues ?? {}, formError: error.message }
  }
  if (error instanceof ApiError) {
    return { fieldErrors: {}, formError: error.message }
  }
  return { fieldErrors: {}, formError: fallback }
}

interface ProfileState extends FormErrorState {
  isSaving: boolean
  successMessage: string | null
  isSendingVerification: boolean
  verificationMessage: string | null
}

const initialState: ProfileState = {
  ...emptyFormErrors,
  isSaving: false,
  successMessage: null,
  isSendingVerification: false,
  verificationMessage: null,
}

export function useProfile() {
  const { user, updateUser } = useAuth()
  const [state, setState] = useState<ProfileState>(initialState)

  const saveProfile = useCallback(
    (data: UpdateProfileRequest) => {
      setState((s) => ({ ...s, isSaving: true, fieldErrors: {}, formError: null, successMessage: null }))

      void profileService
        .updateProfile(data)
        .then((updatedUser) => {
          updateUser(updatedUser)
          setState((s) => ({ ...s, ...emptyFormErrors, isSaving: false, successMessage: 'Perfil actualizado correctamente.' }))
        })
        .catch((error: unknown) => {
          setState((s) => ({
            ...s,
            isSaving: false,
            successMessage: null,
            ...toFormError(error, 'No pudimos actualizar tu perfil. Inténtalo de nuevo.'),
          }))
        })
    },
    [updateUser],
  )

  const sendVerification = useCallback(() => {
    setState((s) => ({ ...s, isSendingVerification: true, verificationMessage: null, formError: null }))

    void profileService
      .sendEmailVerification()
      .then((res) => {
        setState((s) => ({ ...s, isSendingVerification: false, verificationMessage: res.message }))
      })
      .catch((error: unknown) => {
        setState((s) => ({
          ...s,
          isSendingVerification: false,
          ...toFormError(error, 'No pudimos enviar el correo de verificación.'),
        }))
      })
  }, [])

  return {
    user,
    ...state,
    saveProfile,
    sendVerification,
  }
}
