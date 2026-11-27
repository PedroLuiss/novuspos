import { useState } from 'react'
import { requestDesktopDownload } from '@/shared/services/landing/desktopDownload'
import type { LandingCopy, LandingDownload } from '@/shared/services/landing/types'
import { MS } from './HeroHeader'

/** CTA final de conversión con gradiente y textos configurables. */
export function FinalCta({ section, download }: { section: LandingCopy['finalCta']; download: LandingDownload | null }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    if (!download?.url) return
    setIsDownloading(true)
    void requestDesktopDownload(download.fileName).finally(() => setIsDownloading(false))
  }

  return (
    <section id="descargar" className="w-full px-margin py-space-xl max-w-7xl mx-auto">
      <div className="w-full rounded-2xl bg-gradient-to-r from-primary to-on-primary-fixed-variant p-space-xl text-on-primary text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-surface-tint/20 rounded-full blur-2xl pointer-events-none" />
        <span className="font-label-sm text-label-sm text-secondary-fixed uppercase font-bold tracking-widest mb-space-xs">
          {section.eyebrow}
        </span>
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight mb-space-md max-w-2xl">{section.title}</h2>
        <p className="font-body-lg text-body-lg text-primary-fixed max-w-xl mb-space-xl">{section.description}</p>
        <div className="flex flex-col sm:flex-row items-center gap-space-md">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-space-xl py-space-md rounded-lg bg-surface-container-lowest text-primary font-headline-sm font-bold shadow-xl cta-shimmer-btn group active:scale-95 inline-flex items-center gap-space-sm disabled:opacity-70"
          >
            <MS name={isDownloading ? 'progress_activity' : 'download'} className={`text-[26px] transition-transform ${isDownloading ? 'animate-spin' : 'cta-download-icon'}`} />
            <span>{isDownloading ? 'Preparando descarga…' : section.button}</span>
          </button>
          <span className="font-label-sm text-label-sm text-primary-fixed font-mono">
            {download ? `${section.note} · ${download.fileName}` : section.note}
          </span>
        </div>
      </div>
    </section>
  )
}
