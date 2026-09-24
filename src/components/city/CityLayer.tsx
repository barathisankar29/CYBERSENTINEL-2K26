import type { CSSProperties } from 'react'
import { lerpExpr, windowT } from '@/animation/progressCss'
import type { CityLayerConfig, LayerMotion, ProgressWindow } from './cityLayers.config'

/** Remaps the scene's scroll progress into a layer's own 0-1 window, clamped at both ends. */
function localProgress(window: ProgressWindow): string {
  return windowT(window.start, window.end)
}

interface CityLayerProps {
  layer: CityLayerConfig
  isMobile: boolean
  /** Below-the-fold usage (navigation city) — defer the download until near the viewport. */
  lazy?: boolean
}

/**
 * A single parallax image layer within CityScene. Purely a function of
 * scroll progress — no timers, no CSS transitions, no state of its own.
 * Scrolling stops -> this stops; scrolling resumes -> this resumes.
 *
 * The motion is expressed as CSS calc() of the parent scene's
 * `--scene-progress` (see progressCss.ts), so this component renders once
 * and the browser — not React — applies each scroll frame.
 */
export function CityLayer({ layer, isMobile, lazy = false }: CityLayerProps) {
  const motion: LayerMotion = isMobile ? layer.mobile : layer.desktop
  const motionT = localProgress(layer.motionRange)
  const opacityT = localProgress(layer.opacityRange ?? layer.motionRange)

  const translateY = lerpExpr(motion.translateY.from, motion.translateY.to, motionT)
  const translateX = motion.translateX ? lerpExpr(motion.translateX.from, motion.translateX.to, motionT) : '0'
  const scale = motion.scale ? lerpExpr(motion.scale.from, motion.scale.to, motionT) : '1'
  const opacity = motion.opacity ? lerpExpr(motion.opacity.from, motion.opacity.to, opacityT) : opacityT

  const style: CSSProperties = {
    zIndex: layer.zIndex,
    opacity: `calc(${opacity})`,
    objectPosition: layer.objectPosition,
    transform: `translate3d(calc(${translateX} * 1vw), calc(${translateY} * 1vh), 0) scale(calc(${scale}))`,
    ...(layer.anchor === 'bottom'
      ? { bottom: 0, left: 0, width: '100%', height: '58%' }
      : { top: 0, left: 0, width: '100%', height: '100%' }),
  }

  return (
    <img
      src={layer.src}
      alt=""
      draggable={false}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      className="city-layer"
      style={style}
    />
  )
}
