/**
 * Hardware & Memory capability detection for CYBERSENTINEL 2K26.
 * Optimizes animations, particle density, canvas DPR, and CSS blur layers
 * for low-RAM devices (2GB, 3GB, 4GB RAM) and mobile phones.
 */

export interface DevicePerfInfo {
  isLowRam: boolean
  /** Specifically 2GB or less — most aggressive cuts */
  isVeryLowRam: boolean
  isMobile: boolean
  dprCap: number
  rainDropCap: number
  rainDensity: number
  particleCount: number
  /** How long the carousel auto-advance should wait (ms) */
  carouselHoldMs: number
}

let cachedPerfInfo: DevicePerfInfo | null = null

export function getDevicePerfInfo(): DevicePerfInfo {
  if (cachedPerfInfo) return cachedPerfInfo

  if (typeof window === 'undefined') {
    return {
      isLowRam: false,
      isVeryLowRam: false,
      isMobile: false,
      dprCap: 1.5,
      rainDropCap: 520,
      rainDensity: 1.9,
      particleCount: 28,
      carouselHoldMs: 4500,
    }
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }

  const ram = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null
  const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null
  const isMobile =
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isSaveData = nav.connection?.saveData === true

  // Very low RAM: 2GB or below (Oppo A3x, Redmi 13C, Galaxy A03 class)
  const isVeryLowRam = (ram !== null && ram <= 2) || (isMobile && cores !== null && cores <= 2)

  // Low RAM: <= 4GB RAM or mobile with <= 4 cores or saveData enabled
  const isLowRam =
    isVeryLowRam ||
    (ram !== null && ram <= 4) ||
    (isMobile && (ram === null || ram <= 4)) ||
    (cores !== null && cores <= 4) ||
    isSaveData

  const info: DevicePerfInfo = {
    isLowRam,
    isVeryLowRam,
    isMobile,
    dprCap: isVeryLowRam ? 1.0 : isLowRam ? 1.0 : isMobile ? 1.2 : 1.5,
    rainDropCap: isVeryLowRam ? 30 : isLowRam ? 60 : isMobile ? 80 : 520,
    rainDensity: isVeryLowRam ? 0.25 : isLowRam ? 0.5 : isMobile ? 0.75 : 1.9,
    particleCount: isVeryLowRam ? 0 : isLowRam ? 8 : isMobile ? 14 : 28,
    carouselHoldMs: isVeryLowRam ? 6000 : isLowRam ? 5000 : 4500,
  }

  cachedPerfInfo = info
  return info
}

/**
 * Initializes device performance classes on <html> root element.
 * Adds 'is-mobile' and 'is-low-ram' classes for CSS optimizations.
 */
export function initDevicePerf(): void {
  if (typeof document === 'undefined') return

  const { isMobile, isLowRam, isVeryLowRam } = getDevicePerfInfo()
  const root = document.documentElement

  if (isMobile) {
    root.classList.add('is-mobile')
  }
  if (isLowRam) {
    root.classList.add('is-low-ram')
  }
  if (isVeryLowRam) {
    root.classList.add('is-very-low-ram')
  }
}
