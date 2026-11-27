/** Utilidades del compose de correos: HTML permitido, texto plano y plantilla. */

const ALLOWED_TAGS = new Set([
  'P', 'BR', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4',
  'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI',
  'A', 'IMG', 'BLOCKQUOTE', 'HR',
])

const ALLOWED_STYLES = new Set([
  'color', 'background-color', 'font-size', 'font-weight', 'font-family',
  'font-style', 'text-align', 'line-height', 'margin', 'margin-top', 'margin-bottom',
  'padding', 'max-width', 'width', 'height', 'border-color', 'border-radius',
])

const DANGEROUS_STYLE = /url\(|expression|@import|behavior:|javascript:/i

/** Solo enlaces web y correo; nunca `javascript:` ni datos HTML. */
function normalizeUrl(value: string, image: boolean): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol)) {
      if (image || url.protocol !== 'mailto:') return null
    }
    return url.href
  } catch {
    return null
  }
}

export function isValidEmailUrl(value: string, image = false): boolean {
  return Boolean(normalizeUrl(value, image))
}

function copyAllowedStyle(source: HTMLElement, target: HTMLElement): void {
  const style = source.getAttribute('style')
  if (!style) return
  for (const declaration of style.split(';')) {
    const separator = declaration.indexOf(':')
    if (separator < 0) continue
    const property = declaration.slice(0, separator).trim().toLowerCase()
    const value = declaration.slice(separator + 1).trim()
    if (!ALLOWED_STYLES.has(property) || DANGEROUS_STYLE.test(value)) continue
    target.style.setProperty(property, value.slice(0, 200))
  }
}

function cleanNode(node: Node, doc: Document): Node | null {
  if (node.nodeType === 3) return doc.createTextNode(node.textContent ?? '')
  if (node.nodeType !== 1) return null

  const source = node as HTMLElement
  const tag = source.tagName
  const children = () => {
    const fragment = doc.createDocumentFragment()
    source.childNodes.forEach((child) => {
      const cleaned = cleanNode(child, doc)
      if (cleaned) fragment.appendChild(cleaned)
    })
    return fragment
  }

  if (!ALLOWED_TAGS.has(tag)) return children()

  const target = doc.createElement(tag.toLowerCase())

  if (tag === 'A') {
    const href = normalizeUrl(source.getAttribute('href') ?? '', false)
    if (href) {
      target.setAttribute('href', href)
      target.setAttribute('target', '_blank')
      target.setAttribute('rel', 'noopener noreferrer')
    }
  }

  if (tag === 'IMG') {
    const src = normalizeUrl(source.getAttribute('src') ?? '', true)
    if (!src) return null
    target.setAttribute('src', src)
    target.setAttribute('alt', (source.getAttribute('alt') ?? '').slice(0, 200))
  }

  copyAllowedStyle(source, target)
  if (!['BR', 'HR', 'IMG'].includes(tag)) target.appendChild(children())
  return target
}

/** HTML listo para guardar y enviar. Quita scripts, eventos, estilos peligrosos y URLs no seguras. */
export function sanitizeEmailHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const root = doc.createElement('div')
  doc.body.childNodes.forEach((node) => {
    const cleaned = cleanNode(node, doc)
    if (cleaned) root.appendChild(cleaned)
  })
  return root.innerHTML
}

/** Texto plano para historial, búsqueda y clientes de correo sin HTML. */
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}
