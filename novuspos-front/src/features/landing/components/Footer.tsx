/** Pie de página — idéntico a Stitch. */
export function Footer() {
  const logoUrl = '/novuspos-logo.png'

  const columns = [
    {
      title: 'Producto',
      links: ['Punto de Venta', 'Básculas y periféricos', 'Cobro rápido', 'Planes y precios'],
    },
    {
      title: 'Ayuda',
      links: ['Guía de uso', 'Centro de ayuda', 'Novedades 2.4.0', 'Preguntas frecuentes'],
    },
    {
      title: 'Legal',
      links: ['Política de Privacidad', 'Términos del Servicio', 'Licencia de uso', 'Protección de datos'],
    },
  ]

  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(0,0,0,0.03)] py-space-xl">
      <div className="w-full px-margin">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-space-lg pb-space-xl">
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <img alt="NovusPOS Logo" className="h-8 w-auto object-contain" src={logoUrl} />
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Diseñado para crecer contigo. Software de punto de venta para comercios que quieren vender, controlar su
              inventario y cerrar el día con confianza.
            </p>
            {/* <div className="flex items-center gap-space-sm mt-space-xs">
              <img alt="NovusPOS Logo" className="h-8 w-auto object-contain" src={logoUrl} />
            </div> */}
          </div>
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold mb-space-xs">
                {col.title}
              </span>
              {col.links.map((label) => (
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
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 NovusPOS Technologies Ltd. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Tu negocio, siempre disponible
            </span>
            <span>Moneda: USD ($4.99/mes)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
