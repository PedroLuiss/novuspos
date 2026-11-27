import { useAuth } from '@/shared/hooks/useAuth'
import type { LandingCopy, LandingLogo, LandingSectionId } from '@/shared/services/landing/types'

/** Header fijo del sitio; el logo y los enlaces los configura el dueño. */
export function SiteHeader({
  header,
  logo,
  visibleSections,
}: {
  header: LandingCopy['header']
  logo: LandingLogo
  visibleSections: LandingSectionId[]
}) {
  const { isAuthenticated, logout } = useAuth()
  const linkClass =
    'font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs px-space-sm'
  const visible = (id: LandingSectionId) => visibleSections.includes(id)

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-margin flex items-center justify-between">
        <a href="#inicio" className="flex items-center">
          <img alt={logo.alt} className="h-9 w-auto max-w-[180px] object-contain" src={logo.src} />
        </a>
        <nav className="hidden xl:flex items-center gap-space-lg">
          {visible('features') && <a className={linkClass} href="#caracteristicas">{header.features}</a>}
          {visible('products') && <a className={linkClass} href="#productos">{header.products}</a>}
          {visible('pricing') && <a className={linkClass} href="#precios">{header.pricing}</a>}
          <a className={linkClass} href="#inicio">{header.docs}</a>
        </nav>
        {isAuthenticated ? (
          <div className="flex items-center gap-space-xs">
            <a
              className="inline-flex items-center justify-center font-label-md text-label-md px-space-md py-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors"
              href="/panel"
            >
              Ir al panel
            </a>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center justify-center font-label-md text-label-md px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <a
            className="inline-flex items-center justify-center font-label-md text-label-md px-space-md py-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors"
            href="/auth/login"
          >
            {header.login}
          </a>
        )}
      </div>
    </header>
  )
}
