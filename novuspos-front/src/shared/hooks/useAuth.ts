import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '@/shared/context/auth-context'

/** Acceso a la sesión global; falla temprano si el provider no está montado. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return context
}
