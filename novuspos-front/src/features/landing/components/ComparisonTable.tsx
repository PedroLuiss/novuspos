import { comparisonRows } from '@/features/landing/data/landing-data'

const novusposToneClass: Record<string, string> = {
  secondary: 'text-secondary',
  primary: 'text-primary',
  'on-surface': 'text-on-surface',
}

/** Tabla comparativa: NovusPOS Desktop vs POS en nube. */
export function ComparisonTable() {
  return (
    <section className="w-full px-margin py-space-xl max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          ARQUITECTURA DE ESCRITORIO VS POS NUBE
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
          ¿Por qué NovusPOS Desktop no tiene comparación?
        </h2>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left font-body-md text-body-md border-collapse">
          <thead>
            <tr className="bg-surface-container">
              <th className="p-space-md font-label-md text-label-md text-on-surface font-bold">Capacidad Operativa</th>
              <th className="p-space-md font-label-md text-label-md text-primary font-bold bg-primary-fixed/40">
                NovusPOS Desktop v2.4.0
              </th>
              <th className="p-space-md font-label-md text-label-md text-on-surface-variant">
                Sistemas POS en Navegador Web
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-on-surface">
            {comparisonRows.map((row) => (
              <tr key={row.capacity} className="hover:bg-surface-container-low/50">
                <td className="p-space-md font-semibold">{row.capacity}</td>
                <td
                  className={`p-space-md bg-primary-fixed/10 font-bold ${novusposToneClass[row.novusposTone]} ${
                    row.novusposMono ? 'font-mono' : ''
                  }`}
                >
                  {row.novusposWrap ? (
                    <span className="inline-flex items-center gap-space-xs">{row.novuspos}</span>
                  ) : (
                    row.novuspos
                  )}
                </td>
                <td className={`p-space-md text-on-surface-variant ${row.webMono ? 'font-mono' : ''}`}>{row.web}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
