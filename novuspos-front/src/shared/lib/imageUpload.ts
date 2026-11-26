/** Prepara imágenes del navegador para guardarlas como data URL sin subirlas a un servidor. */

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

const KEEP_ORIGINAL_BYTES = 1_500_000
const DEFAULT_MAX_EDGE = 1600
const DEFAULT_QUALITY = 0.82

export interface PrepareImageOptions {
  maxEdge?: number
  quality?: number
  maxBytes?: number
  /** Conserva el formato original al comprimir para no perder transparencia en logos. */
  preserveFormat?: boolean
}

export interface PreparedImage {
  dataUrl: string
  name: string
}

/** Valida, reduce y convierte la imagen a una cadena segura para localStorage o la API. */
export async function prepareImage(file: File, options: PrepareImageOptions = {}): Promise<PreparedImage> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    throw new Error('Usa una imagen JPG, PNG o WEBP.')
  }

  const maxBytes = options.maxBytes ?? MAX_IMAGE_BYTES
  if (file.size > maxBytes) {
    throw new Error(`La imagen es muy grande. El máximo es ${Math.round(maxBytes / 1024 / 1024)} MB.`)
  }

  const dataUrl = await readAsDataUrl(file)
  const image = await loadImage(dataUrl)
  const maxEdge = options.maxEdge ?? DEFAULT_MAX_EDGE
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height))

  if (scale === 1 && file.size <= KEEP_ORIGINAL_BYTES) {
    return { dataUrl, name: file.name }
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No se pudo preparar la imagen. Intenta con otra captura.')
  const keepTransparency = options.preserveFormat === true && file.type !== 'image/jpeg'
  if (!keepTransparency) {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const outputType = keepTransparency ? file.type : 'image/jpeg'
  return {
    dataUrl: canvas.toDataURL(outputType, options.quality ?? DEFAULT_QUALITY),
    name: keepTransparency ? file.name : `${file.name.replace(/\.[^.]+$/, '')}.jpg`,
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen. Intenta de nuevo.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('La imagen no se pudo abrir. Prueba con otra captura.'))
    image.src = src
  })
}
