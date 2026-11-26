import { useState } from 'react'
import { navigate } from '@/shared/router/navigation'
import { adminSessionStore } from '../lib/adminSession'
import { adminService } from '../services/adminService'
import type { AdminSession } from '../types'

/** Sesión aislada del dueño: no usa el AuthContext del cliente. */
export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(() => adminSessionStore.read())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const next = await adminService.login(email, password)
      adminSessionStore.save(next)
      setSession(next)
      navigate('/administracion', { replace: true })
    } catch {
      setError('No pudimos verificar tus credenciales. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = () => {
    adminSessionStore.clear()
    setSession(null)
    navigate('/auth/login', { replace: true })
  }

  return { session, isSubmitting, error, login, logout }
}
