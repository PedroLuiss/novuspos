import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { useLandingEditor } from '../hooks/useLandingEditor'
import { adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import { LandingSkeleton } from './LandingSkeleton'
import { AdminAlert, AdminCard, AdminPageHeader } from '@/features/admin/core/ui/AdminUi'
import { LandingAppearanceEditor } from './LandingAppearanceEditor'
import { LandingContentEditor } from './LandingContentEditor'
import { LandingDownloadEditor } from './LandingDownloadEditor'
import { LandingLogosEditor } from './LandingLogosEditor'
import { LandingPreview } from './LandingPreview'
import { LandingScreenshotsEditor } from './LandingScreenshotsEditor'
import { LandingSectionsEditor } from './LandingSectionsEditor'
import { LANDING_EDITOR_TABS } from '../constants'
import type { EditorTab } from '../types'

/** Constructor visual de la landing: edición a la izquierda, vista previa en vivo a la derecha. */
export function LandingBuilderPage() {
  const editor = useLandingEditor()
  const [tab, setTab] = useState<EditorTab>('content')
  const [pendingRestore, setPendingRestore] = useState(false)

  const restore = () => {
    editor.restoreDefaults()
    setPendingRestore(false)
  }

  if (editor.isLoading) return <LandingSkeleton />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Sitio público"
        title="Constructor de la landing"
        description="Personaliza los textos, los colores, el orden de las secciones, las capturas y los logos. Mira cada cambio en la vista previa y publica cuando todo esté listo."
        actions={
          <>
            <a href="/?preview=1" target="_blank" rel="noreferrer" className={adminSecondaryButton}>
              <MS name="open_in_new" className="text-[18px]" /> Vista amplia
            </a>
            <button type="button" onClick={() => void editor.save()} disabled={!editor.isDirty || editor.isSaving} className={adminPrimaryButton}>
              <MS name="publish" className="text-[18px]" /> {editor.isSaving ? 'Guardando…' : 'Publicar cambios'}
            </button>
          </>
        }
      />

      {editor.error && <AdminAlert>{editor.error}</AdminAlert>}
      {editor.saved && <AdminAlert tone="success">Landing actualizada. Los visitantes ya ven la nueva versión.</AdminAlert>}
      {editor.isDirty && !editor.saved && (
        <AdminAlert tone="warning">Tienes cambios sin publicar. La vista previa ya los muestra.</AdminAlert>
      )}

      <div className="grid items-start grid-cols-1 gap-space-lg xl:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
        <AdminCard
          icon="tune"
          title="Panel de edición"
          description="Elige qué quieres cambiar; los cambios se aplican al guardar."
          action={<MS name="bolt" className="text-[20px] text-primary" />}
        >
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-container p-1 sm:grid-cols-6">
            {LANDING_EDITOR_TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-pressed={tab === item.key}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 font-label-sm text-label-sm font-semibold transition ${
                  tab === item.key ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <MS name={item.icon} className="text-[19px]" /> {item.label}
              </button>
            ))}
          </div>

          <div className="max-h-[calc(100vh-300px)] min-h-[520px] overflow-y-auto pr-1">
            {tab === 'content' ? (
              <LandingContentEditor copy={editor.draft.copy} patch={editor.patch} />
            ) : tab === 'sections' ? (
              <LandingSectionsEditor
                sections={editor.draft.sections}
                onChange={editor.setSections}
                onToggle={editor.toggleSection}
                onMove={editor.moveSection}
              />
            ) : tab === 'appearance' ? (
              <LandingAppearanceEditor theme={editor.draft.theme} onChange={editor.setTheme} />
            ) : tab === 'screenshots' ? (
              <LandingScreenshotsEditor screenshots={editor.draft.screenshots} onChange={editor.setScreenshots} />
            ) : tab === 'logos' ? (
              <LandingLogosEditor logos={editor.draft.logos} onChange={editor.setLogos} />
            ) : (
              <LandingDownloadEditor
                download={editor.draft.download}
                isUploading={editor.isUploadingDownload}
                uploadProgress={editor.downloadProgress}
                onUpload={editor.uploadDownload}
                onDelete={editor.deleteDownload}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-space-xs border-t border-outline-variant/50 pt-space-sm">
            <button type="button" className={adminSecondaryButton} onClick={editor.reset} disabled={!editor.isDirty || editor.isSaving}>
              Descartar cambios
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-space-xs rounded-lg px-space-sm py-1.5 font-label-sm text-label-sm font-semibold text-on-surface-variant hover:text-error"
              onClick={() => setPendingRestore(true)}
              disabled={editor.isSaving}
            >
              <MS name="restart_alt" className="text-[16px]" /> Restaurar original
            </button>
          </div>
        </AdminCard>

        <AdminCard
          icon="preview"
          title="Vista previa en vivo"
          description="Se actualiza mientras editas. El ancho equivale a una pantalla de computadora."
          action={<span className="font-label-sm text-label-sm text-on-surface-variant">/?preview=1</span>}
        >
          <LandingPreview config={editor.draft} />
        </AdminCard>
      </div>

      {pendingRestore && (
        <ConfirmDialog
          title="Restaurar la landing original"
          message="Los textos, colores, secciones, capturas, logos e instalador volverán al diseño inicial. Guarda los cambios para aplicarlo."
          confirmLabel="Restaurar"
          onConfirm={restore}
          onClose={() => setPendingRestore(false)}
        />
      )}
    </div>
  )
}
