import { useState } from 'react'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { MS } from '@/shared/ui/MS'
import { usePaymentMethodsEditor } from '../hooks/usePaymentMethodsEditor'
import { adminCompactButton, adminPrimaryButton, adminSecondaryButton } from '../lib/adminStyles'
import { PaymentMethodsSkeleton } from './ui/AdminModuleSkeletons'
import { AdminAlert, AdminBadge, AdminCard, AdminState } from './ui/AdminUi'
import { PaymentMethodEditor } from './PaymentMethodEditor'

/** Catálogo de cobro del dueño: lo que verán los clientes al pagar su suscripción. */
export function PaymentMethodsSection() {
  const { draft, isDirty, isLoading, isSaving, saved, error, suggestId, upsert, remove, toggle, save, reset } =
    usePaymentMethodsEditor()
  const [editor, setEditor] = useState<{ open: boolean; method: PaymentMethodOption | null }>({ open: false, method: null })
  const [pendingDelete, setPendingDelete] = useState<PaymentMethodOption | null>(null)

  const closeEditor = () => setEditor({ open: false, method: null })

  if (isLoading) return <PaymentMethodsSkeleton />

  return (
    <AdminCard
      icon="payments"
      title="Métodos de pago"
      description="Cuentas y datos que verán tus clientes al pagar su suscripción."
      action={
        <button type="button" disabled={isSaving} onClick={() => setEditor({ open: true, method: null })} className={adminCompactButton}>
          <MS name="add" className="text-[16px]" /> Agregar método
        </button>
      }
    >
      {error && <AdminAlert>{error}</AdminAlert>}
      {saved && <AdminAlert tone="success">Métodos de pago actualizados. Ya están disponibles en el portal.</AdminAlert>}

      {isLoading ? (
        <AdminState label="Cargando métodos de pago…" loading />
      ) : draft.length === 0 ? (
        <AdminState label="Todavía no hay métodos de pago. Agrega uno para que tus clientes puedan pagar." />
      ) : (
        <div className="flex flex-col gap-space-sm">
          {draft.map((method) => (
            <article key={method.id} className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-space-sm flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <span className="w-9 h-9 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                    <MS name={method.icon} className="text-[19px]" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <h3 className="font-label-md text-label-md font-bold text-on-surface">{method.label}</h3>
                      <AdminBadge tone={method.active ? 'success' : 'neutral'}>
                        {method.active ? 'Visible' : 'Oculto'}
                      </AdminBadge>
                    </div>
                    {method.description && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{method.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-xs">
                  <button type="button" disabled={isSaving} onClick={() => setEditor({ open: true, method })} className={adminCompactButton}>
                    <MS name="edit" className="text-[15px]" /> Editar
                  </button>
                  <button type="button" disabled={isSaving} onClick={() => toggle(method.id)} className={adminCompactButton}>
                    <MS name={method.active ? 'visibility_off' : 'visibility'} className="text-[15px]" />
                    {method.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button type="button" disabled={isSaving} onClick={() => setPendingDelete(method)} className={adminCompactButton}>
                    <MS name="delete_outline" className="text-[15px]" /> Eliminar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-space-md gap-y-1 sm:grid-cols-2">
                {method.rows.map((row, index) => (
                  <div key={`${row.label}-${index}`} className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{row.label}</span>
                    <span className={`text-on-surface font-semibold ${row.mono ? 'font-mono font-body-sm' : 'font-body-md text-body-md'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
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
            <MS name="save" className="text-[18px]" /> {isSaving ? 'Guardando…' : 'Guardar métodos'}
          </button>
        </div>
      </div>

      {editor.open && (
        <PaymentMethodEditor
          method={editor.method}
          suggestId={suggestId}
          onSave={(method) => { upsert(method); closeEditor() }}
          onClose={closeEditor}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Eliminar método de pago"
          message={`¿Quitar "${pendingDelete.label}" del catálogo? Los pagos anteriores conservarán su nombre.`}
          confirmLabel="Eliminar"
          onConfirm={() => { remove(pendingDelete.id); setPendingDelete(null) }}
          onClose={() => setPendingDelete(null)}
        />
      )}
    </AdminCard>
  )
}
