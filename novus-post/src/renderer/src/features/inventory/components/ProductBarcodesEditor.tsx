import React, { useEffect, useState } from 'react'
import type { BarcodeFormat, ProductBarcode, ProductBarcodeInput } from '@shared/contracts'
import { detectBarcodeFormat, getProductBarcodeValidationError } from '@shared/lib/product-barcode'
import { useProductBarcodes } from '../../../shared/hooks/useProductBarcodes'
import { useBarcodeScanner } from '../../../shared/hooks/useBarcodeScanner'
import {
  Barcode,
  Check,
  Edit3,
  Plus,
  ScanLine,
  Star,
  Trash2,
  X,
  AlertCircle
} from '../../../shared/icons/Icons'
import { useTablePagination } from '../hooks/useTablePagination'
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog'
import TablePagination from './TablePagination'

interface ProductBarcodesEditorProps {
  /** ID del producto (solo se edita si ya existe). */
  productId?: string
}

const FORMATS = ['EAN-13', 'EAN-8', 'UPC-A', 'Code128', 'Code39', 'ITF-14', 'OTRO']
const inputClass =
  'w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-[4px] focus:border-[#0067C0] focus:ring-1 focus:ring-[#0067C0]'

interface Draft {
  id?: string
  barcode: string
  format: string
  label: string
  isPrimary: boolean
  active: boolean
}

