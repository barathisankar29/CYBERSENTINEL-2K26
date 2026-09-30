import type { MascotPosition } from '@/types/mascot'

export interface PhysicsConfig {
  gravity: number // px/s^2
  bounceDamping: number // energy retained on bounce (0 to 1)
  friction: number // horizontal air drag per frame
  minBounceVelocity: number // minimum velocity to trigger bounce
  maxVelocityX: number // max throw speed X
  maxVelocityY: number // max throw speed Y
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: 1600,
  bounceDamping: 0.42,
  friction: 0.94,
  minBounceVelocity: 140,
  maxVelocityX: 800,
  maxVelocityY: 1200,
}

export function getMascotDimensions(isMobile: boolean) {
  if (isMobile) {
    return { width: 80, height: 80 }
  }
  return { width: 110, height: 110 }
}

export function getSafeScreenBounds(isMobile: boolean) {
  if (typeof window === 'undefined') {
    return { minX: 10, maxX: 1000, minY: 50, maxY: 700 }
  }

  const { width, height } = getMascotDimensions(isMobile)
  const paddingX = isMobile ? 12 : 24
  const paddingTop = 60
  const paddingBottom = isMobile ? 16 : 24

  const minX = paddingX
  const maxX = Math.max(minX, window.innerWidth - width - paddingX)
  const minY = paddingTop
  const maxY = Math.max(minY, window.innerHeight - height - paddingBottom)

  return { minX, maxX, minY, maxY }
}

export function clampPositionToBounds(
  pos: MascotPosition,
  isMobile: boolean
): MascotPosition {
  const bounds = getSafeScreenBounds(isMobile)
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y)),
  }
}

export function getDefaultMascotPosition(isMobile: boolean): MascotPosition {
  if (typeof window === 'undefined') return { x: 24, y: 600 }
  const bounds = getSafeScreenBounds(isMobile)
  // Default position: lower-left area of the viewport with safe margins
  return {
    x: bounds.minX,
    y: bounds.maxY,
  }
}
