/** Header fijo del sitio — idéntico a Stitch. */
export function SiteHeader() {
  const logoUrl = '/novuspos-logo.png'

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <a href="#inicio" className="flex items-center">
            <img alt="NovusPOS Logo" className="h-9 w-auto object-contain" src={logoUrl} />
          </a>
        </div>
        <nav className="hidden xl:flex items-center gap-space-lg">
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs px-space-sm"
            href="#caracteristicas"
          >
            Características
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs px-space-sm"
            href="#productos"
          >
            Productos
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs px-space-sm"
            href="#precios"
          >
            Precios
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs px-space-sm"
            href="#inicio"
          >
            Documentación
          </a>
        </nav>
        <div className="flex items-center gap-space-md">
          <a
            className="inline-flex items-center justify-center font-label-md text-label-md px-space-md py-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors"
            href="#inicio"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </header>
  )
}
