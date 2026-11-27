import { useState } from 'react'
import type { PlanEditorState, PlanOption } from '../types'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { MS } from '@/shared/ui/MS'
import { usePlansEditor } from '../hooks/usePlansEditor'
import { formatUsd } from '@/features/admin/core/lib/adminFormatters'
import { adminCompactButton, adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import { PlansSkeleton } from './PlansSkeleton'
import { AdminAlert, AdminBadge, AdminCard, AdminPageHeader, AdminState } from '@/features/admin/core/ui/AdminUi'
import { PlanEditor } from './PlanEditor'

/** Suscripciones de escritorio que el dueño personaliza y luego ve el cliente. */
export function PlansPage() {
  const { draft, isDirty, isLoading, isSaving, saved, error, suggestId, upsert, remove, toggle, save, reset } = usePlansEditor()
  const [editor, setEditor] = useState<PlanEditorState>({ open: false, plan: null })
  const [pendingDelete, setPendingDelete] = useState<PlanOption | null>(null)

  const closeEditor = () => setEditor({ open: false, plan: null })

  if (isLoading) return <PlansSkeleton />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Operación"
        title="Suscripciones"
        description="Personaliza los planes de NovusPOS Desktop, crea otros nuevos y decide cuáles se ofrecen."
        actions={
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setEditor({ open: true, plan: null })}
            className={adminPrimaryButton}
          >
            <MS name="add" className="text-[18px]" /> Nueva suscripción
          </button>
        }
      />

      <AdminCard
        icon="workspace_premium"
        title="Catálogo de planes"
        description="Los cambios aparecen en el portal y en la landing cuando guardas."
        action={<AdminBadge tone="info">{draft.length} {draft.length === 1 ? 'plan' : 'planes'}</AdminBadge>}
      >
        {error && <AdminAlert>{error}</AdminAlert>}
        {saved && <AdminAlert tone="success">Suscripciones actualizadas. Ya están disponibles para tus clientes.</AdminAlert>}

        {draft.length === 0 ? (
          <AdminState label="Todavía no hay suscripciones. Crea un plan para empezar." />
        ) : (
          <div className="grid grid-cols-1 gap-space-sm xl:grid-cols-2">
            {draft.map((plan) => (
              <article key={plan.id} className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-space-sm flex flex-col gap-space-xs">
                <div className="flex flex-wrap items-start justify-between gap-space-xs">
                  <div className="flex items-start gap-space-sm">
                    <span className="w-9 h-9 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                      <MS name="workspace_premium" className="text-[19px]" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <h3 className="font-label-md text-label-md font-bold text-on-surface">{plan.name}</h3>
                        <AdminBadge tone={plan.active ? 'success' : 'neutral'}>{plan.active ? 'Visible' : 'Oculta'}</AdminBadge>
                        {plan.highlighted && <AdminBadge tone="info">Recomendada</AdminBadge>}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{plan.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-numeric-keypad text-numeric-keypad font-mono font-bold text-on-surface">{formatUsd(plan.price)}</span>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">al {plan.interval === 'year' ? 'año' : 'mes'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-t border-outline-variant/50 pt-space-xs">
                  {plan.features.map((feature, index) => (
                    <span key={`${feature}-${index}`} className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                      <MS name="check" className="text-secondary text-[15px] shrink-0 mt-0.5" /> {feature}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-space-xs pt-space-xs">
                  <button type="button" disabled={isSaving} onClick={() => setEditor({ open: true, plan })} className={adminCompactButton}>
                    <MS name="edit" className="text-[15px]" /> Editar
                  </button>
                  <button type="button" disabled={isSaving} onClick={() => toggle(plan.id)} className={adminCompactButton}>
                    <MS name={plan.active ? 'visibility_off' : 'visibility'} className="text-[15px]" />
                    {plan.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button type="button" disabled={isSaving} onClick={() => setPendingDelete(plan)} className={adminCompactButton}>
                    <MS name="delete_outline" className="text-[15px]" /> Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-space-xs border-t border-outline-variant/50 pt-space-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {isDirty ? 'Tienes cambios sin guardar.' : 'Los cambios se aplican al guardar.'}
          </span>
          <div className="flex flex-wrap gap-space-xs">
            <button type="button" onClick={reset} disabled={!isDirty || isSaving} className={adminSecondaryButton}>
              Descartar cambios
            </button>
            <button type="button" onClick={() => void save()} disabled={!isDirty || isSaving} className={adminPrimaryButton}>
              <MS name="save" className="text-[18px]" /> {isSaving ? 'Guardando…' : 'Guardar planes'}
            </button>
          </div>
        </div>
      </AdminCard>

      {editor.open && (
        <PlanEditor
          plan={editor.plan}
          suggestId={suggestId}
          onSave={(plan) => { upsert(plan); closeEditor() }}
          onClose={closeEditor}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Eliminar suscripción"
          message={`¿Quitar "${pendingDelete.name}" del catálogo? Los pagos anteriores conservarán su plan.`}
          confirmLabel="Eliminar"
          onConfirm={() => { remove(pendingDelete.id); setPendingDelete(null) }}
          onClose={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
