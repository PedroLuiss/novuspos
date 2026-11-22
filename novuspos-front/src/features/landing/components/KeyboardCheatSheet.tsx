import type { Shortcut } from '@/features/landing/data/landing-data'
import { shortcuts } from '@/features/landing/data/landing-data'

const ringClass: Record<string, string> = {
  primary: 'ring-2 ring-primary',
  secondary: 'ring-2 ring-secondary',
}

const titleToneClass: Record<string, string> = {
  'on-surface': 'text-on-surface',
  primary: 'text-primary',
  secondary: 'text-secondary',
}

/** Bloque de tecla del atajo. */
function KeyCap({ shortcut }: { shortcut: Shortcut }) {
  if (shortcut.keyVariant === 'primary') {
    return (
      <div className="w-12 h-10 rounded bg-primary text-on-primary font-mono font-bold text-center flex items-center justify-center text-[18px] shadow-sm mb-space-sm">
        {shortcut.key}
      </div>
    )
  }

  if (shortcut.keyVariant === 'secondary') {
    return (
      <div className="px-2 h-10 rounded bg-secondary text-on-secondary font-mono font-bold text-center flex items-center justify-center text-[13px] shadow-sm mb-space-sm">
        {shortcut.key}
      </div>
    )
  }

  return (
    <div className="w-12 h-10 rounded bg-surface-container text-on-surface font-mono font-bold text-center flex items-center justify-center text-[18px] shadow-sm mb-space-sm">
      {shortcut.key}
    </div>
  )
}

/** Sección de atajos de teclado (cero ratón). */
export function KeyboardCheatSheet() {
  return (
    <section className="w-full bg-surface-container-low py-space-xl">
      <div className="px-margin max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
              ERGONOMÍA PARA CAJEROS EXPERTOS
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Atajos de Teclado: Cero Ratón, Máxima Velocidad
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Diseñado para cajeros de supermercado, refaccionarias y ferreterías que cobran sin levantar las manos del
            teclado físico.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-space-sm">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between ${
                shortcut.ring ? ringClass[shortcut.ring] : ''
              }`}
            >
              <KeyCap shortcut={shortcut} />
              <div>
                <span
                  className={`font-label-md text-label-md block font-bold ${
                    titleToneClass[shortcut.titleTone ?? 'on-surface']
                  }`}
                >
                  {shortcut.title}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{shortcut.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
