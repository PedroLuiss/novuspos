import { createContext } from 'react'
import type { AuthUser, AuthUserUpdate } from '@/shared/lib/auth-types'

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
  updateUser: (partialUser: AuthUserUpdate) => void
}

/** Definición aislada para que `AuthContext.tsx` solo exporte componentes. */
export const AuthContext = createContext<AuthContextValue | null>(null)
