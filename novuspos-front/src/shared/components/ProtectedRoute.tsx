import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { navigate } from '@/shared/router/navigation'
import { MS } from '@/shared/ui/MS'

/** Skeleton MD3 mostrado mientras se resuelve la sesión o se redirige. */
function AuthSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-space-md bg-surface">
      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
        <MS name="progress_activity" className="animate-spin text-[28px]" />
      </div>
      <div className="w-48 h-2 rounded-full bg-surface-container overflow-hidden">
        <div className="w-1/2 h-full rounded-full bg-primary animate-pulse" />
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant">Preparando tu sesión…</span>
    </div>
  )
}

/** Solo renderiza `children` con una sesión válida. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login', { replace: true })
    }
  }, [isLoading, isAuthenticated])

  if (isLoading || !isAuthenticated) return <AuthSkeleton />

  return <>{children}</>
}
