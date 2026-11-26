import type { ReactNode } from 'react'

const COLORS = ['bg-primary', 'bg-secondary-fixed-dim', 'bg-primary-fixed-dim', 'bg-outline-variant']

/** Leyenda con barras relativas; los porcentajes salen de los datos reales. */
export function planDonutLegend(data: { planName: string; count: number }[], total: number): ReactNode {
  if (data.length === 0) return <span className="font-body-sm text-body-sm text-on-surface-variant">Sin planes registrados.</span>

  const max = Math.max(1, ...data.map((item) => item.count))
  return data.map((item, index) => (
    <div key={item.planName} className="flex flex-col gap-space-xs">
      <div className="flex items-center justify-between gap-space-xs font-body-sm text-body-sm">
        <span className="flex items-center gap-space-xs font-semibold text-on-surface">
          <span className={`h-2.5 w-2.5 rounded-full ${COLORS[index % COLORS.length]}`} />
          {item.planName}
        </span>
        <span className="font-mono text-on-surface-variant">{item.count} · {total ? Math.round((item.count / total) * 100) : 0}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-container">
        <div className={`h-full rounded-full ${COLORS[index % COLORS.length]}`} style={{ width: `${(item.count / max) * 100}%` }} />
      </div>
    </div>
  ))
}
