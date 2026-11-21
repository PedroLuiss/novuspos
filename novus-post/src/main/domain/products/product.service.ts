import type {
  Product,
  ProductInput,
  ProductFilter,
  ProductPageQuery,
  ProductPageResult,
  ProductCatalogStatsDelta,
  TaxRate,
  Brand,
  Supplier,
  ProductType
} from '@shared/contracts'
import type { ProductRepository } from '../../ports/product.repository'
import type { TaxRepository } from '../../ports/tax.repository'
import type { BrandRepository } from '../../ports/brand.repository'
import type { SupplierRepository } from '../../ports/supplier.repository'
import type { ProductTypeRepository } from '../../ports/product-type.repository'
import type { ProductBatchRepository } from '../../ports/product-batch.repository'
import type { ProductBarcodeRepository } from '../../ports/product-barcode.repository'
import type { TransactionRunner } from '../../ports/transaction'
import { detectBarcodeFormat } from '@shared/lib/product-barcode'
import {
  formatProductAttributes,
  parseProductAttributes,
  serializeVariantAttributeNames
} from '@shared/lib/product-variants'
import type { AuthService } from '../auth/auth.service'
import { NotFoundError, ValidationError } from '../shared/errors'
import { normalizeProductInput, validateProductInput } from './product.entity'

/** Servicio de dominio de productos. Puro: solo depende de puertos y entidades. */
export class ProductService {
  constructor(
    private readonly products: ProductRepository,
    private readonly taxes: TaxRepository,
    private readonly brands: BrandRepository,
    private readonly suppliers: SupplierRepository,
    private readonly productTypes: ProductTypeRepository,
    private readonly batches: ProductBatchRepository,
    private readonly barcodes: ProductBarcodeRepository,
    private readonly auth: AuthService,
    private readonly tx: TransactionRunner
  ) {}

  list(filter?: ProductFilter): Product[] {
    return this.products.findAll(filter)
  }

  listPage(query: ProductPageQuery): ProductPageResult {
    const page = Math.max(1, Math.floor(query.page) || 1)
    const pageSize = Math.min(100, Math.max(1, Math.floor(query.pageSize) || 50))
    return this.products.findPage({ ...query, page, pageSize })
  }

  getById(id: string): Product | null {
    return this.products.findById(id)
  }

  listVariants(parentId: string): Product[] {
    return this.products.findByParentId(parentId)
  }

  create(input: ProductInput): Product {
    this.requireInventoryPermission('CAN_CREATE_PRODUCT', 'crear productos')
    const errors = validateProductInput(input)
    if (errors.length > 0) throw new ValidationError(errors.join('. '))

    const tax = this.resolveTax(input.taxId)
    const brand = this.resolveBrand(input.brandId)
    const supplier = this.resolveSupplier(input.supplierId)
    const type = this.resolveProductType(input.typeId)
    this.resolveParent(input.parentId)
    const normalized = normalizeProductInput({
      ...input,
      brandId: brand?.id,
      supplierId: supplier?.id,
      typeId: type?.id,
      taxId: tax?.id,
      hasTax: tax ? tax.rate > 0 : false
    })
    if (normalized.stock > 0) {
      this.auth.requirePermission(
        'CAN_ADJUST_STOCK',
        'El usuario no tiene permiso para asignar existencias iniciales.'
      )
    }
    if (this.products.findByCode(normalized.code)) {
      throw new ValidationError(`El código "${normalized.code}" ya está registrado`)
    }

    const now = new Date().toISOString()
    return this.tx.run(() => {
      if (normalized.parentId) this.validateVariant(normalized.parentId, normalized.attributes)
      const created = this.products.create({
        ...normalized,
        id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: now,
        updatedAt: now
      })
      // El stock inicial se copia al lote antes de releer el producto: para un
      // producto con lotes, `created.stock` ya es el stock efectivo (suma de
      // lotes) y valdría 0 porque todavía no existe ningún lote.
      if (normalized.trackBatches) this.ensureInitialBatch(created.id, normalized.stock)
      this.ensurePrimaryBarcode(created)
      return this.products.findById(created.id) ?? created
    })
  }

