import { useEffect, type ReactNode } from 'react'
import { navigate } from '@/shared/router/navigation'
import { getAdminLoginPath } from '@/features/admin/core/lib/adminSettings'
import { adminSessionStore } from '@/features/admin/core/lib/adminSession'
import { AdminGateSkeleton } from './AdminGateSkeleton'

/** Guardián independiente: exige la sesión del dueño, nunca la del cliente. */
export function AdminGate({ children }: { children: ReactNode }) {
  const session = adminSessionStore.read()

  useEffect(() => {
    if (!session) navigate(getAdminLoginPath(), { replace: true })
  }, [session])

  if (!session) return <AdminGateSkeleton />

  return <>{children}</>
}
