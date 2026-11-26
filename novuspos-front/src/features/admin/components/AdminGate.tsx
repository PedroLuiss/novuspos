import { useEffect, type ReactNode } from 'react'
import { navigate } from '@/shared/router/navigation'
import { getAdminLoginPath } from '../lib/adminSettings'
import { adminSessionStore } from '../lib/adminSession'
import { AdminGateSkeleton } from './ui/AdminModuleSkeletons'

/** Guardián independiente: exige la sesión del dueño, nunca la del cliente. */
export function AdminGate({ children }: { children: ReactNode }) {
  const session = adminSessionStore.read()

  useEffect(() => {
    if (!session) navigate(getAdminLoginPath(), { replace: true })
  }, [session])

  if (!session) return <AdminGateSkeleton />

  return <>{children}</>
}
