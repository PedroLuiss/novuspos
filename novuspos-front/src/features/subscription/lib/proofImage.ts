/** Normaliza la captura del comprobante con la utilidad compartida de imágenes. */
import { MAX_IMAGE_BYTES, prepareImage, type PreparedImage } from '@/shared/lib/imageUpload'

export const MAX_PROOF_BYTES = MAX_IMAGE_BYTES
export type ProofImageResult = PreparedImage

/** Conserva la firma que ya usaba el modal de pago. */
export function prepareProofImage(file: File): Promise<ProofImageResult> {
  return prepareImage(file)
}
