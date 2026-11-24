/** Normaliza la captura del comprobante para que ocupe poco y sea fácil de enviar. */

export const MAX_PROOF_BYTES = 8 * 1024 * 1024
const MAX_EDGE = 1600
const JPEG_QUALITY = 0.82
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface ProofImageResult {
  dataUrl: string
  name: string
}

export async function prepareProofImage(file: File): Promise<ProofImageResult> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Usa una imagen JPG, PNG o WEBP.')
  }
  if (file.size > MAX_PROOF_BYTES) {
    throw new Error('La imagen es muy grande. El máximo es 8 MB.')
  }

  const original = await readAsDataUrl(file)
  const image = await loadImage(original)

  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height))
  if (scale === 1 && file.type === 'image/jpeg' && file.size <= 1_500_000) {
    return { dataUrl: original, name: file.name }
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No se pudo preparar la imagen. Intenta con otra captura.')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return {
    dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY),
    name: `${file.name.replace(/\.[^.]+$/, '')}.jpg`,
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
