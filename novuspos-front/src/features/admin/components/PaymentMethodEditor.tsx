import { useState } from 'react'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { MS } from '@/shared/ui/MS'
import { adminInput, adminPrimaryButton, adminSecondaryButton } from '../lib/adminStyles'
import { AdminModal } from './ui/AdminUi'

const ICONS = [
  { value: 'payments', label: 'Pagos' },
  { value: 'smartphone', label: 'Pago móvil' },
  { value: 'account_balance', label: 'Banco' },
  { value: 'local_bank', label: 'Sucursal' },
  { value: 'qr_code', label: 'QR' },
  { value: 'credit_card', label: 'Tarjeta' },
  { value: 'currency_exchange', label: 'Divisa' },
  { value: 'wallet', label: 'Billetera' },
]

interface Props {
  method: PaymentMethodOption | null
  suggestId: (label: string) => string
  onSave: (method: PaymentMethodOption) => void
  onClose: () => void
}

/** Alta y edición de un método: nombre, icono, filas libres y visibilidad. */
export function PaymentMethodEditor({ method, suggestId, onSave, onClose }: Props) {
  const [form, setForm] = useState<PaymentMethodOption>(() =>
    method
      ? { ...method, rows: method.rows.map((row) => ({ ...row })) }
      : { id: '', label: '', description: '', icon: 'payments', active: true, rows: [{ label: '', value: '', mono: false }] },
  )
  const [error, setError] = useState<string | null>(null)

  const patchRow = (index: number, key: 'label' | 'value', value: string) => {
    setError(null)
    setForm((current) => ({
      ...current,
      rows: current.rows.map((row, position) => (position === index ? { ...row, [key]: value } : row)),
    }))
  }

  const save = () => {
    const label = form.label.trim()
    if (!label) {
      setError('Escribe el nombre que verán tus clientes.')
      return
    }
    if (!form.rows.length || form.rows.some((row) => !row.label.trim() || !row.value.trim())) {
      setError('Completa la etiqueta y el valor de cada dato.')
      return
    }
    onSave({
      ...form,
      id: form.id.trim() || suggestId(label),
      label,
      description: form.description.trim(),
      rows: form.rows.map((row) => ({ label: row.label.trim(), value: row.value.trim(), mono: row.mono })),
    })
  }

  return (
    <AdminModal
      title={method ? 'Editar método de pago' : 'Agregar método de pago'}
      subtitle="Los datos se mostrarán a tus clientes cuando paguen su suscripción."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={adminSecondaryButton}>Cancelar</button>
          <button type="button" onClick={save} className={adminPrimaryButton}>
            <MS name="check" className="text-[18px]" /> Guardar método
          </button>
        </>
      }
    >
      {error && <p className="rounded-xl bg-error-container px-space-sm py-space-xs font-body-sm text-body-sm text-on-error-container" role="alert">{error}</p>}

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        <label className="flex flex-col gap-1" htmlFor="admin-method-label">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Nombre visible</span>
          <input
            id="admin-method-label"
            value={form.label}
            onChange={(event) => { setError(null); setForm({ ...form, label: event.target.value }) }}
            placeholder="Ejemplo: Zelle"
            className={adminInput}
          />
        </label>
        <label className="flex flex-col gap-1" htmlFor="admin-method-description">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Descripción</span>
          <input
            id="admin-method-description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Ejemplo: Paga desde tu banca en línea"
            className={adminInput}
          />
        </label>
      </div>

      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Icono</span>
        <div className="flex flex-wrap gap-space-xs" role="group" aria-label="Icono del método">
          {ICONS.map((icon) => (
            <button
              key={icon.value}
              type="button"
              aria-label={icon.label}
              aria-pressed={form.icon === icon.value}
              onClick={() => setForm({ ...form, icon: icon.value })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition ${
                form.icon === icon.value
                  ? 'border-primary bg-primary-fixed/50 text-primary'
                  : 'border-outline-variant/70 text-on-surface-variant hover:border-primary'
              }`}
            >
              <MS name={icon.value} className="text-[20px]" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between gap-space-sm">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Datos que debe copiar el cliente</span>
          <button
            type="button"
            onClick={() => setForm({ ...form, rows: [...form.rows, { label: '', value: '', mono: false }] })}
            className="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary hover:underline"
          >
            <MS name="add" className="text-[16px]" /> Agregar dato
          </button>
        </div>
        {form.rows.map((row, index) => (
          <div key={index} className="grid grid-cols-1 gap-space-xs sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]">
            <input
              aria-label={`Etiqueta del dato ${index + 1}`}
              value={row.label}
              onChange={(event) => patchRow(index, 'label', event.target.value)}
              placeholder="Etiqueta (ej. Banco)"
              className={adminInput}
            />
            <input
              aria-label={`Valor del dato ${index + 1}`}
              value={row.value}
              onChange={(event) => patchRow(index, 'value', event.target.value)}
              placeholder="Valor (ej. Banesco)"
              className={adminInput}
            />
            <button
              type="button"
              aria-label={`Quitar dato ${index + 1}`}
              disabled={form.rows.length === 1}
              onClick={() => setForm({ ...form, rows: form.rows.filter((_, position) => position !== index) })}
              className="w-11 h-11 rounded-xl border border-outline-variant/70 text-on-surface-variant hover:border-error hover:text-error disabled:opacity-40 flex items-center justify-center"
            >
              <MS name="delete_outline" className="text-[18px]" />
            </button>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) => setForm({ ...form, active: event.target.checked })}
          className="h-4 w-4 accent-primary"
        />
        Mostrar este método a los clientes
      </label>

      <p className="font-label-sm text-label-sm text-outline font-mono">
        Clave del método: {form.id.trim() || suggestId(form.label)}
      </p>
    </AdminModal>
  )
}
