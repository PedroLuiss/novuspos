/**
 * Contrato compartido de atributos de variantes de producto.
 * Una variante es un producto hijo (`products.parent_id`) con un conjunto de
 * atributos (talla, color, material, etc.) almacenados como JSON.
 * El producto padre agrupa las variantes; cada variante tiene su propio SKU,
 * precio, stock e impuestos y se vende de forma independiente en el POS.
 */

/** Un par atributo=valor (p. ej. { name: 'Talla', value: 'M' }). */
export interface ProductAttribute {
  name: string
  value: string
}

/** Nombre de los atributos que definen las variantes de un padre (p. ej. ['Talla', 'Color']). */
export type VariantAttributeNames = string[]

/** Utilidades puras para manejar el JSON de atributos de forma segura. */
export function parseProductAttributes(json?: string | null): ProductAttribute[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (a: unknown): a is ProductAttribute =>
        typeof a === 'object' &&
        a !== null &&
        typeof (a as ProductAttribute).name === 'string' &&
        typeof (a as ProductAttribute).value === 'string'
    )
  } catch {
    return []
  }
}

/** Serializa atributos a JSON compacto, o cadena vacía si no hay. */
export function serializeProductAttributes(attrs: ProductAttribute[]): string {
  if (!attrs || attrs.length === 0) return ''
  return JSON.stringify(
    attrs
      .filter((a) => a.name.trim() && a.value.trim())
      .map((a) => ({ name: a.name.trim(), value: a.value.trim() }))
  )
}

/**
 * Serializa solo los NOMBRES de los atributos que definen las variantes de un
 * padre. A diferencia de `serializeProductAttributes`, conserva entradas con
 * valor vacío: en `variantAttrs` el valor no existe todavía, solo el nombre.
 */
export function serializeVariantAttributeNames(names: string[]): string {
  const unique = new Map<string, string>()
  for (const name of names) {
    const trimmed = name.trim()
    if (trimmed && !unique.has(trimmed.toLowerCase())) {
      unique.set(trimmed.toLowerCase(), trimmed)
    }
  }
  if (unique.size === 0) return ''
  return JSON.stringify([...unique.values()].map((name) => ({ name, value: '' })))
}

/** Etiqueta legible de los atributos: "Talla M · Color Rojo". */
export function formatProductAttributes(attrs: ProductAttribute[]): string {
  return attrs.map((a) => `${a.name}: ${a.value}`).join(' · ')
}