  update(product: Product): Product {
    this.requireInventoryPermission('CAN_EDIT_PRODUCT', 'editar productos')
    const existing = this.products.findById(product.id)
    if (!existing) throw new NotFoundError('Producto no encontrado')

    if (product.costPrice !== existing.costPrice || product.salePrice !== existing.salePrice) {
      this.auth.requirePermission(
        'CAN_MODIFY_PRICE',
        'El usuario no tiene permiso para modificar costos o precios.'
      )
    }
    if (product.stock !== existing.stock) {
      this.auth.requirePermission(
        'CAN_ADJUST_STOCK',
        'El usuario no tiene permiso para modificar las existencias.'
      )
    }
    if (product.active !== existing.active) {
      this.auth.requirePermission(
        'CAN_DELETE_PRODUCT',
        'El usuario no tiene permiso para activar o desactivar productos.'
      )
    }

    const errors = validateProductInput(product)
    if (errors.length > 0) throw new ValidationError(errors.join('; '))

    const tax = this.resolveTax(product.taxId)
    const brand = this.resolveBrand(product.brandId)
    const supplier = this.resolveSupplier(product.supplierId)
    const type = this.resolveProductType(product.typeId)
    this.resolveParent(product.parentId, product.id)
    const normalized = normalizeProductInput({
      ...product,
      brandId: brand?.id,
      supplierId: supplier?.id,
      typeId: type?.id,
      taxId: tax?.id,
      hasTax: tax ? tax.rate > 0 : false
    })
    const byCode = this.products.findByCode(normalized.code)
    if (byCode && byCode.id !== product.id) {
      throw new ValidationError(`El código ${normalized.code} ya pertenece a otro producto`)
    }

    return this.tx.run(() => {
      if (normalized.parentId) {
        if (this.products.findByParentId(product.id).some((v) => !v.deleted)) {
          throw new ValidationError(
            'Un producto que ya tiene variantes no puede convertirse en variante de otro producto.'
          )
        }
        this.validateVariant(normalized.parentId, normalized.attributes, product.id)
      } else if (normalized.variantAttrs !== existing.variantAttrs) {
        this.validateParentAttributes(normalized, product.id)
      }

      const updated = this.products.update({ ...normalized, id: product.id })
      this.propagateInheritedFields(existing, normalized)
      // Al activar el control de lotes, el lote inicial debe recibir el stock que
      // el producto tenía antes de activarlo. No se puede usar `updated.stock`
      // porque ya es el stock efectivo (suma de lotes) y valdría 0.
      if (normalized.trackBatches && !existing.trackBatches) {
        this.ensureInitialBatch(updated.id, normalized.stock)
      }
      this.ensurePrimaryBarcode(updated)
      return this.products.findById(product.id) ?? updated
    })
  }

