import { useState, type ReactNode } from 'react'
import { TRUST_BADGE_ICONS } from '@/shared/services/landing/defaults'
import { requestDesktopDownload } from '@/shared/services/landing/desktopDownload'
import type { LandingCopy, LandingDownload } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'

export { MS }

/** Cabecera del Hero en dos columnas: texto configurable a la izquierda y capturas a la derecha. */
export function HeroHeader({ hero, download, children }: { hero: LandingCopy['hero']; download: LandingDownload | null; children: ReactNode }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    if (!download?.url) {
      document.getElementById('descargar')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setIsDownloading(true)
    void requestDesktopDownload(download.fileName).finally(() => setIsDownloading(false))
  }

  return (
    <section className="relative w-full px-margin pt-space-xl pb-space-xl max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-space-xl">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="font-display text-display text-on-surface max-w-4xl tracking-tight leading-none mb-space-md">
            {hero.headlineLead}
            <span className="text-primary">{hero.headlineAccent}</span>
            {hero.headlineTail}
          </h1>

          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container mb-space-md">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">{hero.sloganLabel}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">{hero.slogan}</span>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-space-xl">{hero.description}</p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-space-md w-full max-w-md mb-space-lg">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-space-sm px-space-lg py-space-md rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-xl cta-shimmer-btn group active:scale-95 disabled:opacity-70"
            >
              <MS name={isDownloading ? 'progress_activity' : 'download'} className={`text-[24px] transition-transform ${isDownloading ? 'animate-spin' : 'cta-download-icon'}`} />
              <span className="flex flex-col text-left">
                <span>{isDownloading ? 'Preparando descarga…' : hero.primaryCta}</span>
                <span className="font-label-sm text-label-sm text-on-primary/80 font-normal">{hero.primaryCtaNote}</span>
              </span>
            </button>
            <a
              href="#interfaz-en-vivo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors"
            >
              <MS name="play_circle" className="text-[20px]" />
              <span>{hero.secondaryCta}</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-space-md text-on-surface-variant pt-space-xs">
            {hero.trustBadges.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="inline-flex items-center gap-space-xs font-label-md text-label-md bg-surface-container-low px-space-md py-space-xs rounded-full"
              >
                <MS name={TRUST_BADGE_ICONS[index] ?? 'verified'} className={`${index % 2 === 0 ? 'text-primary' : 'text-secondary'} text-[18px]`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center lg:justify-end">{children}</div>
      </div>
    </section>
  )
}
