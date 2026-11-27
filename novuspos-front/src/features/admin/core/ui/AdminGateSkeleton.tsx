import { AdminSkeleton } from './AdminSkeleton'

/** Pantalla de espera del guardián maestro, con la misma familia visual. */
export function AdminGateSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-space-md bg-surface" role="status" aria-label="Abriendo el panel del dueño…">
      <AdminSkeleton className="h-12 w-12 rounded-full" />
      <AdminSkeleton className="h-3 w-56" />
      <AdminSkeleton className="h-2 w-32" />
    </div>
  )
}
