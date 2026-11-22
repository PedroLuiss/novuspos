import { useEffect, useState } from 'react'
import { screenshots } from '@/features/landing/data/landing-data'

/** Tarjeta base: apilada, con transición suave de 1s (idéntica a NexusPOS). */
const CARD_BASE =
  'absolute inset-0 transition-all duration-1000 ease-in-out rounded-xl overflow-hidden border border-slate-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]'

/** Captura en frente: se ve completa, recibe eventos y está arriba en el stack. */
const CARD_ACTIVE =
  'z-20 opacity-100 pointer-events-auto [transform:rotateX(15deg)_rotateY(-15deg)_rotateZ(5deg)_translateZ(0px)_translateY(0px)_translateX(0px)]'

/** Captura en espera: se oculta suavemente y se desplaza hacia atrás/arriba/derecha. */
const CARD_INACTIVE =
  'z-10 opacity-30 pointer-events-none [transform:rotateX(15deg)_rotateY(-15deg)_rotateZ(5deg)_translateZ(-180px)_translateY(-90px)_translateX(110px)]'

/**
 * Carrusel de capturas del sistema.
 *
 * Las imágenes están apiladas una debajo de otra. Cada 4s la que está arriba
 * baja su opacidad a 30% y se desplaza en 3D mientras la siguiente pasa al
 * frente con una transición de 1s, replicando el efecto de nexusposgobal.com.
 */
export function ScreenshotCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % screenshots.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [])

  if (screenshots.length === 0) return null

  return (
    <div
      id="interfaz-en-vivo"
      role="group"
      aria-label="Capturas del sistema NovusPOS"
      className="relative mx-auto mt-space-lg flex w-full max-w-5xl aspect-[5/4] items-center justify-center lg:mt-0 [transform-style:preserve-3d] [perspective:1200px]"
    >
      {screenshots.map((slide, index) => (
        <div
          key={slide.src}
          className={`${CARD_BASE} ${index === active ? CARD_ACTIVE : CARD_INACTIVE}`}
          aria-hidden={index !== active}
        >
          <img
            src={slide.src}
            alt={index === active ? slide.alt : ''}
            className="h-full w-full bg-white object-contain"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  )
}
