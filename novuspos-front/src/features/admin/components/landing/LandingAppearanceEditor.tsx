import { LANDING_DEFAULTS } from '@/shared/services/landing/defaults'
import { themeToStyle } from '@/shared/services/landing/landingPreview'
import type { LandingTheme } from '@/shared/services/landing/types'
import { FieldGroup, LandingField } from './LandingField'

const colorFields: { key: keyof LandingTheme; label: string; hint: string }[] = [
  { key: 'primary', label: 'Color principal', hint: 'Botones, enlaces y acentos.' },
  { key: 'primaryContainer', label: 'Contenedor principal', hint: 'Toque secundario del azul de marca.' },
  { key: 'secondary', label: 'Color de apoyo', hint: 'Aprobaciones, ventajas y mensajes de éxito.' },
  { key: 'surface', label: 'Fondo', hint: 'Color base de toda la página.' },
  { key: 'onSurface', label: 'Texto', hint: 'Color del texto principal sobre el fondo.' },
]

/** Colores MD3 editables con muestra inmediata en la vista previa. */
export function LandingAppearanceEditor({
  theme,
  onChange,
}: {
  theme: LandingTheme
  onChange: (changes: Partial<LandingTheme>) => void
}) {
  return (
    <div className="flex flex-col gap-space-sm">
      <FieldGroup title="Paleta de marca" description="Los cambios se ven en la vista previa al instante.">
        {colorFields.map((field) => (
          <div key={field.key} className="flex items-end gap-space-xs">
            <input
              type="color"
              aria-label={`Selector de ${field.label.toLowerCase()}`}
              value={/^#[0-9a-f]{6}$/i.test(theme[field.key]) ? theme[field.key] : '#000000'}
              onChange={(event) => onChange({ [field.key]: event.target.value })}
              className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-outline-variant/60 bg-transparent p-0.5"
            />
            <div className="min-w-0 flex-1">
              <LandingField
                label={field.label}
                value={theme[field.key]}
                hint={field.hint}
                onChange={(value) => onChange({ [field.key]: value.trim() })}
              />
            </div>
          </div>
        ))}
      </FieldGroup>

      <FieldGroup title="Así se verá un botón" description="Vista rápida con la paleta elegida.">
        <div className="rounded-xl p-space-md" style={themeToStyle(theme)}>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Texto sobre el fondo elegido</span>
          <div className="mt-space-xs flex items-center gap-space-sm">
            <span className="rounded-lg bg-primary px-space-md py-space-xs font-label-md text-label-md font-bold text-on-primary">
              Descargar para Windows
            </span>
            <span className="font-label-md text-label-md font-bold text-secondary">✓ Beneficio destacado</span>
          </div>
        </div>
      </FieldGroup>

      <button
        type="button"
        className="inline-flex w-fit items-center gap-space-xs rounded-lg border border-outline-variant/70 px-space-sm py-1.5 font-label-sm text-label-sm font-semibold text-on-surface-variant hover:text-primary"
        onClick={() => onChange({ ...LANDING_DEFAULTS.theme })}
      >
        Restaurar colores originales
      </button>
    </div>
  )
}
