import { useEffect, useState } from 'react'
import type { LandingScreenshot } from '@/shared/services/landing/types'

const CARD_BASE =
  'absolute inset-0 transition-all duration-1000 ease-in-out rounded-xl overflow-hidden border border-slate-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]'
const CARD_ACTIVE =
  'z-20 opacity-100 pointer-events-auto [transform:rotateX(15deg)_rotateY(-15deg)_rotateZ(5deg)_translateZ(0px)_translateY(0px)_translateX(0px)]'
const CARD_INACTIVE =
  'z-10 opacity-30 pointer-events-none [transform:rotateX(15deg)_rotateY(-15deg)_rotateZ(5deg)_translateZ(-180px)_translateY(-90px)_translateX(110px)]'

/** Carrusel 3D apilado; rota sobre las capturas que configura el dueño. */
export function ScreenshotCarousel({ slides }: { slides: LandingScreenshot[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null
  const current = active % slides.length

  return (
    <div
      id="interfaz-en-vivo"
      role="group"
      aria-label="Capturas del sistema NovusPOS"
      className="relative mx-auto mt-space-lg flex w-full max-w-5xl aspect-[5/4] items-center justify-center lg:mt-0 [transform-style:preserve-3d] [perspective:1200px]"
    >
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`${CARD_BASE} ${index === current ? CARD_ACTIVE : CARD_INACTIVE}`}
          aria-hidden={index !== current}
        >
          <img
            src={slide.src}
            alt={index === current ? slide.alt : ''}
            className={`h-full w-full bg-white ${slide.fit === 'cover' ? 'object-cover object-top' : 'object-contain'}`}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  )
}
