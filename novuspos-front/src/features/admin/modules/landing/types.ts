import type { LandingCopy } from '@/shared/services/landing/types'

/** Actualiza un grupo de textos del borrador sin tocar el resto de la configuración. */
export type CopyPatch = <K extends keyof LandingCopy>(group: K, changes: Partial<LandingCopy[K]>) => void

/** Pestañas del panel de edición del constructor. */
export type EditorTab = 'content' | 'sections' | 'appearance' | 'screenshots' | 'logos' | 'download'
