import type { CSSProperties } from 'react'
import type { CityLayerConfig, LayerMotion } from './cityLayers.config'

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

interface CityLayerProps {
  layer: CityLayerConfig
  /** Scroll progress 0-1, already resolved for reduced-motion by the caller. */
  progress: number
  isMobile: boolean
}

/** A single parallax image layer within CityScene, positioned/animated purely via transform. */
export function CityLayer({ layer, progress, isMobile }: CityLayerProps) {
  const motion: LayerMotion = isMobile ? layer.mobile : layer.desktop

  const translateY = lerp(motion.translateY.from, motion.translateY.to, progress)
  const translateX = motion.translateX ? lerp(motion.translateX.from, motion.translateX.to, progress) : 0
  const scale = motion.scale ? lerp(motion.scale.from, motion.scale.to, progress) : 1

  const style: CSSProperties = {
    zIndex: layer.zIndex,
    objectPosition: layer.objectPosition,
    transform: `translate3d(${translateX}vw, ${translateY}vh, 0) scale(${scale})`,
    ...(layer.anchor === 'bottom' ? { bottom: 0, height: '58%' } : { top: 0, height: '100%' }),
  }

  return <img src={layer.src} alt="" draggable={false} className="city-layer" style={style} />
}
