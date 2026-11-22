import { mockCartRows, mockProducts } from '@/features/landing/data/landing-data'
import { MS } from './HeroHeader'
import { CartRow, ProductCard } from './product/ProductCard'

const categories = ['Todos (1,420)', 'Abarrotes', 'Bebidas Frías', 'Frutas & Báscula', 'Lácteos']

const hotkeys = [
  '[F1] Venta POS',
  '[F2] Inventario',
  '[F3] Kardex',
  '[F4] Corte Z',
  '[F5] Clientes/Créditos',
  '[ALT+P] En Espera',
]

/** Mockup del terminal POS (WinUI 3 Fluent POS Terminal). */
export function HeroMockup() {
  return (
    <div
      className="w-full mt-space-xl rounded-xl bg-surface-container-lowest shadow-2xl overflow-hidden text-left"
      id="interfaz-en-vivo"
    >
      {/* Windows 11 Title Bar */}
      <div className="h-10 w-full bg-surface-container px-space-md flex items-center justify-between select-none">
        <div className="flex items-center gap-space-sm">
          <span className="w-3.5 h-3.5 rounded-sm bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">
            N
          </span>
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">
            NovusPOS Desktop v2.4.0 — [Caja 01 - Sucursal Central] — Sesión: Marco Cajero
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary bg-surface-container-lowest px-space-sm py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> COM3 Báscula: 0.000 kg
          </span>
          <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-primary bg-surface-container-lowest px-space-sm py-0.5 rounded">
            <MS name="print" className="text-[14px]" /> ESC/POS 80mm
          </span>
          <div className="flex items-center ml-space-sm text-on-surface-variant">
            <span className="w-7 h-6 flex items-center justify-center hover:bg-surface-container-high rounded text-[12px]">
              −
            </span>
            <span className="w-7 h-6 flex items-center justify-center hover:bg-surface-container-high rounded text-[12px]">
              □
            </span>
            <span className="w-7 h-6 flex items-center justify-center hover:bg-error hover:text-on-error rounded text-[12px]">
              ×
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Sub-header / Quick Hotkeys Ribbon */}
      <div className="h-12 w-full bg-surface-container-low px-space-md flex items-center justify-between overflow-x-auto gap-space-sm">
        <div className="flex items-center gap-space-xs font-label-sm text-label-sm shrink-0">
          {hotkeys.map((key, i) => (
            <span
              key={key}
              className={`px-space-sm py-1 rounded font-mono ${
                i === 0 ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface'
              }`}
            >
              {key}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">
            SQLite Mode: WAL (Transacciones &lt; 2ms)
          </span>
          <span className="w-2 h-2 rounded-full bg-secondary" />
        </div>
      </div>

      {/* Split View POS Register Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left: Catalog & Quick Action Panel (7 Cols) */}
        <div className="lg:col-span-7 p-space-md flex flex-col gap-space-md bg-surface">
          {/* Search & Barcode Input Field */}
          <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-lg shadow-sm">
            <MS name="barcode_scanner" className="text-primary text-[28px]" />
            <div className="flex-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase font-mono tracking-wider">
                Escaneo rápido o Búsqueda por SKU [ALT+B]
              </span>
              <input
                className="w-full bg-transparent font-numeric-keypad text-numeric-keypad text-on-surface focus:outline-none"
                readOnly
                defaultValue="7501055310884 - Coca Cola Original 600ml"
              />
            </div>
            <button
              type="button"
              className="px-space-md py-space-xs rounded bg-surface-container text-on-surface font-label-md text-label-md font-semibold"
            >
              Buscar [F6]
            </button>
          </div>

          {/* Categories Bar */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs">
            {categories.map((cat, i) => (
              <span
                key={cat}
                className={`px-space-md py-space-xs rounded-full font-label-md text-label-md shrink-0 ${
                  i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Fast Touch / Click Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm flex-1">
            {mockProducts.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>

          {/* RS-232 Scale Status Feed Banner */}
          <div className="p-space-sm rounded-lg bg-surface-container-high flex items-center justify-between font-mono text-on-surface font-label-sm text-label-sm">
            <div className="flex items-center gap-space-xs">
              <MS name="scale" className="text-secondary text-[18px]" />
              <span>
                BÁSCULA SERIAL RS-232: <strong>TORREY L-EQ 10kg</strong>
              </span>
            </div>
            <span className="text-secondary font-bold">1.450 KG ESTABLE (TARA: 0.000)</span>
          </div>
        </div>

        {/* Right: Cart Ledger & Totalizers Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-md flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <MS name="receipt_long" className="text-on-surface-variant" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Ticket #00492</span>
              </div>
              <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded bg-primary-fixed text-primary font-bold">
                Cajero: Turno Mañana
              </span>
            </div>

            {/* Cart Rows Table */}
            <div className="flex flex-col gap-space-xs overflow-y-auto max-h-[220px]">
              {mockCartRows.map((row) => (
                <CartRow key={row.name} row={row} />
              ))}
            </div>
          </div>

          {/* Big Screen Totalizer & Dual Checkout Buttons */}
          <div className="mt-space-md pt-space-sm bg-surface-container rounded-xl p-space-md">
            <div className="flex justify-between items-baseline mb-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase font-bold tracking-wider">
                Subtotal:
              </span>
              <span className="font-mono text-on-surface font-bold font-numeric-keypad text-numeric-keypad">$167.10</span>
            </div>
            <div className="flex justify-between items-baseline mb-space-sm">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase font-bold tracking-wider">
                Impuesto (16% IVA):
              </span>
              <span className="font-mono text-on-surface-variant font-numeric-keypad text-numeric-keypad">$0.00 Inc.</span>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-baseline justify-between mb-space-md">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">TOTAL VENTA</span>
              <span className="font-numeric-total text-numeric-total font-mono text-primary font-bold tracking-tight">
                $167.10
              </span>
            </div>

            {/* High Velocity Register Keys */}
            <div className="grid grid-cols-2 gap-space-sm">
              <button
                type="button"
                className="p-space-md rounded-lg bg-secondary text-on-secondary font-headline-sm text-headline-sm font-bold flex flex-col items-center justify-center shadow-lg hover:opacity-95 active:scale-95 transition-all"
              >
                <span className="font-mono text-[11px] opacity-80 uppercase tracking-widest">[ALT + Q]</span>
                <span>Cobro Rápido</span>
                <span className="font-body-sm text-body-sm font-normal">Efectivo Exacto</span>
              </button>
              <button
                type="button"
                className="p-space-md rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-bold flex flex-col items-center justify-center shadow-lg hover:opacity-95 active:scale-95 transition-all"
              >
                <span className="font-mono text-[11px] opacity-80 uppercase tracking-widest">[F12]</span>
                <span>Cobro Normal</span>
                <span className="font-body-sm text-body-sm font-normal">Mixto / Tarjeta / Crédito</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
