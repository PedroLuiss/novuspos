import { useEffect, useRef } from 'react'
import { postPreviewConfig } from '@/shared/services/landing/landingPreview'
import type { LandingConfig } from '@/shared/services/landing/types'

/** Iframe de la landing real; recibe el borrador por postMessage en cada cambio. */
export function LandingPreview({ config }: { config: LandingConfig }) {
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    postPreviewConfig(config, frame.current?.contentWindow)
  }, [config])

  return (
    <iframe
      ref={frame}
      src="/?preview=1"
      title="Vista previa en vivo de la landing"
      onLoad={() => postPreviewConfig(config, frame.current?.contentWindow)}
      className="h-[760px] w-full rounded-xl border border-outline-variant/60 bg-white shadow-inner"
    />
  )
}
