import { MS } from '@/shared/ui/MS'
import { supportTips } from '../data/support-data'

/** Ayuda breve para que el reporte sea útil desde el primer mensaje. */
export function SupportTips() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-sm h-full">
      <div className="flex items-center gap-space-xs">
        <MS name="tips_and_updates" className="text-secondary text-[22px]" />
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Antes de enviar</h2>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Un buen detalle nos ayuda a entender el problema más rápido:
      </p>
      <ul className="flex flex-col gap-space-sm">
        {supportTips.map((tip) => (
          <li key={tip} className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <MS name="check" className="text-secondary text-[16px] shrink-0 mt-0.5" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-space-md flex items-start gap-space-xs rounded-lg bg-surface-container p-space-sm">
        <MS name="lock" className="text-primary text-[18px] shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Tu reporte queda asociado a tu cuenta. Solo el equipo de soporte puede verlo.
        </p>
      </div>
    </div>
  )
}