/** Editor de códigos de barras múltiples de un producto. */
export const ProductBarcodesEditor: React.FC<ProductBarcodesEditorProps> = ({ productId }) => {
  const { barcodes, error, createBarcode, updateBarcode, deleteBarcode } =
    useProductBarcodes(productId)
  const pagination = useTablePagination(barcodes)
  const confirmation = useConfirmDialog()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveOnScan, setAutoSaveOnScan] = useState(true)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ key: string; svg: string; error: string | null }>({
    key: '',
    svg: '',
    error: null
  })

  const draftValue = draft?.barcode.trim() ?? ''
  const draftFormat = (draft?.format ?? 'EAN-13') as BarcodeFormat
  const detectedFormat = draftValue ? detectBarcodeFormat(draftValue) : null
  const formatValidationError = draftValue
    ? getProductBarcodeValidationError(draftValue, draftFormat)
    : null
  const previewKey = `${draftFormat}:${draftValue}`

  useEffect(() => {
    if (!draftValue || formatValidationError) return
    let active = true
    const timer = window.setTimeout(() => {
      void window.api.productBarcodes
        .previewLabel({ barcode: draftValue, format: draftFormat })
        .then((svg) => {
          if (active) setPreview({ key: previewKey, svg, error: null })
        })
        .catch((err: unknown) => {
          if (active) {
            setPreview({
              key: previewKey,
              svg: '',
              error: err instanceof Error ? err.message : 'No se pudo generar la vista previa.'
            })
          }
        })
    }, 250)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [draftValue, draftFormat, formatValidationError, previewKey])

  const startCreate = (): void => {
    setFormError(null)
    setDraft({
      barcode: '',
      format: 'EAN-13',
      label: '',
      isPrimary: barcodes.length === 0,
      active: true
    })
  }

  const startEdit = (barcode: ProductBarcode): void => {
    setFormError(null)
    setDraft({
      id: barcode.id,
      barcode: barcode.barcode,
      format: barcode.format,
      label: barcode.label ?? '',
      isPrimary: barcode.isPrimary,
      active: barcode.active
    })
  }

  const handleSave = async (): Promise<void> => {
    if (!draft || !productId) return
    if (!draft.barcode.trim()) {
      setFormError('Ingrese el código de barras.')
      return
    }
    setIsSaving(true)
    setFormError(null)
    try {
      const payload: ProductBarcodeInput = {
        productId,
        barcode: draft.barcode.trim(),
        format: draft.format as ProductBarcodeInput['format'],
        label: draft.label.trim() || undefined,
        isPrimary: draft.isPrimary,
        active: draft.active
      }
      const validationError = getProductBarcodeValidationError(payload.barcode, payload.format)
      if (validationError) {
        setFormError(validationError)
        return
      }
      if (draft.id) {
        await updateBarcode({ ...payload, id: draft.id })
      } else {
        await createBarcode(payload)
      }
      setDraft(null)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar el código.')
    } finally {
      setIsSaving(false)
    }
  }

  /** Rellena el formulario con la lectura y, si está activo, lo guarda al instante. */
  const handleScan = (code: string): void => {
    if (!productId) return
    const detected = detectBarcodeFormat(code) ?? draftFormat
    const next: Draft = {
      id: draft?.id,
      barcode: code,
      format: detected,
      label: draft?.label ?? '',
      isPrimary: draft?.isPrimary ?? barcodes.length === 0,
      active: draft?.active ?? true
    }
    setDraft(next)
    setFormError(null)
    setLastMessage(null)

    if (!autoSaveOnScan || next.id) return
    const validationError = getProductBarcodeValidationError(code, detected)
    if (validationError) {
      setFormError(validationError)
      return
    }
    setIsSaving(true)
    void createBarcode({
      productId,
      barcode: code,
      format: detected,
      label: next.label.trim() || undefined,
      isPrimary: next.isPrimary,
      active: next.active
    })
      .then(() => {
        setLastMessage(`Código ${code} guardado como ${detected}.`)
        setDraft({ barcode: '', format: detected, label: '', isPrimary: false, active: true })
      })
      .catch((err: unknown) => {
        setFormError(err instanceof Error ? err.message : 'No se pudo guardar el código.')
      })
      .finally(() => setIsSaving(false))
  }

  const scanBinding = useBarcodeScanner({
    onScan: handleScan,
    enabled: Boolean(productId) && draft !== null
  })

  const handleDelete = async (barcode: ProductBarcode): Promise<void> => {
    const confirmed = await confirmation.confirm({
      title: 'Eliminar código de barras',
      message: `¿Eliminar el código "${barcode.barcode}"?`,
      confirmLabel: 'Eliminar'
    })
    if (!confirmed) return
    setFormError(null)
    try {
      await deleteBarcode(barcode.id)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'No se pudo eliminar el código.')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
          <Barcode size={13} className="text-[#0067C0]" />
          Códigos de Barras ({barcodes.length})
        </span>
        {productId && (
          <button
            type="button"
            disabled={draft !== null}
            onClick={startCreate}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-[#0067C0] bg-blue-50 border border-blue-200 rounded-[4px] hover:bg-blue-100 disabled:opacity-50 cursor-pointer"
          >
            <Plus size={12} />
            Agregar / escanear
          </button>
        )}
      </div>

      {productId && (
        <p className="text-[10px] text-slate-500">
          Apunte el lector al campo «Código de barras». La lectura termina con Enter (o Tab) y el
          formato se detecta automáticamente.
        </p>
      )}

      {!productId && (
        <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[4px] px-2 py-1.5">
          Guarde el producto primero para poder agregar códigos de barras.
        </p>
      )}

      {(formError || error) && (
        <div className="flex items-center gap-1.5 p-2 bg-red-50 border border-red-200 rounded-[4px] text-[11px] text-red-700 font-semibold">
          <AlertCircle size={13} className="shrink-0" />
          <span>{formError ?? error}</span>
        </div>
      )}

      {barcodes.length > 0 && (
        <div className="border border-slate-200 rounded-[4px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="py-1 px-2">Código</th>
                  <th className="py-1 px-2">Formato</th>
                  <th className="py-1 px-2">Etiqueta</th>
                  <th className="py-1 px-2 text-center">Principal</th>
                  <th className="py-1 px-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.items.map((barcode) => (
                  <tr key={barcode.id}>
                    <td className="py-1 px-2 font-mono">{barcode.barcode}</td>
                    <td className="py-1 px-2">{barcode.format}</td>
                    <td className="py-1 px-2 text-slate-500">{barcode.label ?? '-'}</td>
                    <td className="py-1 px-2 text-center">
                      {barcode.isPrimary ? (
                        <Star size={13} className="inline text-amber-500 fill-amber-500" />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-1 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(barcode)}
                          title="Editar código"
                          className="p-1 rounded text-[#717783] hover:text-[#0067C0] hover:bg-blue-50 cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(barcode)}
                          title="Eliminar código"
                          className="p-1 rounded text-[#717783] hover:text-[#C42B1C] hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
          />
        </div>
      )}

      {draft && (
        <div className="p-2.5 border border-[#0067C0]/40 bg-blue-50/40 rounded-[4px] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                Código de barras {scanBinding.isReading && '· leyendo…'}
              </label>
              <input
                type="text"
                autoFocus
                value={draft.barcode}
                onChange={(e) => setDraft({ ...draft, barcode: e.target.value })}
                onKeyDown={scanBinding.onKeyDown}
                onPaste={scanBinding.onPaste}
                onBlur={scanBinding.onBlur}
                placeholder="Escanear o escribir. Ej. 7501000000012"
                className={`${inputClass} font-mono ${
                  detectedFormat && !formatValidationError
                    ? 'border-emerald-400'
                    : formatValidationError
                      ? 'border-red-400'
                      : ''
                }`}
              />
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {detectedFormat && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
                    <ScanLine size={11} />
                    Detectado: {detectedFormat}
                    {detectedFormat !== draftFormat && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, format: detectedFormat })}
                        className="underline cursor-pointer"
                      >
                        usar
                      </button>
                    )}
                  </span>
                )}
                {formatValidationError && (
                  <span className="text-[10px] font-semibold text-red-600">
                    {formatValidationError}
                  </span>
                )}
                {lastMessage && (
                  <span className="text-[10px] font-semibold text-emerald-700">{lastMessage}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                Formato
              </label>
              <select
                value={draft.format}
                onChange={(e) => setDraft({ ...draft, format: e.target.value })}
                className={inputClass}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                Etiqueta
              </label>
              <input
                type="text"
                value={draft.label}
                maxLength={64}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Ej. Caja x 12"
                className={inputClass}
              />
            </div>
          </div>

          {preview.key === previewKey && (
            <div className="p-2 bg-white border border-slate-200 rounded flex flex-col items-center gap-1">
              {preview.error ? (
                <span className="text-[10px] text-red-600">{preview.error}</span>
              ) : (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(preview.svg)}`}
                  alt="Vista previa del código"
                  className="max-h-16 max-w-full"
                />
              )}
            </div>
          )}

          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSaveOnScan}
              onChange={(e) => setAutoSaveOnScan(e.target.checked)}
              className="rounded border-slate-300 text-[#0067C0]"
            />
            Guardar automáticamente al escanear
          </label>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isPrimary}
                onChange={(e) => setDraft({ ...draft, isPrimary: e.target.checked })}
                className="rounded border-slate-300 text-[#0067C0]"
              />
              Código principal
            </label>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                className="rounded border-slate-300 text-[#0067C0]"
              />
              Activo
            </label>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-slate-700 bg-white border border-slate-300 rounded-[4px] hover:bg-slate-50 cursor-pointer"
              >
                <X size={12} />
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void handleSave()}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-[#0067C0] hover:bg-[#0078D4] rounded-[4px] disabled:opacity-50 cursor-pointer"
              >
                <Check size={12} />
                {isSaving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmation.dialog}
    </div>
  )
}

export default ProductBarcodesEditor
