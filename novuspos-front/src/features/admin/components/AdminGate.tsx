import { useEffect, type ReactNode } from 'react'
import { MS } from '@/shared/ui/MS'
import { getAdminLoginPath } from '../lib/adminSettings'
import { adminSessionStore } from '../lib/adminSession'

/** Guardián independiente: exige la sesión del dueño, nunca la del cliente. */
export function AdminGate({ children }: { children: ReactNode }) {
  const session = adminSessionStore.read()

  useEffect(() => {
    if (!session) window.location.replace(getAdminLoginPath())
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-surface">
        <MS name="progress_activity" className="animate-spin text-primary text-3xl" />
        <span className="font-body-md text-body-md text-on-surface-variant">Abriendo el panel del dueño…</span>
      </div>
    )
  }

  return <>{children}</>
}
