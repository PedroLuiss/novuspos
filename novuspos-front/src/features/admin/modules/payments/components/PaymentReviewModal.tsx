import { useState } from 'react'
import { MS } from '@/shared/ui/MS'
import type { AdminPayment } from '../types'
import { formatAdminDate, formatUsd } from '@/features/admin/core/lib/adminFormatters'
import { adminInput, adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import { AdminBadge, AdminModal } from '@/features/admin/core/ui/AdminUi'

interface Props {
  payment: AdminPayment
  methodLabel: string
  busy: boolean
  onClose: () => void
  onReview: (approved: boolean, note?: string) => void
}

/** Evaluación manual: comprobante, datos del pago y decisión del dueño. */
export function PaymentReviewModal({ payment, methodLabel, busy, onClose, onReview }: Props) {
  const [note, setNote] = useState(payment.reviewNote ?? '')
  const rows = [
    ['Usuario', payment.userName],
    ['Suscripción', payment.planName],
    ['Referencia', payment.reference],
    ['Banco', payment.bank],
    ['Fecha del pago', formatAdminDate(payment.paidAt)],
    ['Método', methodLabel],
  ]

  return (
    <AdminModal
      wide
      title="Evaluar pago"
      subtitle="Confirma el comprobante en tu banco antes de decidir."
      onClose={() => { if (!busy) onClose() }}
      footer={
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => onReview(false, note.trim() || 'No pudimos confirmar el pago en el banco.')}
            className={`${adminSecondaryButton} border-error/30 text-error hover:border-error`}
          >
            <MS name="cancel" className="text-[18px]" /> Rechazar
          </button>
          <button type="button" disabled={busy} onClick={() => onReview(true, note.trim() || undefined)} className={adminPrimaryButton}>
            <MS name="check_circle" className="text-[18px]" /> {busy ? 'Actualizando…' : 'Aprobar y activar suscripción'}
          </button>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-space-xs rounded-xl bg-surface-container px-space-sm py-space-xs">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Monto declarado</span>
        <span className="font-numeric-total text-numeric-total font-mono font-bold text-primary">{formatUsd(payment.amount)}</span>
      </div>

      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Datos del pago</span>
          <div className="rounded-xl border border-outline-variant/50 px-space-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-space-xs border-b border-outline-variant/50 py-2.5 last:border-0">
                <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
                <span className="text-right font-label-md text-label-md font-mono font-semibold text-on-surface">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Comprobante enviado</span>
            <a href={payment.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary hover:underline">
              <MS name="open_in_new" className="text-[15px]" /> Ampliar
            </a>
          </div>
          <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-space-xs">
            <img src={payment.proofUrl} alt="Comprobante del pago" className="mx-auto max-h-64 w-full rounded-lg object-contain" />
          </div>
          <AdminBadge tone={payment.status === 'approved' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}>
            {payment.status === 'approved' ? 'Aprobado' : payment.status === 'pending' ? 'Pendiente' : 'Rechazado'}
          </AdminBadge>
        </div>
      </div>

      <label className="flex flex-col gap-space-xs" htmlFor="admin-payment-note">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Nota de revisión (opcional)</span>
        <textarea
          id="admin-payment-note"
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ejemplo: la referencia no aparece en el banco"
          className={`${adminInput} h-auto py-2`}
        />
      </label>
    </AdminModal>
  )
}
