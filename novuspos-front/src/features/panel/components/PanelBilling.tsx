import { invoices } from '@/features/panel/data/panel-data'
import { MS } from '@/shared/ui/MS'

/** Membresía e historial de facturación (réplica de Stitch). */
export function PanelBilling() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <MS name="receipt_long" className="text-primary text-[24px]" />
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Membresía &amp; Historial de Facturación
            </h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Plan mensual sin plazo forzoso.</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <button className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5">
            <MS name="edit" className="text-[16px]" />
            Cambiar Tarjeta
          </button>
          <button className="px-space-md py-2 rounded-lg bg-error-container hover:bg-error-container/80 text-on-error-container font-label-md text-label-md transition-colors font-medium">
            Pausar Suscripción
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md rounded-xl bg-surface-container-low">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-8 rounded bg-surface-container-lowest shadow-sm flex items-center justify-center font-mono font-black text-primary text-[14px] tracking-tighter">
            VISA
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-semibold text-on-surface">Visa Débito •••• 4821</span>
            <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">Expira 08/2028</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Costo Recurrente
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">$4.99 USD</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">/ al mes por comercio</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Próximo Cobro Automático
          </span>
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md font-bold text-on-surface font-mono">26 de Abril, 2026</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">
              AL DÍA
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-space-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-high/40 rounded-lg">
              <th className="py-space-sm px-space-md rounded-l-lg">Folio Fiscal</th>
              <th className="py-space-sm px-space-md">Período Facturado</th>
              <th className="py-space-sm px-space-md">Fecha de Cobro</th>
              <th className="py-space-sm px-space-md">Método</th>
              <th className="py-space-sm px-space-md">Monto Total</th>
              <th className="py-space-sm px-space-md">Estado</th>
              <th className="py-space-sm px-space-md text-right rounded-r-lg">Descargas</th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm divide-y divide-surface-container">
            {invoices.map((invoice) => (
              <tr key={invoice.folio} className="hover:bg-surface-container-low transition-colors">
                <td className="py-space-md px-space-md font-mono font-semibold text-on-surface">{invoice.folio}</td>
                <td className="py-space-md px-space-md text-on-surface">{invoice.period}</td>
                <td className="py-space-md px-space-md font-mono text-on-surface-variant">{invoice.chargeDate}</td>
                <td className="py-space-md px-space-md font-mono text-on-surface-variant">{invoice.method}</td>
                <td className="py-space-md px-space-md font-mono font-bold text-on-surface">{invoice.amount}</td>
                <td className="py-space-md px-space-md">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold">
                    {invoice.status}
                  </span>
                </td>
                <td className="py-space-md px-space-md text-right">
                  <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors">
                    <MS name="picture_as_pdf" className="text-[15px]" />
                    Factura PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
