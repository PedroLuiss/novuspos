import { useEffect, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { TextField } from '@/shared/ui/FormFields'
import { adminService } from '@/features/admin/core/services/adminService'
import { adminInput, adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import type { AdminCreatePaymentPayload, UserOption } from '../types'
import type { PlanOption } from '@/shared/services/plans/types'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { AdminModal } from '@/features/admin/core/ui/AdminUi'

interface Props {
  busy: boolean
  methods: PaymentMethodOption[]
  onClose: () => void
  onCreate: (payload: AdminCreatePaymentPayload) => void
}

export function PaymentCreateModal({ busy, methods, onClose, onCreate }: Props) {
  const [users, setUsers] = useState<UserOption[]>([])
  const [plans, setPlans] = useState<PlanOption[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<AdminCreatePaymentPayload>({
    userId: '',
    planId: '',
    amount: undefined,
    currency: 'USD',
    method: methods[0]?.id ?? 'transferencia',
    reference: '',
    bank: '',
    paidAt: new Date().toISOString().slice(0, 10),
    status: 'approved',
    note: '',
  })

  useEffect(() => {
    let active = true
    Promise.all([adminService.listUserOptions(), adminService.listPlans()])
      .then(([u, p]) => {
        if (!active) return
        setUsers(u)
        setPlans(p.filter((plan) => plan.active))
        setForm((current) => ({
          ...current,
          userId: current.userId || u[0]?.id || '',
          planId: current.planId || p.find((plan) => plan.active)?.id || p[0]?.id || '',
          method: current.method || methods[0]?.id || 'transferencia',
        }))
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [methods])

  useEffect(() => {
    const plan = plans.find((p) => p.id === form.planId)
    if (plan) setForm((current) => ({ ...current, amount: plan.price, currency: plan.currency }))
  }, [form.planId, plans])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      ...form,
      amount: form.amount === undefined ? undefined : Number(form.amount),
      note: form.note?.trim() || undefined,
      bank: form.bank?.trim() || undefined,
    })
  }

  return (
    <AdminModal
      wide
      title="Registrar pago"
      subtitle="Registra un pago manual para un usuario y activa su suscripción si corresponde."
      onClose={() => { if (!busy) onClose() }}
      footer={
        <>
          <button type="button" onClick={onClose} className={adminSecondaryButton}>Cancelar</button>
          <button type="submit" form="admin-payment-create-form" disabled={busy || loading} className={adminPrimaryButton}>
            <MS name="payments" className="text-[18px]" /> {busy ? 'Registrando…' : 'Registrar pago'}
          </button>
        </>
      }
    >
      <form id="admin-payment-create-form" className="flex flex-col gap-space-sm" onSubmit={submit}>
        {loading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">Cargando usuarios y planes...</p>
        ) : (
          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Usuario</span>
              <select className={adminInput} value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required>
                <option value="" disabled>Selecciona un usuario</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.businessName}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Plan</span>
              <select className={adminInput} value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })} required>
                <option value="" disabled>Selecciona un plan</option>
                {plans.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.currency} {p.price})</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Método</span>
              <select className={adminInput} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} required>
                {methods.filter((m) => m.active).map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Estado</span>
              <select className={adminInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'approved' | 'pending' })} required>
                <option value="approved">Aprobado (activa suscripción)</option>
                <option value="pending">Pendiente</option>
              </select>
            </label>
            <TextField id="admin-payment-ref" label="Referencia" icon="tag" value={form.reference} onChange={(reference) => setForm({ ...form, reference })} required />
            <TextField id="admin-payment-bank" label="Banco / detalle" icon="account_balance" value={form.bank ?? ''} onChange={(bank) => setForm({ ...form, bank })} />
            <TextField id="admin-payment-date" label="Fecha de pago" icon="calendar_month" type="date" value={form.paidAt} onChange={(paidAt) => setForm({ ...form, paidAt })} required />
            <TextField id="admin-payment-amount" label="Monto" icon="attach_money" type="number" value={String(form.amount ?? '')} onChange={(amount) => setForm({ ...form, amount: amount === '' ? undefined : Number(amount) })} />
            <div className="sm:col-span-2">
              <TextField id="admin-payment-note" label="Nota (opcional)" icon="notes" value={form.note ?? ''} onChange={(note) => setForm({ ...form, note })} />
            </div>
          </div>
        )}
      </form>
    </AdminModal>
  )
}
