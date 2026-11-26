/** Sincronización en vivo entre el editor del dueño y la landing en un iframe. */
import { LANDING_DEFAULTS } from './defaults'
import { normalizeLandingConfig } from './landingStore'
import type { LandingConfig, LandingTheme } from './types'

export const LANDING_PREVIEW_MESSAGE = 'novuspos:landing-preview'
const STORAGE_KEY = 'novuspos:landing-preview'

export function isLandingPreview(): boolean {
  return new URLSearchParams(window.location.search).get('preview') === '1'
}

export function writePreviewConfig(config: LandingConfig): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // La mensajería directa sigue funcionando aunque el storage esté bloqueado.
  }
}

export function readPreviewConfig(): LandingConfig | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? normalizeLandingConfig(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

/** Guarda en sessionStorage y envía el borrador al iframe sin publicarlo en la landing real. */
export function postPreviewConfig(config: LandingConfig, target: Window | null | undefined): void {
  writePreviewConfig(config)
  if (!target) return
  try {
    target.postMessage({ type: LANDING_PREVIEW_MESSAGE, config }, window.location.origin)
  } catch {
    // Destino cruzado: se ignora; el storage local mantiene la vista previa.
  }
}

export function subscribeToLandingPreview(onConfig: (config: LandingConfig) => void): () => void {
  const handler = (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin) return
    const data = event.data
    if (!data || typeof data !== 'object') return
    const message = data as Record<string, unknown>
    if (message.type !== LANDING_PREVIEW_MESSAGE || !message.config) return
    onConfig(normalizeLandingConfig(message.config))
  }
  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}

function mix(hex: string, percent: number): string {
  return `color-mix(in srgb, ${hex} ${percent}%, white)`
}

function readableOn(hex: string): string {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
  const linear = channels.map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  return luminance > 0.42 ? '#191c1e' : '#ffffff'
}

/** Sobrescribe solo los tokens que el dueño cambió; el resto conserva el MD3 original de Stitch. */
export function themeToStyle(theme: LandingTheme): Record<string, string> {
  const base = LANDING_DEFAULTS.theme
  const style: Record<string, string> = {}

  if (theme.primary !== base.primary) {
    style['--color-primary'] = theme.primary
    style['--color-on-primary'] = readableOn(theme.primary)
    style['--color-on-primary-fixed'] = theme.primary
    style['--color-on-primary-fixed-variant'] = theme.primary
    style['--color-primary-fixed'] = mix(theme.primary, 16)
    style['--color-primary-fixed-dim'] = mix(theme.primary, 32)
    style['--color-surface-tint'] = theme.primary
  }
  if (theme.primaryContainer !== base.primaryContainer) {
    style['--color-primary-container'] = theme.primaryContainer
  }
  if (theme.secondary !== base.secondary) {
    style['--color-secondary'] = theme.secondary
    style['--color-on-secondary'] = readableOn(theme.secondary)
    style['--color-on-secondary-fixed'] = theme.secondary
    style['--color-secondary-container'] = mix(theme.secondary, 26)
    style['--color-secondary-fixed'] = mix(theme.secondary, 16)
  }
  if (theme.surface !== base.surface) {
    style['--color-surface'] = theme.surface
    style['--color-background'] = theme.surface
    style['--color-surface-container-lowest'] = theme.surface
    style['--color-surface-container-low'] = mix(theme.surface, 97)
    style['--color-surface-container'] = mix(theme.surface, 94)
    style['--color-surface-container-high'] = mix(theme.surface, 90)
    style['--color-surface-container-highest'] = mix(theme.surface, 86)
    style['--color-surface-variant'] = mix(theme.surface, 90)
  }
  if (theme.onSurface !== base.onSurface) {
    style['--color-on-surface'] = theme.onSurface
    style['--color-on-background'] = theme.onSurface
    style['--color-on-surface-variant'] = mix(theme.onSurface, 82)
  }

  return style
}
