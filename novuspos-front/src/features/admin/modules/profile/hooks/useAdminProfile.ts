import { useCallback, useEffect, useState } from 'react'
import { adminSessionStore } from '@/features/admin/core/lib/adminSession'
import { adminService } from '@/features/admin/core/services/adminService'
import type { AdminProfile } from '@/features/admin/core/types'
import { ApiError, ValidationError, type ValidationIssues } from '@/shared/services/apiClient'

interface FormState {
  isSaving: boolean
  isChangingPassword: boolean
  fieldErrors: ValidationIssues
  formError: string | null
  successMessage: string | null
  passwordSuccess: string | null
}

const initial: FormState = {
  isSaving: false,
  isChangingPassword: false,
  fieldErrors: {},
  formError: null,
  successMessage: null,
  passwordSuccess: null,
}

function toFormError(error: unknown, fallback: string) {
  if (error instanceof ValidationError) return { fieldErrors: error.issues ?? {}, formError: error.message }
  if (error instanceof ApiError) return { fieldErrors: {}, formError: error.message }
  return { fieldErrors: {}, formError: fallback }
}

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<FormState>(initial)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.getProfile()
      setProfile(data)
    } catch (error) {
      setState((s) => ({ ...s, ...toFormError(error, 'No pudimos cargar el perfil.') }))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const saveProfile = useCallback(async (data: AdminProfile) => {
    setState((s) => ({ ...s, isSaving: true, fieldErrors: {}, formError: null, successMessage: null }))
    try {
      const saved = await adminService.updateProfile(data)
      setProfile(saved)
      const session = adminSessionStore.read()
      if (session) adminSessionStore.save({ ...session, name: saved.name, email: saved.email })
      setState((s) => ({ ...s, isSaving: false, fieldErrors: {}, formError: null, successMessage: 'Perfil actualizado correctamente.' }))
    } catch (error) {
      setState((s) => ({ ...s, isSaving: false, successMessage: null, ...toFormError(error, 'No pudimos actualizar el perfil.') }))
    }
  }, [])

  const changePassword = useCallback(async (payload: { currentPassword: string; password: string; passwordConfirmation: string }) => {
    if (payload.password.length < 8 || payload.password.length > 10) {
      setState((s) => ({ ...s, fieldErrors: { password: ['La contraseña debe tener entre 8 y 10 caracteres.'] }, formError: null, passwordSuccess: null }))
      return
    }
    if (payload.password !== payload.passwordConfirmation) {
      setState((s) => ({ ...s, fieldErrors: { passwordConfirmation: ['Las contraseñas no coinciden.'] }, formError: null, passwordSuccess: null }))
      return
    }

    setState((s) => ({ ...s, isChangingPassword: true, fieldErrors: {}, formError: null, passwordSuccess: null }))
    try {
      const res = await adminService.updatePassword(payload)
      setState((s) => ({ ...s, isChangingPassword: false, fieldErrors: {}, formError: null, passwordSuccess: res.message }))
    } catch (error) {
      setState((s) => ({ ...s, isChangingPassword: false, passwordSuccess: null, ...toFormError(error, 'No pudimos cambiar la contraseña.') }))
    }
  }, [])

  return { profile, loading, ...state, saveProfile, changePassword }
}
