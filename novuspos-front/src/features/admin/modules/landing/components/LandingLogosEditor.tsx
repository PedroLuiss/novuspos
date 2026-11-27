import { useRef, useState } from 'react'
import { ACCEPTED_IMAGE_TYPES, prepareImage } from '@/shared/lib/imageUpload'
import { LANDING_DEFAULTS } from '@/shared/services/landing/defaults'
import type { LandingBranding, LandingLogo } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'
import { adminCompactButton } from '@/features/admin/core/lib/adminStyles'
import { AdminAlert } from '@/features/admin/core/ui/AdminUi'
import { FieldGroup, LandingField } from './LandingField'

type LogoSlot = keyof LandingBranding

const ACCEPT = ACCEPTED_IMAGE_TYPES.join(',')

const slots: { key: LogoSlot; title: string; hint: string }[] = [
  {
    key: 'header',
    title: 'Logo del encabezado',
    hint: 'Aparece arriba a la izquierda en todas las páginas de la landing.',
  },
  {
    key: 'footer',
    title: 'Logo del pie',
    hint: 'Aparece al final de la página, junto al texto de tu negocio.',
  },
]

function stateLabel(logo: LandingLogo): string {
  if (logo.src.startsWith('data:')) return 'Logo subido por ti'
  return logo.src === LANDING_DEFAULTS.logos.header.src ? 'Logo original del sitio' : 'Logo del sitio'
}

/** Logos del header y del pie: el dueño sube sus propias imágenes, sin escribir rutas. */
export function LandingLogosEditor({
  logos,
  onChange,
}: {
  logos: LandingBranding
  onChange: (logos: LandingBranding) => void
}) {
  const inputs = useRef<Record<LogoSlot, HTMLInputElement | null>>({ header: null, footer: null })
  const [busySlot, setBusySlot] = useState<LogoSlot | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = (slot: LogoSlot, changes: Partial<LandingLogo>) => {
    onChange({ ...logos, [slot]: { ...logos[slot], ...changes } })
  }

  const upload = async (slot: LogoSlot, file: File | undefined) => {
    if (!file) return
    setBusySlot(slot)
    setError(null)
    try {
      const image = await prepareImage(file, { maxEdge: 1200, quality: 0.9, preserveFormat: true })
      update(slot, { src: image.dataUrl, name: image.name })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos subir el logo.')
    } finally {
      setBusySlot(null)
    }
  }

  const restore = (slot: LogoSlot) => {
    update(slot, { ...LANDING_DEFAULTS.logos[slot], name: undefined })
  }

  return (
    <div className="flex flex-col gap-space-sm">
      {slots.map((slot) => (
        <input
          key={slot.key}
          ref={(element) => { inputs.current[slot.key] = element }}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            void upload(slot.key, file)
          }}
        />
      ))}

      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low/50 p-space-sm font-body-sm text-body-sm text-on-surface-variant">
        Sube tu logo desde la computadora. Funciona mejor una imagen PNG con fondo transparente; también aceptamos JPG y WEBP hasta 8 MB. Puedes usar el mismo logo en ambas zonas o uno distinto en cada una.
      </div>

      {error && <AdminAlert>{error}</AdminAlert>}

      {slots.map((slot) => (
        <FieldGroup key={slot.key} title={slot.title} description={slot.hint}>
          <div className="flex items-center gap-space-sm rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
            <div className="flex h-14 w-36 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-inner">
              <img src={logos[slot.key].src} alt="" className="max-h-12 max-w-full object-contain" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate font-label-sm text-label-sm font-semibold text-on-surface">
                {logos[slot.key].name ?? 'Logo del sitio'}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{stateLabel(logos[slot.key])}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              className={adminCompactButton}
              disabled={busySlot !== null}
              onClick={() => inputs.current[slot.key]?.click()}
            >
              <MS name="upload_file" className="text-[14px]" />
              {busySlot === slot.key ? 'Preparando…' : 'Subir logo'}
            </button>
            <button
              type="button"
              className={adminCompactButton}
              disabled={busySlot !== null}
              onClick={() => restore(slot.key)}
            >
              <MS name="restart_alt" className="text-[14px]" /> Usar el original
            </button>
          </div>

          <LandingField
            label="Texto alternativo"
            value={logos[slot.key].alt}
            hint="Descripción del logo para lectores de pantalla."
            onChange={(alt) => update(slot.key, { alt })}
          />
        </FieldGroup>
      ))}
    </div>
  )
}