  /**
  /**
   * Sincroniza `products.code` con un código principal real en `product_barcodes`
   * si el producto todavía no tiene uno. Evita que el editor muestre 0 códigos
   * y que las etiquetas dependan del valor legacy.
   */
  private ensurePrimaryBarcode(product: Product): void {
    const existing = this.barcodes.findByProductId(product.id).filter((b) => !b.deleted)
    if (existing.some((b) => b.isPrimary)) return

    const code = product.code?.trim()
    if (!code) return

    const matching = existing.find((b) => b.barcode.trim().toLowerCase() === code.toLowerCase())
    if (matching) {
      this.barcodes.setPrimary(product.id, matching.id)
      return
    }

    const byCode = this.barcodes.findByBarcode(code)
    if (byCode && !byCode.deleted) {
      if (byCode.productId === product.id) this.barcodes.setPrimary(product.id, byCode.id)
      return
    }

    const now = new Date().toISOString()
    const created = this.barcodes.create({
      id: `bc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: product.id,
      barcode: code,
      format: detectBarcodeFormat(code) ?? 'OTRO',
      label: 'Código principal',
      isPrimary: false,
      active: true,
      createdAt: now,
      updatedAt: now
    })
    this.barcodes.setPrimary(product.id, created.id)
  }

  /**
   * Crea el lote inicial con la cantidad indicada (el stock previo del producto).
   * Se omite si ya hay lotes o si la cantidad es cero.
   */
  private ensureInitialBatch(productId: string, quantity: number): void {
    if (this.batches.findByProductId(productId, false).length > 0) return
    const initialQuantity = Number.isFinite(quantity) ? Math.max(0, quantity) : 0
    if (initialQuantity <= 0) return

    const now = new Date().toISOString()
    this.batches.create({
      id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId,
      batchNumber: `INICIAL-${now.slice(0, 10)}`,
      quantity: initialQuantity,
      active: true,
      enteredAt: now,
      createdAt: now,
      updatedAt: now
    })
  }

  softDelete(id: string): ProductCatalogStatsDelta {
    this.requireInventoryPermission('CAN_DELETE_PRODUCT', 'dar de baja productos')
    const statsDelta = this.products.softDeleteCascade(id)
    if (!statsDelta) throw new NotFoundError('Producto no encontrado')
    return statsDelta
  }

  toggleStatus(id: string): Product {
    this.requireInventoryPermission('CAN_DELETE_PRODUCT', 'activar o desactivar productos')
    if (!this.products.findById(id)) throw new NotFoundError('Producto no encontrado')
    return this.products.toggleStatus(id)
  }

  private requireInventoryPermission(
    permission: 'CAN_CREATE_PRODUCT' | 'CAN_EDIT_PRODUCT' | 'CAN_DELETE_PRODUCT',
    action: string
  ): void {
    this.auth.requirePermission('inventory', 'El usuario no tiene acceso al módulo de inventario.')
    this.auth.requirePermission(permission, `El usuario no tiene permiso para ${action}.`)
  }

  /**
   * Resuelve la tasa del producto. Si no se indicó, aplica la predeterminada
   * del catálogo para que ningún producto quede sin clasificación fiscal.
   */
  private resolveTax(taxId?: string): TaxRate | null {
    let tax: TaxRate | null = null

    if (taxId?.trim()) {
      tax = this.taxes.findById(taxId.trim())
      if (!tax || tax.deleted) {
        throw new ValidationError('La tasa de impuesto seleccionada no existe.')
      }
      if (!tax.active) {
        throw new ValidationError(`La tasa "${tax.name}" está inactiva. Active otra tasa.`)
      }
      return tax
    }

    tax = this.taxes.findDefault()
    if (!tax) {
      throw new ValidationError(
        'No hay tasas de impuesto configuradas. Cree una en Ajustes › Impuestos.'
      )
    }
    return tax
  }

  /**
   * Resuelve la marca del producto. Opcional: si se proporciona, debe existir y estar activa.
   */
  private resolveBrand(brandId?: string): Brand | null {
    if (!brandId?.trim()) return null
    const brand = this.brands.findById(brandId.trim())
    if (!brand || brand.deleted) {
      throw new ValidationError('La marca seleccionada no existe.')
    }
    if (!brand.active) {
      throw new ValidationError(`La marca "${brand.name}" está inactiva.`)
    }
    return brand
  }

  /**
   * Resuelve el proveedor del producto. Opcional: si se proporciona, debe existir y estar activo.
   */
  private resolveSupplier(supplierId?: string): Supplier | null {
    if (!supplierId?.trim()) return null
    const supplier = this.suppliers.findById(supplierId.trim())
    if (!supplier || supplier.deleted) {
      throw new ValidationError('El proveedor seleccionado no existe.')
    }
    if (!supplier.active) {
      throw new ValidationError(`El proveedor "${supplier.name}" está inactivo.`)
    }
    return supplier
  }

  /**
   * Resuelve el tipo de producto. Opcional: si se proporciona, debe existir y estar activo.
   */
  private resolveProductType(typeId?: string): ProductType | null {
    if (!typeId?.trim()) return null
    const type = this.productTypes.findById(typeId.trim())
    if (!type || type.deleted) {
      throw new ValidationError('El tipo de producto seleccionado no existe.')
    }
    if (!type.active) {
      throw new ValidationError(`El tipo de producto "${type.name}" está inactivo.`)
    }
    return type
  }

  /**
   * Valida los atributos de una variante contra la definición del padre y evita
   * combinaciones duplicadas entre hermanos. Si el padre aún no definió sus
   * atributos, los toma de la primera variante.
   */
  private validateVariant(parentId: string, attributes?: string, currentId?: string): void {
    const parent = this.products.findById(parentId)
    if (!parent || parent.deleted) {
      throw new ValidationError('El producto padre de la variante no existe')
    }

    const attrs = parseProductAttributes(attributes)
    if (attrs.length === 0) {
      throw new ValidationError('La variante debe tener al menos un atributo con valor.')
    }
    if (attrs.some((a) => !a.name.trim() || !a.value.trim())) {
      throw new ValidationError('Todos los atributos de la variante deben tener nombre y valor.')
    }

    const same = (a: string, b: string): boolean =>
      a.trim().toLowerCase() === b.trim().toLowerCase()
    const defined = parseProductAttributes(parent.variantAttrs).map((a) => a.name.trim())

    if (defined.length === 0) {
      this.products.update({
        ...parent,
        variantAttrs: serializeVariantAttributeNames(attrs.map((a) => a.name))
      })
    } else {
      const missing = defined.filter((name) => !attrs.some((a) => same(a.name, name)))
      const extra = attrs.filter((a) => !defined.some((name) => same(name, a.name)))
      if (missing.length > 0 || extra.length > 0) {
        throw new ValidationError(
          `Los atributos de la variante deben ser exactamente: ${defined.join(', ')}.`
        )
      }
    }

    const signature = (value?: string): string =>
      parseProductAttributes(value)
        .map((a) => `${a.name.trim().toLowerCase()}=${a.value.trim().toLowerCase()}`)
        .sort()
        .join('|')
    const duplicate = this.products
      .findByParentId(parentId)
      .find(
        (v) => v.id !== currentId && !v.deleted && signature(v.attributes) === signature(attributes)
      )
    if (duplicate) {
      throw new ValidationError(`Ya existe una variante con ${formatProductAttributes(attrs)}.`)
    }
  }

  /** Evita cambiar los atributos del padre dejando variantes incompatibles. */
  private validateParentAttributes(product: ProductInput, productId: string): void {
    const defined = parseProductAttributes(product.variantAttrs).map((a) => a.name.trim())
    if (defined.length === 0) return

    for (const variant of this.products.findByParentId(productId).filter((v) => !v.deleted)) {
      const names = parseProductAttributes(variant.attributes).map((a) => a.name.trim())
      if (names.length === 0) continue
      const invalid = names.filter(
        (name) => !defined.some((d) => d.toLowerCase() === name.toLowerCase())
      )
      if (invalid.length > 0) {
        throw new ValidationError(
          `La variante "${variant.name}" usa atributos que ya no están definidos (${invalid.join(', ')}).`
        )
      }
    }
  }

  /**
   * Propaga al hijo los campos heredados del padre solo cuando el hijo todavía
   * conservaba el valor anterior; así se respetan las personalizaciones.
   */
  private propagateInheritedFields(existing: Product, next: ProductInput): void {
    if (next.parentId) return
    const keys: Array<'category' | 'unit' | 'taxId' | 'brandId' | 'supplierId' | 'hasTax'> = [
      'category',
      'unit',
      'taxId',
      'brandId',
      'supplierId',
      'hasTax'
    ]
    const changed = keys.filter((key) => next[key] !== existing[key])
    if (changed.length === 0) return

    for (const child of this.products.findByParentId(existing.id).filter((v) => !v.deleted)) {
      const patch: Record<string, unknown> = {}
      for (const key of changed) {
        if (child[key] === existing[key]) patch[key] = next[key]
      }
      if (Object.keys(patch).length > 0) {
        this.products.update({ ...child, ...patch } as Product)
      }
    }
  }

  /**
   * Valida el producto padre de una variante: debe existir, no estar eliminado
   * y no puede ser a su vez una variante (se prohíben variantes anidadas).
   */
  private resolveParent(parentId?: string, currentId?: string): void {
    if (!parentId?.trim()) return
    if (currentId && parentId.trim() === currentId) {
      throw new ValidationError('Un producto no puede ser su propio padre')
    }
    const parent = this.products.findById(parentId.trim())
    if (!parent || parent.deleted) {
      throw new ValidationError('El producto padre de la variante no existe')
    }
    if (parent.parentId) {
      throw new ValidationError('No se permiten variantes dentro de otras variantes')
    }
  }
}
