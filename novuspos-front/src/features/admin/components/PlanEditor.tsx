import { useState } from 'react'
import type { PlanOption } from '@/shared/services/plans/types'
import { MS } from '@/shared/ui/MS'
import { adminInput, adminPrimaryButton, adminSecondaryButton } from '../lib/adminStyles'
import { AdminModal } from './ui/AdminUi'

interface Props {
  plan: PlanOption | null
  suggestId: (name: string) => string
  onSave: (plan: PlanOption) => void
  onClose: () => void
}

/** Alta y edición de una suscripción de NovusPOS Desktop. */
export function PlanEditor({ plan, suggestId, onSave, onClose }: Props) {
  const [form, setForm] = useState<PlanOption>(() =>
    plan
      ? { ...plan, features: [...plan.features] }
      : {
          id: '',
          name: '',
          description: '',
          price: 0,
          currency: 'USD',
          interval: 'month',
          features: [''],
          highlighted: false,
          active: true,
        },
  )
  const [error, setError] = useState<string | null>(null)

  const patchFeature = (index: number, value: string) => {
    setError(null)
    setForm((current) => ({ ...current, features: current.features.map((item, position) => (position === index ? value : item)) }))
  }

  const save = () => {
    const name = form.name.trim()
    const features = form.features.map((item) => item.trim()).filter(Boolean)
    if (!name) {
      setError('Escribe el nombre que verán tus clientes.')
      return
    }
    if (!form.description.trim()) {
      setError('Escribe una descripción breve del plan.')
      return
    }
    if (!Number.isFinite(form.price) || form.price <= 0) {
      setError('Indica un precio mayor a cero.')
      return
    }
    if (features.length === 0) {
      setError('Agrega al menos una ventaja del plan.')
      return
    }
    onSave({
      ...form,
      id: form.id.trim() || suggestId(name),
      name,
      description: form.description.trim(),
      features,
      currency: 'USD',
      highlighted: form.highlighted === true,
      active: form.active !== false,
    })
  }

  return (
    <AdminModal
      title={plan ? 'Editar suscripción' : 'Nueva suscripción'}
      subtitle="Define el plan que tus clientes podrán contratar y pagar."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={adminSecondaryButton}>Cancelar</button>
          <button type="button" onClick={save} className={adminPrimaryButton}>
            <MS name="check" className="text-[18px]" /> Guardar plan
          </button>
        </>
      }
    >
      {error && <p className="rounded-xl bg-error-container px-space-sm py-space-xs font-body-sm text-body-sm text-on-error-container" role="alert">{error}</p>}

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        <label className="flex flex-col gap-1" htmlFor="admin-plan-name">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Nombre visible</span>
          <input
            id="admin-plan-name"
            value={form.name}
            onChange={(event) => { setError(null); setForm({ ...form, name: event.target.value }) }}
            placeholder="Ejemplo: NovusPOS Trimestral"
            className={adminInput}
          />
        </label>
        <label className="flex flex-col gap-1" htmlFor="admin-plan-price">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Precio en USD</span>
          <input
            id="admin-plan-price"
            type="number"
            min="0"
            step="0.01"
            value={Number.isFinite(form.price) ? form.price : ''}
            onChange={(event) => { setError(null); setForm({ ...form, price: Number(event.target.value) }) }}
            className={adminInput}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1" htmlFor="admin-plan-description">
        <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Descripción</span>
        <input
          id="admin-plan-description"
          value={form.description}
          onChange={(event) => { setError(null); setForm({ ...form, description: event.target.value }) }}
          placeholder="Ejemplo: el mismo sistema, pagando cada tres meses"
          className={adminInput}
        />
      </label>

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        <label className="flex flex-col gap-1" htmlFor="admin-plan-interval">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Periodo</span>
          <select
            id="admin-plan-interval"
            value={form.interval}
            onChange={(event) => setForm({ ...form, interval: event.target.value === 'year' ? 'year' : 'month' })}
            className={adminInput}
          >
            <option value="month">Mensual</option>
            <option value="year">Anual</option>
          </select>
        </label>
        <div className="flex flex-col justify-center rounded-xl bg-surface-container px-space-sm py-space-xs">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Moneda</span>
          <span className="font-body-md text-body-md text-on-surface">USD</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">El total en bolívares se calcula al pagar.</span>
        </div>
      </div>

      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between gap-space-sm">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Ventajas del plan</span>
          <button
            type="button"
            onClick={() => setForm({ ...form, features: [...form.features, ''] })}
            className="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary hover:underline"
          >
            <MS name="add" className="text-[16px]" /> Agregar ventaja
          </button>
        </div>
        {form.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-space-xs">
            <input
              aria-label={`Ventaja ${index + 1}`}
              value={feature}
              onChange={(event) => patchFeature(index, event.target.value)}
              placeholder="Ejemplo: Ventas, inventario y caja en el mismo equipo"
              className={adminInput}
            />
            <button
              type="button"
              aria-label={`Quitar ventaja ${index + 1}`}
              disabled={form.features.length === 1}
              onClick={() => setForm({ ...form, features: form.features.filter((_, position) => position !== index) })}
              className="w-11 h-11 shrink-0 rounded-xl border border-outline-variant/70 text-on-surface-variant hover:border-error hover:text-error disabled:opacity-40 flex items-center justify-center"
            >
              <MS name="delete_outline" className="text-[18px]" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-space-xs">
        <label className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
          <input
            type="checkbox"
            checked={form.highlighted === true}
            onChange={(event) => setForm({ ...form, highlighted: event.target.checked })}
            className="h-4 w-4 accent-primary"
          />
          Destacar esta suscripción como recomendada
        </label>
        <label className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
          <input
            type="checkbox"
            checked={form.active !== false}
            onChange={(event) => setForm({ ...form, active: event.target.checked })}
            className="h-4 w-4 accent-primary"
          />
          Mostrar este plan a los clientes
        </label>
      </div>

      <p className="font-label-sm text-label-sm text-outline font-mono">
        Clave del plan: {form.id.trim() || suggestId(form.name)}
      </p>
    </AdminModal>
  )
}
