import { SECTION_LABELS } from '@/shared/services/landing/defaults'
import type { LandingSectionId, LandingSectionState } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'
import { adminCompactButton } from '../../lib/adminStyles'
import { AdminBadge } from '../ui/AdminUi'

interface Props {
  sections: LandingSectionState[]
  onChange: (sections: LandingSectionState[]) => void
  onToggle: (id: LandingSectionId) => void
  onMove: (id: LandingSectionId, direction: -1 | 1) => void
}

/** Orden y visibilidad de secciones: el header = hero y el pie no se pueden ocultar. */
export function LandingSectionsEditor({ sections, onChange, onToggle, onMove }: Props) {
  return (
    <div className="flex flex-col gap-space-sm">
      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 p-space-sm font-body-sm text-body-sm text-on-surface-variant">
        El encabezado, el hero y el pie están siempre presentes. El resto se muestra en el orden que elijas y los enlaces del menú se ocultan con su sección.
      </div>
      <div className="flex flex-col gap-space-xs">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center gap-space-xs rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
            <span className="w-6 shrink-0 text-center font-label-sm text-label-sm font-mono text-outline">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-label-md text-label-md font-semibold text-on-surface">{SECTION_LABELS[section.id]}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {section.visible ? 'Visible en la landing' : 'Oculta temporalmente'}
              </span>
            </div>
            <AdminBadge tone={section.visible ? 'success' : 'neutral'}>{section.visible ? 'Sí' : 'No'}</AdminBadge>
            <button type="button" aria-label="Subir sección" className={adminCompactButton} disabled={index === 0} onClick={() => onMove(section.id, -1)}>
              <MS name="arrow_upward" className="text-[14px]" />
            </button>
            <button type="button" aria-label="Bajar sección" className={adminCompactButton} disabled={index === sections.length - 1} onClick={() => onMove(section.id, 1)}>
              <MS name="arrow_downward" className="text-[14px]" />
            </button>
            <button type="button" className={adminCompactButton} onClick={() => onToggle(section.id)}>
              <MS name={section.visible ? 'visibility_off' : 'visibility'} className="text-[14px]" />
              {section.visible ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={adminCompactButton}
        onClick={() => onChange(sections.map((section) => ({ ...section, visible: true })))}
      >
        <MS name="visibility" className="text-[15px]" /> Mostrar todas
      </button>
    </div>
  )
}
