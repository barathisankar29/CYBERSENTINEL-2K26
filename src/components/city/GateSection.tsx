import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Airship } from './Airship'
import { SymposiumBillboard } from './SymposiumBillboard'
import { RainEffect } from './RainEffect'
import { GATE_BG } from './useWarmBuildingsImages'
import './GateSection.css'

/**
 * The campus gate section, right after the hero and before the buildings
 * page. The CHIEF GUEST airship drifts in the open sky and the symposium
 * billboard stands on the wet plaza in front of the gate. Phones get a
 * portrait gate picture, desktop a wide one; the overlays are repositioned
 * per device with the --mobile / --desktop modifier classes.
 *
 * Same container model as NavigationCityMobile: the background is an
 * in-flow image that sets the section's height by its natural aspect
 * ratio, and every overlay is positioned in % of that same box, so they
 * stay on the same spot of the picture at any width.
 */
export function GateSection() {
  const isMobile = useIsMobile()
  const device = isMobile ? 'mobile' : 'desktop'
  const bg = GATE_BG[device]
  const sceneRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  // Pop the billboard in the first time the plaza scrolls into view.
  useEffect(() => {
    const node = sceneRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`gate-section gate-section--${device}`} id="gate" aria-label="Chief guest and official poster">
      <div ref={sceneRef} className="gate-scene">
        <img
          key={bg.src}
          src={bg.src}
          alt=""
          width={bg.width}
          height={bg.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="gate-scene__bg"
        />
        {/* Dark tint so the busy neon background sits behind the airship and billboard */}
        <div className="gate-scene__film" aria-hidden="true" />
        <div className="gate-scene__top-blend" aria-hidden="true" />
        <div className="gate-scene__bottom-blend" aria-hidden="true" />
        <RainEffect zIndex={1} />
        <Airship className={`airship--gate-${device}`} />
        <SymposiumBillboard revealed={revealed} className={`symposium-billboard--gate-${device}`} />
      </div>
    </section>
  )
}
