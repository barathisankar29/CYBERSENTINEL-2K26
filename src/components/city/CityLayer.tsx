import type { CSSProperties } from 'react'
import type { CityLayerConfig, LayerMotion, ProgressWindow } from './cityLayers.config'

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

/** Remaps global scroll progress into a layer's own 0-1 window, clamped at both ends. */
function localProgress(progress: number, window: ProgressWindow): number {
  const span = window.end - window.start
  if (span <= 0) return progress >= window.end ? 1 : 0
  return Math.min(Math.max((progress - window.start) / span, 0), 1)
}

interface CityLayerProps {
  layer: CityLayerConfig
  /** Master scroll progress 0-1 (already resolved to 1 under reduced motion by the caller). */
  progress: number
  isMobile: boolean
}

/**
 * A single parallax image layer within CityScene. Purely a function of
 * scroll progress — no timers, no CSS transitions, no state of its own.
 * Scrolling stops -> this stops; scrolling resumes -> this resumes.
 */
export function CityLayer({ layer, progress, isMobile }: CityLayerProps) {
  const motion: LayerMotion = isMobile ? layer.mobile : layer.desktop
  const motionT = localProgress(progress, layer.motionRange)
  const opacityT = localProgress(progress, layer.opacityRange ?? layer.motionRange)

  const translateY = lerp(motion.translateY.from, motion.translateY.to, motionT)
  const translateX = motion.translateX ? lerp(motion.translateX.from, motion.translateX.to, motionT) : 0
  const scale = motion.scale ? lerp(motion.scale.from, motion.scale.to, motionT) : 1
  const opacity = motion.opacity ? lerp(motion.opacity.from, motion.opacity.to, opacityT) : opacityT

  const style: CSSProperties = {
    zIndex: layer.zIndex,
    opacity,
    objectPosition: layer.objectPosition,
    transform: `translate3d(${translateX}vw, ${translateY}vh, 0) scale(${scale})`,
    ...(layer.anchor === 'bottom' ? { bottom: 0, left: 0, width: '100%', height: '58%' } : { inset: 0 }),
  }

  return <img src={layer.src} alt="" draggable={false} className="city-layer" style={style} />
}
