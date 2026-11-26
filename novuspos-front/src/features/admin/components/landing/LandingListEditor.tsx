import { MS } from '@/shared/ui/MS'
import { adminCompactButton } from '../../lib/adminStyles'
import { LandingField } from './LandingField'

interface ListColumn<T> {
  key: keyof T & string
  label: string
  multiline?: boolean
  /** Lista de valores separados por comas (categorías de productos y enlaces del pie). */
  joined?: boolean
}

interface Props<T> {
  items: T[]
  columns: ListColumn<T>[]
  onChange: (items: T[]) => void
  create: () => T
  addLabel: string
}

function readValue(item: object, key: string): string {
  const value = (item as Record<string, unknown>)[key]
  if (Array.isArray(value)) return value.filter((entry) => typeof entry === 'string').join(', ')
  return typeof value === 'string' ? value : ''
}

/** Editor reutilizable de listas: textos, preguntas, filas, tarjetas y capturas. */
export function LandingListEditor<T extends object>({ items, columns, onChange, create, addLabel }: Props<T>) {
  const update = (index: number, key: string, value: string) => {
    const field = columns.find((column) => column.key === key)
    const next = field?.joined
      ? value.split(',').map((entry) => entry.trim()).filter(Boolean)
      : value
    onChange(items.map((item, position) => (position === index ? { ...item, [key]: next } as T : item)))
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-space-xs">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-space-xs rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
          <div className="flex items-center justify-between gap-space-xs">
            <span className="truncate font-label-sm text-label-sm font-bold text-primary">
              {readValue(item, columns[0]?.key ?? '').slice(0, 56) || `Elemento ${index + 1}`}
            </span>
            <div className="flex shrink-0 gap-1">
              <button type="button" aria-label="Subir" className={adminCompactButton} disabled={index === 0} onClick={() => move(index, -1)}>
                <MS name="arrow_upward" className="text-[14px]" />
              </button>
              <button type="button" aria-label="Bajar" className={adminCompactButton} disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                <MS name="arrow_downward" className="text-[14px]" />
              </button>
              <button type="button" aria-label="Eliminar" className={adminCompactButton} onClick={() => onChange(items.filter((_, position) => position !== index))}>
                <MS name="delete_outline" className="text-[14px]" />
              </button>
            </div>
          </div>
          {columns.map((column) => (
            <LandingField
              key={column.key}
              label={column.label}
              value={readValue(item, column.key)}
              multiline={column.multiline}
              rows={column.multiline ? 3 : undefined}
              onChange={(value) => update(index, column.key, value)}
            />
          ))}
        </div>
      ))}
      <button type="button" className={adminCompactButton} onClick={() => onChange([...items, create()])}>
        <MS name="add" className="text-[15px]" /> {addLabel}
      </button>
    </div>
  )
}
