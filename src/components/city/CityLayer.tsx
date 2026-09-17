import type { CSSProperties } from 'react'
import { easing } from '@/animation/timingConfig'
import type { CityLayerConfig, LayerMotion } from './cityLayers.config'

const ESTABLISH_EASING = `cubic-bezier(${easing.standard.join(', ')})`

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

function motionTransform(motion: LayerMotion, t: number): { transform: string; opacity: number } {
  const translateY = lerp(motion.translateY.from, motion.translateY.to, t)
  const translateX = motion.translateX ? lerp(motion.translateX.from, motion.translateX.to, t) : 0
  const scale = motion.scale ? lerp(motion.scale.from, motion.scale.to, t) : 1
  const opacity = motion.opacity ? lerp(motion.opacity.from, motion.opacity.to, t) : lerp(0, 1, t)
  return { transform: `translate3d(${translateX}vw, ${translateY}vh, 0) scale(${scale})`, opacity }
}

interface CityLayerProps {
  layer: CityLayerConfig
  /** Whether this layer's one-time boot establish transition has been triggered. */
  established: boolean
  /** Post-settle scroll progress 0-1. Ignored (treated as 0) under reduced motion. */
  scrollProgress: number
  isMobile: boolean
  reducedMotion: boolean
}

/**
 * A single parallax image layer within CityScene, split into two nodes so
 * two independent motion sources never fight over the same `transform`:
 *
 * - the outer wrapper plays the one-time boot "establish" motion via a CSS
 *   transition (smooth regardless of how the `established` flag itself
 *   flips — instant boolean in, eased motion out);
 * - the inner image plays the continuous, scroll-linked motion with no
 *   transition, so it tracks the scrollbar 1:1 with no lag.
 */
export function CityLayer({ layer, established, scrollProgress, isMobile, reducedMotion }: CityLayerProps) {
  const motion = isMobile ? layer.mobile : layer.desktop
  const scrollMotion = isMobile ? layer.scrollParallax?.mobile : layer.scrollParallax?.desktop

  const establishT = established ? 1 : 0
  const { transform: establishTransform, opacity } = motionTransform(motion, establishT)

  const scrollT = reducedMotion ? 0 : scrollProgress
  const { transform: scrollTransform } = scrollMotion
    ? motionTransform(scrollMotion, scrollT)
    : { transform: 'translate3d(0, 0, 0)' }

  const wrapperStyle: CSSProperties = {
    zIndex: layer.zIndex,
    opacity,
    transform: establishTransform,
    transitionProperty: reducedMotion ? 'none' : 'transform, opacity',
    transitionDuration: reducedMotion ? '0s' : `${layer.establishDurationMs}ms`,
    transitionDelay: reducedMotion ? '0s' : `${layer.establishDelayMs}ms`,
    transitionTimingFunction: ESTABLISH_EASING,
    ...(layer.anchor === 'bottom'
      ? { bottom: 0, left: 0, width: '100%', height: '58%' }
      : { top: 0, left: 0, width: '100%', height: '100%' }),
  }

  const imgStyle: CSSProperties = {
    transform: scrollTransform,
    objectPosition: layer.objectPosition,
  }

  return (
    <div className="city-layer-establish" style={wrapperStyle}>
      <img src={layer.src} alt="" draggable={false} className="city-layer-scroll" style={imgStyle} />
    </div>
  )
}
