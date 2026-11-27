import type { EditorTab } from './types'

export interface LandingEditorTab {
  key: EditorTab
  label: string
  icon: string
}

export const LANDING_EDITOR_TABS: readonly LandingEditorTab[] = [
  { key: 'content', label: 'Textos', icon: 'edit_note' },
  { key: 'sections', label: 'Secciones', icon: 'view_list' },
  { key: 'appearance', label: 'Colores', icon: 'palette' },
  { key: 'screenshots', label: 'Capturas', icon: 'photo_library' },
  { key: 'logos', label: 'Logo', icon: 'image' },
  { key: 'download', label: 'Descarga', icon: 'download' },
]
