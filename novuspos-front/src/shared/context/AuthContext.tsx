import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'
import { sessionStore, type SessionStore } from '@/shared/lib/auth-storage'
import type { AuthSession, AuthUser } from '@/shared/lib/auth-types'
import { clearUnauthorizedHandler, setUnauthorizedHandler } from '@/shared/services/apiClient'

interface AuthProviderProps {
  children: ReactNode
  onUnauthorized?: () => void
  /** Inyectable para pruebas o almacenamiento alternativo (DIP). */
  store?: SessionStore
}

/** Hidrata la sesión de forma síncrona para evitar parpadeos al recargar. */
export function AuthProvider({ children, onUnauthorized, store = sessionStore }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const token = store.getToken()
    const user = store.getUser()
    return token && user ? { token, user } : null
  })
  /**
   * La sesión se hidrata de forma síncrona desde el almacenamiento local.
   * El indicador global de peticiones HTTP no debe afectar al guardián de rutas:
   * si se usara, cada petición de una página desmontaría sus propios efectos.
   */
  const isLoading = false

  useEffect(() => {
    setUnauthorizedHandler(() => {
      store.clear()
      setSession(null)
      onUnauthorized?.()
    })
    return clearUnauthorizedHandler
  }, [store, onUnauthorized])

  const login = useCallback(
    (token: string, user: AuthUser) => {
      const next = { token, user }
      store.save(next)
      setSession(next)
    },
    [store],
  )

  const logout = useCallback(() => {
    store.clear()
    setSession(null)
  }, [store])

  const updateUser = useCallback(
    (partialUser: Partial<AuthUser>) => {
      setSession((current) => {
        if (!current) return current
        const next: AuthSession = { ...current, user: { ...current.user, ...partialUser } }
        store.save(next)
        return next
      })
    },
    [store],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token && session?.user),
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [session, isLoading, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
