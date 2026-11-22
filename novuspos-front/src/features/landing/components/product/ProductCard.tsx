import type { MockCartRow, MockProduct } from '@/features/landing/data/landing-data'

/** Tarjeta de producto del catálogo del terminal (idéntica a Stitch). */
export function ProductCard({ product }: { product: MockProduct }) {
  return (
    <div
      className={`p-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-sm flex flex-col justify-between cursor-pointer ${
        product.active ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-space-xs">
          <span
            className={`font-label-sm text-label-sm font-mono ${
              product.active ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            {product.sku}
          </span>
          <span
            className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded font-mono ${
              product.active
                ? 'bg-surface-container-high text-on-surface'
                : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            {product.stock}
          </span>
        </div>
        <h4 className="font-label-md text-label-md text-on-surface font-bold">{product.name}</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{product.desc}</p>
      </div>
      <div className="mt-space-sm flex items-center justify-between">
        <span className="font-headline-sm text-headline-sm font-bold text-primary font-numeric-total">
          {product.price}
          {product.priceSuffix ? (
            <span className="font-body-sm text-body-sm text-on-surface-variant">{product.priceSuffix}</span>
          ) : null}
        </span>
        <span
          className={`w-7 h-7 rounded flex items-center justify-center font-bold ${
            product.active ? 'bg-primary text-on-primary' : 'bg-primary-fixed text-primary'
          }`}
        >
          {product.active ? '✓' : '+'}
        </span>
      </div>
    </div>
  )
}

/** Fila del carrito / ledger de ticket (idéntica a Stitch). */
export function CartRow({ row }: { row: MockCartRow }) {
  return (
    <div className={`p-space-xs rounded ${row.variant} flex items-center justify-between`}>
      <div className="min-w-0 pr-space-xs">
        <p className="font-label-md text-label-md text-on-surface font-bold truncate">{row.name}</p>
        <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
          {row.qty} × {row.unit}
        </span>
      </div>
      <div className="flex items-center gap-space-sm shrink-0">
        <span className="font-numeric-keypad text-numeric-keypad font-mono text-on-surface font-bold">{row.total}</span>
        <button
          type="button"
          aria-label={`Quitar ${row.name}`}
          className="w-6 h-6 rounded bg-surface-container hover:bg-error hover:text-on-error flex items-center justify-center text-[12px]"
        >
          ×
        </button>
      </div>
    </div>
  )
}
