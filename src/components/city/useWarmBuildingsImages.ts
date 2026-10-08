import { useEffect } from 'react'
import { navigationBuildings } from '@/data/navigation'
import { navigationCityEnvironmentLayers } from './navigationCityEnvironment.config'

export const MOBILE_NAVIGATION_BG = '/assets/city/navigation/navigation-mobile-v2.webp'
const MOBILE_GATE_BG = '/assets/city/navigation/gate-mobile.webp'

/**
 * The buildings section's images are lazy so they never compete with the
 * hero — but lazy alone means they only START downloading when the visitor
 * scrolls there, which showed as a black screen until they arrived. This
 * warms exactly the images this device will show (phone: one composed
 * background; desktop: the background layer + the six buildings) once the
 * page has loaded and the browser is idle, so they are cached and decoded
 * by the time the buildings scroll into view.
 */
export function useWarmBuildingsImages(isMobile: boolean) {
  useEffect(() => {
    const urls: string[] = isMobile
      ? [MOBILE_NAVIGATION_BG, MOBILE_GATE_BG]
      : [
          ...navigationCityEnvironmentLayers.map((layer) => layer.src),
          ...navigationBuildings.map((b) => b.assetPath),
        ].filter((url): url is string => Boolean(url))

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const fetchImage = (url: string) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = url
      return img.decode().catch(() => {})
    }
    // Background first (it fills the whole screen), then the rest, so on a
    // slow connection the backdrop is complete as early as possible.
    const warm = () => {
      const [first, ...rest] = urls
      if (!first) return
      void fetchImage(first).then(() => rest.forEach((url) => void fetchImage(url)))
    }
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(warm, { timeout: 2500 })
      else timeoutId = setTimeout(warm, 800)
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [isMobile])
}
