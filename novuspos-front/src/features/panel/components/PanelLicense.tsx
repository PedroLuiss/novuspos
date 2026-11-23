import { useState } from 'react'
import { MS } from '@/shared/ui/MS'

/** Bloque de licencia y descargas (réplica de Stitch, 7/5 columnas). */
export function PanelLicense() {
  const [copied, setCopied] = useState(false)
  const [note, setNote] = useState(false)

  const copyToken = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
      <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <MS name="key" className="text-primary text-[22px]" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Licencia de Escritorio Windows
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-mono font-bold">
              VALIDADA
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
            Ingresa tu clave durante la configuración inicial de NovusPOS en tu computadora para tener todo listo desde
            el primer día.
          </p>
          <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Clave de Activación
              </span>
              <span className="font-numeric-keypad text-numeric-keypad font-mono text-primary font-bold tracking-widest select-all">
                NVUS-••••-••••-••••-••••
              </span>
            </div>
            <button
              className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold transition-all"
              onClick={copyToken}
            >
              <MS name={copied ? 'done' : 'content_copy'} className="text-[18px]" />
              <span>{copied ? '¡Copiado!' : 'Copiar Clave'}</span>
            </button>
          </div>
          <div className="rounded-lg bg-surface-container p-space-md flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-on-surface">
                Equipo principal asignado (Caja #1)
              </span>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Lista para usar
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs text-on-surface-variant">
              <div className="flex flex-col bg-surface-container-lowest p-space-xs px-space-sm rounded">
                <span className="font-label-sm text-[10px] uppercase font-mono text-outline">Nombre PC</span>
                <span className="font-label-md text-label-md font-mono text-on-surface font-semibold truncate">
                  DESKTOP-POS-CAJA1
                </span>
              </div>
              <div className="flex flex-col bg-surface-container-lowest p-space-xs px-space-sm rounded">
                <span className="font-label-sm text-[10px] uppercase font-mono text-outline">Sistema Operativo</span>
                <span className="font-label-md text-label-md font-mono text-on-surface font-semibold">
                  Windows 10 / 11 (64 bits)
                </span>
              </div>
              <div className="flex flex-col bg-surface-container-lowest p-space-xs px-space-sm rounded">
                <span className="font-label-sm text-[10px] uppercase font-mono text-outline">Equipo</span>
                <span className="font-label-md text-label-md font-mono text-on-surface font-semibold">Caja principal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-space-md mt-space-md">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {note ? 'Puedes cambiar de equipo desde la aplicación.' : '¿Deseas cambiar de equipo de cobro?'}
          </span>
          <button
            className="font-label-md text-label-md text-error hover:text-error/80 font-semibold flex items-center gap-1 transition-colors"
            onClick={() => setNote(true)}
          >
            <MS name="phonelink_erase" className="text-[16px]" />
            Cambiar equipo
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <MS name="system_update" className="text-secondary text-[22px]" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">NovusPOS para Windows</h2>
            </div>
            <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">Marzo 2026</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm">
            Descarga lista para instalar y empezar a vender.
          </p>
          <div className="flex flex-col gap-space-xs my-space-sm p-space-sm rounded-lg bg-surface-container-low">
            <span className="font-label-sm text-[11px] font-bold text-on-surface tracking-wider uppercase">
              Lo que incluye:
            </span>
            <div className="flex items-start gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <MS name="check" className="text-secondary text-[16px] shrink-0 mt-0.5" />
              <span>Peso automático desde tu báscula al cobrar.</span>
            </div>
            <div className="flex items-start gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <MS name="check" className="text-secondary text-[16px] shrink-0 mt-0.5" />
              <span>Etiquetas con código de barras en el tamaño que elijas.</span>
            </div>
            <div className="flex items-start gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <MS name="check" className="text-secondary text-[16px] shrink-0 mt-0.5" />
              <span>Tus ventas e inventario al día al abrir el programa.</span>
            </div>
          </div>
        </div>
        <div className="pt-space-md flex flex-col gap-space-xs">
          <a
            href="/#descargar"
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MS name="download_for_offline" className="text-[18px]" />
            Descargar instalador de Windows
          </a>
          <div className="flex items-center justify-between text-on-surface-variant px-space-xs pt-1">
            <span className="font-label-sm text-[11px] font-mono">Windows 10 / 11 • 64 bits</span>
            <a href="/#interfaz-en-vivo" className="font-label-sm text-[11px] text-primary hover:underline">
              Ver capturas del sistema
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
