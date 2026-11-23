import type { CSSProperties } from 'react'

/** Icono Material Symbols Outlined (fuente local, idéntico a Stitch). */
export function MS({
  name,
  className,
  filled,
}: {
  name: string
  className?: string
  filled?: boolean
}) {
  const style: CSSProperties | undefined = filled ? { fontVariationSettings: "'FILL' 1" } : undefined
  return (
    <span className={`material-symbols-outlined ${className ?? ''}`} style={style} aria-hidden="true">
      {name}
    </span>
  )
}
