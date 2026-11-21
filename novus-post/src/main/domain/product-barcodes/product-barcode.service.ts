import type { ProductBarcode, ProductBarcodeInput, ProductBarcodeFilter } from '@shared/contracts'
import type { ProductBarcodeRepository } from '../../ports/product-barcode.repository'
import type { TransactionRunner } from '../../ports/transaction'
import { NotFoundError, ValidationError } from '../shared/errors'
import { normalizeProductBarcodeInput, validateProductBarcodeInput } from './product-barcode.entity'
import type { AuthService } from '../auth/auth.service'

/** Servicio de dominio de códigos de barras de producto. Puro: solo depende de puertos y entidades. */
export class ProductBarcodeService {
  constructor(
    private readonly barcodes: ProductBarcodeRepository,
    private readonly auth: AuthService,
    private readonly tx: TransactionRunner
  ) {}

  list(filter?: ProductBarcodeFilter): ProductBarcode[] {
    return this.barcodes.findAll(filter)
  }

  getById(id: string): ProductBarcode | null {
    return this.barcodes.findById(id)
  }

  findByBarcode(barcode: string): ProductBarcode | null {
    return this.barcodes.findByBarcode(barcode.trim())
  }

  findByProductId(productId: string): ProductBarcode[] {
    return this.barcodes.findByProductId(productId)
  }

  create(input: ProductBarcodeInput): ProductBarcode {
    this.requireEditPermission()
    const errors = validateProductBarcodeInput(input)
    if (errors.length > 0) throw new ValidationError(errors.join('. '))

    const normalized = normalizeProductBarcodeInput(input)

    return this.tx.run(() => {
      const existing = this.barcodes.findByBarcode(normalized.barcode)
      if (existing && !existing.deleted) {
        throw new ValidationError(`El código de barras "${normalized.barcode}" ya está registrado`)
      }

      const now = new Date().toISOString()
      // Se inserta sin primariedad para no chocar con el índice único y se
      // conmuta después dentro de la misma transacción.
      const created = this.barcodes.create({
        ...normalized,
        isPrimary: false,
        id: `bc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: now,
        updatedAt: now
      })
      this.syncPrimary(normalized.productId, created.id, normalized.isPrimary, false)
      return this.barcodes.findById(created.id) as ProductBarcode
    })
  }

  update(barcode: ProductBarcode): ProductBarcode {
    this.requireEditPermission()
    const existing = this.barcodes.findById(barcode.id)
    if (!existing) throw new NotFoundError('Código de barras no encontrado')

    const errors = validateProductBarcodeInput(barcode)
    if (errors.length > 0) throw new ValidationError(errors.join('; '))

    const normalized = normalizeProductBarcodeInput({ ...barcode, productId: existing.productId })

    return this.tx.run(() => {
      const byBarcode = this.barcodes.findByBarcode(normalized.barcode)
      if (byBarcode && byBarcode.id !== barcode.id && !byBarcode.deleted) {
        throw new ValidationError(
          `El código de barras "${normalized.barcode}" ya pertenece a otro producto`
        )
      }

      this.barcodes.update({
        ...existing,
        ...normalized,
        isPrimary: false,
        id: barcode.id
      })
      this.syncPrimary(existing.productId, barcode.id, normalized.isPrimary, existing.isPrimary)
      return this.barcodes.findById(barcode.id) as ProductBarcode
    })
  }

  softDelete(id: string): void {
    this.requireEditPermission()
    const existing = this.barcodes.findById(id)
    if (!existing) throw new NotFoundError('Código de barras no encontrado')

    this.tx.run(() => {
      const wasPrimary = existing.isPrimary
      this.barcodes.softDelete(id)
      if (wasPrimary) {
        const fallback = this.barcodes
          .findByProductId(existing.productId)
          .find((item) => item.id !== id && !item.deleted && item.active)
        this.barcodes.setPrimary(existing.productId, fallback?.id ?? null)
      }
    })
  }

  /**
   * Garantiza un único principal por producto. Si se retira la primariedad del
   * código que la tenía, se la pasa al primer código activo restante.
   */
  private syncPrimary(
    productId: string,
    barcodeId: string,
    shouldBePrimary: boolean,
    wasPrimary: boolean
  ): void {
    if (shouldBePrimary) {
      this.barcodes.setPrimary(productId, barcodeId)
      return
    }
    if (!wasPrimary) return

    const fallback = this.barcodes
      .findByProductId(productId)
      .find((item) => item.id !== barcodeId && !item.deleted && item.active)
    this.barcodes.setPrimary(productId, fallback?.id ?? null)
  }

  toggleStatus(id: string): ProductBarcode {
    this.requireEditPermission()
    if (!this.barcodes.findById(id)) throw new NotFoundError('Código de barras no encontrado')
    return this.barcodes.toggleStatus(id)
  }

  private requireEditPermission(): void {
    this.auth.requirePermission('inventory', 'El usuario no tiene acceso al módulo de inventario.')
    this.auth.requirePermission(
      'CAN_EDIT_PRODUCT',
      'El usuario no tiene permiso para editar los datos del producto.'
    )
  }
}
