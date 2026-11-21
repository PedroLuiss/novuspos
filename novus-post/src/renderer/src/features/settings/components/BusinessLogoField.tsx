import React, { useRef, useState } from 'react'
import logoBanner from '@resources/logobanner.png'
import { AlertCircle, Trash2, Upload } from '../../../shared/icons/Icons'

interface BusinessLogoFieldProps {
  value: string
  onChange: (dataUrl: string) => void
  disabled?: boolean
}

const MAX_SOURCE_BYTES = 5 * 1024 * 1024
const MAX_DIMENSION = 512
const MAX_OUTPUT_CHARS = 2.8 * 1024 * 1024

const sectionTitleClass =
  'text-[11px] font-extrabold uppercase tracking-wide text-[#0067C0] border-b border-slate-200 pb-1'

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('La imagen seleccionada no es válida.'))
    image.src = src
  })
}

/**
 * Redimensiona el logo a 512 px y lo normaliza a PNG para que quepa en
 * `business_settings` sin inflar la base de datos ni los respaldos.
 */
async function normalizeLogo(file: File): Promise<string> {
  if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
    throw new Error('Seleccione una imagen en formato PNG o JPG.')
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('La imagen original no debe superar los 5 MB.')
  }

  const source = await readAsDataUrl(file)
  const image = await loadImage(source)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No se pudo procesar la imagen del logo.')
  context.drawImage(image, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/png')
  if (dataUrl.length > MAX_OUTPUT_CHARS) {
    throw new Error('El logo es demasiado pesado. Use una imagen más simple o de menor resolución.')
  }
  return dataUrl
}

/**
 * Campo de carga del logo del negocio. Si no hay logo propio, los documentos
 * exportados usan el logo predeterminado de NovusPOS.
 */
export const BusinessLogoField: React.FC<BusinessLogoFieldProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    setError(null)
    setIsProcessing(true)
    try {
      onChange(await normalizeLogo(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el logo del negocio.')
    } finally {
      setIsProcessing(false)
      input.value = ''
    }
  }

  return (
    <section className="space-y-2.5">
      <h4 className={sectionTitleClass}>Logo del Negocio</h4>

      <div className="flex items-start gap-4 rounded-[6px] border border-slate-200 bg-slate-50/60 p-3">
        <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-[4px] border border-slate-200 bg-white p-2">
          <img
            src={value || logoBanner}
            alt={value ? 'Logo del negocio' : 'Logo de NovusPOS'}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled || isProcessing}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-[#0067C0] hover:bg-[#005BA8] rounded-[4px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={13} />
              <span>{isProcessing ? 'Procesando…' : 'Seleccionar imagen'}</span>
            </button>

            {value && (
              <button
                type="button"
                disabled={disabled || isProcessing}
                onClick={() => {
                  setError(null)
                  onChange('')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-[4px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={13} />
                <span>Quitar logo</span>
              </button>
            )}
          </div>

          <p className="text-[10px] leading-relaxed text-slate-500">
            {value
              ? 'Este logo se mostrará en el Excel y PDF de Kardex.'
              : 'Sin logo propio, el Excel y PDF de Kardex muestran el logo de NovusPOS.'}
          </p>
          <p className="text-[10px] leading-relaxed text-slate-500">
            Formato PNG o JPG. La imagen se ajusta a 512 px para mantener ligera la base de datos.
          </p>

          {error && (
            <p className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
              <AlertCircle size={12} />
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  )
}

export default BusinessLogoField
