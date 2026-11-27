import { useEffect, useMemo, useRef, useState } from 'react'
import { MS } from '@/shared/ui/MS'
import { TextField } from '@/shared/ui/FormFields'
import { apiClient } from '@/shared/services/apiClient'
import { EXCHANGE_RATE_ENDPOINTS } from '@/shared/services/endpoints'
import { adminService } from '@/features/admin/core/services/adminService'
import { adminInput, adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import type { AdminCreatePaymentPayload, UserOption } from '../types'
import type { PlanOption } from '@/shared/services/plans/types'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { AdminModal } from '@/features/admin/core/ui/AdminUi'
import { Skeleton } from '@/shared/ui/Skeleton'

type ExchangeRate = { rate: number; currency: string; date: string; source?: string; fallback?: boolean }

interface Props {
  busy: boolean
  methods: PaymentMethodOption[]
  onClose: () => void
  onCreate: (payload: AdminCreatePaymentPayload) => void
}

function formatBs(amount: number): string {
  return new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}

export function PaymentCreateModal({ busy, methods, onClose, onCreate }: Props) {
  const [users, setUsers] = useState<UserOption[]>([])
  const [plans, setPlans] = useState<PlanOption[]>([])
  const [loading, setLoading] = useState(true)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
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
    Promise.all([
      adminService.listUserOptions({ withoutActiveSubscription: true }),
      adminService.listPlans(),
      apiClient.get<ExchangeRate>(EXCHANGE_RATE_ENDPOINTS.today, { auth: false }).catch(() => null),
    ])
      .then(([u, p, rate]) => {
        if (!active) return
        setUsers(u)
        setPlans(p.filter((plan) => plan.active))
        setExchangeRate(rate)
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

  useEffect(() => {
    if (!userMenuOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [userMenuOpen])

  const selectedUser = useMemo(() => users.find((u) => u.id === form.userId) ?? null, [users, form.userId])
  const filteredUsers = useMemo(() => {
    const needle = userSearch.trim().toLowerCase()
    if (!needle) return users
    return users.filter((u) => [u.businessName, u.name, u.email].join(' ').toLowerCase().includes(needle))
  }, [users, userSearch])

  const bsAmount = useMemo(() => {
    if (!exchangeRate?.rate || form.amount === undefined || form.amount === null || Number.isNaN(Number(form.amount))) return null
    return Number(form.amount) * exchangeRate.rate
  }, [exchangeRate, form.amount])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.userId) return
    onCreate({
      ...form,
      amount: form.amount === undefined ? undefined : Number(form.amount),
      note: form.note?.trim() || undefined,
      bank: form.bank?.trim() || undefined,
    })
  }

  return (
    <AdminModal
      size="xl"
      title="Registrar pago"
      subtitle="Registra un pago manual para un usuario y activa su suscripción si corresponde."
      onClose={() => { if (!busy) onClose() }}
      footer={
        <>
          <button type="button" onClick={onClose} className={adminSecondaryButton}>Cancelar</button>
          <button type="submit" form="admin-payment-create-form" disabled={busy || loading || !form.userId} className={adminPrimaryButton}>
            <MS name="payments" className="text-[18px]" /> {busy ? 'Registrando…' : 'Registrar pago'}
          </button>
        </>
      }
    >
      <form id="admin-payment-create-form" className="flex flex-col gap-space-sm" onSubmit={submit}>
        {loading ? (
          <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2" role="status" aria-label="Cargando formulario de pago">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
                {i === 7 && <Skeleton className="h-16 w-full rounded-xl" />}
              </div>
            ))}
            <div className="md:col-span-2 flex flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
            <div className="flex flex-col gap-1" ref={userMenuRef}>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Usuario</span>
              <div className="relative">
                <MS name="search" className="absolute left-3 top-3 text-outline text-[18px]" />
                <input
                  className={`${adminInput} pl-10 pr-10`}
                  value={userMenuOpen ? userSearch : (selectedUser ? `${selectedUser.businessName} — ${selectedUser.email}` : '')}
                  onChange={(e) => {
                    setUserSearch(e.target.value)
                    setUserMenuOpen(true)
                    if (form.userId) setForm((current) => ({ ...current, userId: '' }))
                  }}
                  onFocus={() => { setUserMenuOpen(true); setUserSearch('') }}
                  placeholder="Buscar por nombre, correo o comercio"
                  aria-label="Buscar usuario"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-on-surface-variant"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-label="Mostrar usuarios"
                >
                  <MS name={userMenuOpen ? 'expand_less' : 'expand_more'} className="text-[20px]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-lg">
                    {filteredUsers.length === 0 ? (
                      <div className="px-space-sm py-space-sm font-body-sm text-body-sm text-on-surface-variant">No se encontraron usuarios.</div>
                    ) : filteredUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        className={`w-full px-space-sm py-2.5 text-left hover:bg-surface-container-low transition-colors ${form.userId === u.id ? 'bg-primary/5' : ''}`}
                        onClick={() => {
                          setForm((current) => ({ ...current, userId: u.id }))
                          setUserSearch('')
                          setUserMenuOpen(false)
                        }}
                      >
                        <div className="font-label-md text-label-md font-semibold text-on-surface">{u.businessName}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">{u.name} · {u.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {!form.userId && <span className="font-body-sm text-body-sm text-on-surface-variant">Selecciona un usuario para registrar el pago.</span>}
            </div>

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

            <div className="flex flex-col gap-1">
              <TextField id="admin-payment-amount" label="Monto (USD)" icon="attach_money" type="number" value={String(form.amount ?? '')} onChange={(amount) => setForm({ ...form, amount: amount === '' ? undefined : Number(amount) })} required />
              <div className="rounded-xl bg-surface-container-low px-space-sm py-2 border border-outline-variant/30">
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Equivalente en bolívares</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {bsAmount !== null ? `Bs. ${formatBs(bsAmount)}` : '—'}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {exchangeRate ? `Tasa BCV: Bs. ${formatBs(exchangeRate.rate)} por USD${exchangeRate.date ? ` (${exchangeRate.date})` : ''}.` : 'No se pudo cargar la tasa BCV; verifica el monto manualmente.'}
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <TextField id="admin-payment-note" label="Nota (opcional)" icon="notes" value={form.note ?? ''} onChange={(note) => setForm({ ...form, note })} />
            </div>
          </div>
        )}
      </form>
    </AdminModal>
  )
}
