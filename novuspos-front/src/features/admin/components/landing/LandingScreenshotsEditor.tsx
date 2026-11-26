import type { LandingScreenshot } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'
import { adminCompactButton } from '../../lib/adminStyles'
import { LandingField } from './LandingField'

/** Capturas del carrusel: ruta local, texto alternativo y orden de aparición. */
export function LandingScreenshotsEditor({
  screenshots,
  onChange,
}: {
  screenshots: LandingScreenshot[]
  onChange: (slides: LandingScreenshot[]) => void
}) {
  const update = (index: number, changes: Partial<LandingScreenshot>) => {
    onChange(screenshots.map((slide, position) => (position === index ? { ...slide, ...changes } : slide)))
  }
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= screenshots.length) return
    const next = [...screenshots]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 p-space-sm font-body-sm text-body-sm text-on-surface-variant">
        Sube la imagen a <code className="font-mono">public/imagen/</code> y escribe su ruta, por ejemplo <code className="font-mono">/imagen/mi-captura.png</code>. Usa «cover» para imágenes altas.
      </div>
      {screenshots.map((slide, index) => (
        <div key={`${slide.src}-${index}`} className="flex flex-col gap-space-xs rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
          <div className="flex items-center justify-between gap-space-xs">
            <span className="truncate font-label-sm text-label-sm font-bold text-primary">Captura {index + 1}</span>
            <div className="flex gap-1">
              <button type="button" aria-label="Subir captura" className={adminCompactButton} disabled={index === 0} onClick={() => move(index, -1)}>
                <MS name="arrow_upward" className="text-[14px]" />
              </button>
              <button type="button" aria-label="Bajar captura" className={adminCompactButton} disabled={index === screenshots.length - 1} onClick={() => move(index, 1)}>
                <MS name="arrow_downward" className="text-[14px]" />
              </button>
              <button type="button" aria-label="Eliminar captura" className={adminCompactButton} onClick={() => onChange(screenshots.filter((_, position) => position !== index))}>
                <MS name="delete_outline" className="text-[14px]" />
              </button>
            </div>
          </div>
          <LandingField label="Ruta de la imagen" value={slide.src} onChange={(src) => update(index, { src })} />
          <LandingField label="Texto alternativo" value={slide.alt} multiline rows={2} onChange={(alt) => update(index, { alt })} />
          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Ajuste</span>
            <select
              value={slide.fit}
              onChange={(event) => update(index, { fit: event.target.value === 'cover' ? 'cover' : 'contain' })}
              className="h-11 w-full rounded-xl border border-outline-variant/70 bg-surface-container-lowest px-space-sm font-body-md text-body-md text-on-surface outline-none focus:border-primary"
            >
              <option value="contain">Completa (sin recortar)</option>
              <option value="cover">Llenar (recorta abajo)</option>
            </select>
          </label>
        </div>
      ))}
      <button
        type="button"
        className={adminCompactButton}
        onClick={() => onChange([...screenshots, { src: '/imagen/nueva-captura.png', alt: 'Captura del sistema NovusPOS', fit: 'contain' }])}
      >
        <MS name="add" className="text-[15px]" /> Agregar captura
      </button>
    </div>
  )
}
