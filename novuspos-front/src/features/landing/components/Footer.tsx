import type { LandingCopy, LandingLogo } from '@/shared/services/landing/types'

/** Pie de página: logo, textos y columnas editables por el dueño. */
export function Footer({ footer, logo }: { footer: LandingCopy['footer']; logo: LandingLogo }) {
  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(0,0,0,0.03)] py-space-xl">
      <div className="w-full px-margin">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-space-lg pb-space-xl">
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <img alt={logo.alt} className="h-8 w-auto max-w-[220px] object-contain" src={logo.src} />
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{footer.description}</p>
          </div>
          {footer.columns.map((column, index) => (
            <div key={`${column.title}-${index}`} className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold mb-space-xs">
                {column.title}
              </span>
              {column.links.map((label) => (
                <a
                  key={label}
                  href="#inicio"
                  className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <span className="font-body-sm text-body-sm text-on-surface-variant">{footer.legal}</span>
          <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              {footer.status}
            </span>
            <span>{footer.currency}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
