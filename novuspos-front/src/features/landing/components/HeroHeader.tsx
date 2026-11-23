import type { ReactNode } from 'react'

/** Icono Material Symbols Outlined (idéntico a Stitch). */
export function MS({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className ?? ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

/** Píldora de versión de release. */
export function ReleasePill() {
  return (
    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high shadow-sm mb-space-lg">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
        ⚡ NUEVA VERSIÓN 2.4.0 • ARQUITECTURA OFFLINE-FIRST
      </span>
    </div>
  )
}

/** Copy verificado contra `novus-post/docs/context/`: sin "x64" (no documentado)
 *  ni "sin caídas por internet" (bootstrap, OTP, reportes y BCV sí requieren red). */
const trustBadges = [
  { icon: 'terminal', tone: 'text-primary', label: 'Instalador nativo para Windows' },
  { icon: 'storage', tone: 'text-secondary', label: 'Base de datos SQLite local' },
  { icon: 'wifi_off', tone: 'text-primary', label: 'Núcleo offline-first' },
  { icon: 'verified', tone: 'text-secondary', label: 'Primer mes $0 USD' },
]

/**
 * Cabecera del Hero en dos columnas (desktop): propuesta de valor a la
 * izquierda y carrusel de capturas arriba a la derecha. En móvil se apila,
 * con las capturas debajo del texto.
 */
export function HeroHeader({ children }: { children: ReactNode }) {
  return (
    <section className="relative w-full px-margin pt-space-xl pb-space-xl max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-space-xl">
        {/* Columna izquierda: copy, CTAs y sellos de confianza */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <ReleasePill />

          <h1 className="font-display text-display text-on-surface max-w-4xl tracking-tight leading-none mb-space-md">
            El Punto de Venta de escritorio para Windows{' '}
            <span className="text-primary">rápido, confiable</span> y con núcleo offline-first
          </h1>

          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container mb-space-md">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">Lema oficial:</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              NovusPOS — Diseñado para crecer contigo
            </span>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-space-xl">
            Cobro, inventario y caja sobre SQLite local con transacciones atómicas. El núcleo opera sin internet; el
            primer ingreso, la recuperación OTP, los reportes y las tasas BCV sí lo requieren. Lectura de básculas
            RS-232 (Torrey, Rhino y Dibal, pendiente de validación física), tickets PDF 80/58mm y catálogo paginado
            para inventarios densos.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-space-md w-full max-w-md mb-space-lg">
            <a
              href="#descargar"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-space-sm px-space-lg py-space-md rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-xl cta-shimmer-btn group active:scale-95"
            >
              <MS name="download" className="text-[24px] cta-download-icon transition-transform" />
              <span className="flex flex-col text-left">
                <span>Descargar para Windows</span>
                <span className="font-label-sm text-label-sm text-on-primary/80 font-normal">
                  v2.4.0 (.exe) • ~85 MB • 30 Días Gratis
                </span>
              </span>
            </a>
            <a
              href="#interfaz-en-vivo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors"
            >
              <MS name="play_circle" className="text-[20px]" />
              <span>Ver capturas del sistema</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-space-md text-on-surface-variant pt-space-xs">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="inline-flex items-center gap-space-xs font-label-md text-label-md bg-surface-container-low px-space-md py-space-xs rounded-full"
              >
                <MS name={badge.icon} className={`${badge.tone} text-[18px]`} />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: capturas reales del sistema */}
        <div className="flex w-full justify-center lg:justify-end">{children}</div>
      </div>
    </section>
  )
}
