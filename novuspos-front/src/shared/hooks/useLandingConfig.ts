import { useEffect, useState } from 'react'
import { landingService } from '../services/landing/landingService'
import {
  isLandingPreview,
  readPreviewConfig,
  subscribeToLandingPreview,
} from '../services/landing/landingPreview'
import type { LandingConfig } from '../services/landing/types'

/** Configuración de la landing: en `/?preview=1` sigue al editor; en público, a la API/demo. */
export function useLandingConfig() {
  const preview = isLandingPreview()
  const [config, setConfig] = useState<LandingConfig>(
    () => (preview ? readPreviewConfig() : null) ?? landingService.readCached(),
  )
  const [isLoading, setIsLoading] = useState(!preview)

  useEffect(() => {
    if (preview) return subscribeToLandingPreview(setConfig)

    let active = true
    landingService
      .list()
      .then((next) => { if (active) setConfig(next) })
      .catch(() => { if (active) setConfig(landingService.readCached()) })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [preview])

  return { config, isLoading }
}
