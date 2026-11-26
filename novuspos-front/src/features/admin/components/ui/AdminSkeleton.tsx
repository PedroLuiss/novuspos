import type { ReactNode } from 'react'

/** Bloques MD3 reutilizables para los estados de carga del panel maestro. */

export function AdminSkeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-surface-container ${className}`} />
}

/** Líneas de texto con anchos distintos para evitar un bloque demasiado rígido. */
export function AdminSkeletonLines({ widths = ['92%', '74%', '58%'] }: { widths?: string[] }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {widths.map((width, index) => (
        <div
          key={`${width}-${index}`}
          aria-hidden="true"
          className="h-3 animate-pulse rounded-lg bg-surface-container"
          style={{ width }}
        />
      ))}
    </div>
  )
}

export function AdminSkeletonHeader() {
  return (
    <div className="flex flex-col gap-space-sm">
      <AdminSkeleton className="h-3 w-24" />
      <AdminSkeleton className="h-8 w-72 max-w-full" />
      <AdminSkeleton className="h-3 w-full max-w-xl" />
    </div>
  )
}

export function AdminSkeletonMetricGrid({ count = 4 }: { count?: number }) {
  const columns = count === 3 ? 'sm:grid-cols-3' : count === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-4'
  return (
    <div className={`grid grid-cols-1 gap-space-sm ${columns}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-space-sm rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-space-md py-space-sm">
          <AdminSkeleton className="h-3 w-24" />
          <AdminSkeleton className="h-7 w-16" />
          <AdminSkeleton className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  )
}

export function AdminSkeletonCard({
  className = '',
  rows = 3,
  children,
}: {
  className?: string
  rows?: number
  children?: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-space-sm rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-space-md ${className}`} aria-hidden="true">
      <div className="flex items-center gap-space-xs">
        <AdminSkeleton className="h-9 w-9 rounded-xl" />
        <div className="flex flex-1 flex-col gap-2">
          <AdminSkeleton className="h-3.5 w-40" />
          <AdminSkeleton className="h-2.5 w-56 max-w-full" />
        </div>
      </div>
      {children ?? (
        <div className="flex flex-col gap-2 pt-space-xs">
          {Array.from({ length: rows }, (_, index) => (
            <AdminSkeletonLines key={index} widths={index % 2 === 0 ? ['80%', '62%'] : ['70%', '88%']} />
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminSkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-space-xs" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-space-sm rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-space-sm">
          <AdminSkeleton className="h-9 w-9 shrink-0 rounded-xl" />
          <AdminSkeletonLines widths={['48%', '72%']} />
        </div>
      ))}
    </div>
  )
}

export function AdminSkeletonTable({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  const template = `repeat(${columns}, minmax(0, 1fr))`
  return (
    <div className="flex flex-col gap-2 overflow-hidden" aria-hidden="true">
      <div className="grid gap-3 rounded-xl bg-surface-container-low/70 p-space-sm" style={{ gridTemplateColumns: template }}>
        {Array.from({ length: columns }, (_, index) => (
          <AdminSkeleton key={index} className="h-3 w-20 max-w-full" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-3 px-space-sm py-space-xs" style={{ gridTemplateColumns: template }}>
          {Array.from({ length: columns }, (_, column) => (
            <AdminSkeleton key={column} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Contenedor con semántica de carga y ancho completo para cada módulo. */
export function AdminSkeletonPage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-lg" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
