/** Gráfica de dona con la distribución real de planes vendidos. */
const COLORS = ['#003ec7', '#6cf8bb', '#b7c4ff', '#c3c5d9']

export function PlanDonut({ data, total }: { data: { planName: string; count: number }[]; total: number }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const { segments } = data.reduce<{
    offset: number
    segments: { planName: string; count: number; length: number; offset: number; color: string }[]
  }>((acc, item, index) => {
    const length = total > 0 ? (item.count / total) * circumference : 0
    return {
      offset: acc.offset + length,
      segments: [...acc.segments, { ...item, length, offset: acc.offset, color: COLORS[index % COLORS.length] }],
    }
  }, { offset: 0, segments: [] })

  return (
    <div className="relative h-44 w-44 shrink-0" aria-label={`Distribución de ${total} suscripciones por plan`}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#eceef0" strokeWidth="16" />
        {segments.map((segment) => (
          <circle
            key={segment.planName}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="16"
            strokeDasharray={`${Math.max(segment.length - 3, 0)} ${circumference}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline-md text-headline-md font-bold leading-none text-on-surface">{total}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">suscripciones</span>
      </div>
    </div>
  )
}
