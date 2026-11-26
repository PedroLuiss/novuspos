import type { LandingCopy } from '@/shared/services/landing/types'

const novusposToneClass: Record<string, string> = {
  secondary: 'text-secondary',
  primary: 'text-primary',
  'on-surface': 'text-on-surface',
}
const ROW_TONES = ['secondary', 'primary', 'on-surface', 'on-surface', 'secondary']
const ROW_WRAPS = [true, false, true, true, false]

/** Tabla comparativa configurable: NovusPOS Desktop frente a un POS en navegador. */
export function ComparisonTable({ section }: { section: LandingCopy['comparison'] }) {
  return (
    <section className="w-full px-margin py-space-xl max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          {section.eyebrow}
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{section.title}</h2>
        {section.description && <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">{section.description}</p>}
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left font-body-md text-body-md border-collapse">
          <thead>
            <tr className="bg-surface-container">
              <th className="p-space-md font-label-md text-label-md text-on-surface font-bold">{section.capacityHeader}</th>
              <th className="p-space-md font-label-md text-label-md text-primary font-bold bg-primary-fixed/40">{section.novusposHeader}</th>
              <th className="p-space-md font-label-md text-label-md text-on-surface-variant">{section.webHeader}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-on-surface">
            {section.rows.map((row, index) => (
              <tr key={`${row.capacity}-${index}`} className="hover:bg-surface-container-low/50">
                <td className="p-space-md font-semibold">{row.capacity}</td>
                <td className={`p-space-md bg-primary-fixed/10 font-bold ${novusposToneClass[ROW_TONES[index] ?? 'on-surface']}`}>
                  {ROW_WRAPS[index] ? <span className="inline-flex items-center gap-space-xs">{row.novuspos}</span> : row.novuspos}
                </td>
                <td className="p-space-md text-on-surface-variant">{row.web}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
