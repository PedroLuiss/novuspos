import { useRef, useState } from 'react'
import { ACCEPTED_IMAGE_TYPES, prepareImage } from '@/shared/lib/imageUpload'
import type { LandingScreenshot } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'
import { adminCompactButton } from '../../lib/adminStyles'
import { AdminAlert } from '../ui/AdminUi'
import { LandingField } from './LandingField'

const ACCEPT = ACCEPTED_IMAGE_TYPES.join(',')

function altFromName(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  return base ? `Captura del sistema: ${base}` : 'Captura del sistema NovusPOS'
}

function shortName(slide: LandingScreenshot, index: number): string {
  if (slide.name) return slide.name
  if (slide.src.startsWith('data:')) return `Captura ${index + 1}`
  return slide.src.split('/').filter(Boolean).pop() ?? `Captura ${index + 1}`
}

/** Carrusel de capturas: el dueño sube imágenes desde su computadora, sin escribir rutas. */
export function LandingScreenshotsEditor({
  screenshots,
  onChange,
}: {
  screenshots: LandingScreenshot[]
  onChange: (slides: LandingScreenshot[]) => void
}) {
  const addInput = useRef<HTMLInputElement>(null)
  const replaceInput = useRef<HTMLInputElement>(null)
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prepare = async (file: File) => {
    setBusy(true)
    setError(null)
    try {
      return await prepareImage(file, { maxEdge: 1920, quality: 0.86 })
    } finally {
      setBusy(false)
    }
  }

  const add = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    try {
      const added: LandingScreenshot[] = []
      for (const file of Array.from(files)) {
        const image = await prepare(file)
        added.push({ src: image.dataUrl, name: image.name, alt: altFromName(image.name), fit: 'contain' })
      }
      onChange([...screenshots, ...added])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos subir las imágenes.')
    }
  }

  const replace = async (index: number, file: File | undefined) => {
    if (!file) return
    try {
      const image = await prepare(file)
      onChange(
        screenshots.map((slide, position) =>
          position === index ? { ...slide, src: image.dataUrl, name: image.name } : slide,
        ),
      )
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos subir la imagen.')
    }
  }

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
      <input
        ref={addInput}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          void add(event.target.files)
          event.target.value = ''
        }}
      />
      <input
        ref={replaceInput}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          const index = replacingIndex
          event.target.value = ''
          setReplacingIndex(null)
          if (file && index !== null) void replace(index, file)
        }}
      />

      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 p-space-sm font-body-sm text-body-sm text-on-surface-variant">
        Elige una o varias capturas desde tu computadora. Se ajustan automáticamente y se guardan con la landing; no necesitas subirlas a ningún sitio. JPG, PNG o WEBP hasta 8 MB.
      </div>

      {error && <AdminAlert>{error}</AdminAlert>}

      {screenshots.map((slide, index) => (
        <div key={`${slide.name ?? slide.src.slice(0, 32)}-${index}`} className="flex flex-col gap-space-xs rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
          <div className="flex items-center justify-between gap-space-xs">
            <span className="truncate font-label-sm text-label-sm font-bold text-primary">Captura {index + 1}</span>
            <div className="flex gap-1">
              <button type="button" aria-label="Subir captura" className={adminCompactButton} disabled={busy || index === 0} onClick={() => move(index, -1)}>
                <MS name="arrow_upward" className="text-[14px]" />
              </button>
              <button type="button" aria-label="Bajar captura" className={adminCompactButton} disabled={busy || index === screenshots.length - 1} onClick={() => move(index, 1)}>
                <MS name="arrow_downward" className="text-[14px]" />
              </button>
              <button type="button" aria-label="Eliminar captura" className={adminCompactButton} disabled={busy} onClick={() => onChange(screenshots.filter((_, position) => position !== index))}>
                <MS name="delete_outline" className="text-[14px]" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-space-sm rounded-lg bg-surface-container-low p-space-xs">
            <img src={slide.src} alt="" className="h-14 w-20 shrink-0 rounded bg-white object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate font-label-sm text-label-sm font-semibold text-on-surface">{shortName(slide, index)}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {slide.src.startsWith('data:') ? 'Imagen subida' : 'Imagen incluida en el sitio'}
              </span>
            </div>
            <button
              type="button"
              className={adminCompactButton}
              disabled={busy}
              onClick={() => {
                setReplacingIndex(index)
                replaceInput.current?.click()
              }}
            >
              <MS name="upload_file" className="text-[14px]" /> Cambiar
            </button>
          </div>

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
        disabled={busy}
        onClick={() => addInput.current?.click()}
      >
        <MS name={busy ? 'progress_activity' : 'add_photo_alternate'} className={`text-[15px] ${busy ? 'animate-spin' : ''}`} />
        {busy ? 'Preparando imágenes…' : 'Subir capturas'}
      </button>
    </div>
  )
}
