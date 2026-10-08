import { useEffect, useRef, useState } from 'react'
import { Airship } from './Airship'
import { SymposiumBillboard } from './SymposiumBillboard'
import { RainEffect } from './RainEffect'
import './MobileGateSection.css'

const MOBILE_GATE_BG = '/assets/city/navigation/gate-mobile.webp'

/**
 * MOBILE-ONLY section placed right below the mobile buildings page
 * (NavigationCityMobile). Phones have no room for the airship and the
 * symposium billboard in the buildings image, so they get their own scene:
 * the neon campus gate, with the CHIEF GUEST airship drifting in the open
 * sky between the towers and the billboard standing on the wet plaza in
 * front of the gate.
 *
 * Same container model as NavigationCityMobile: the background is an
 * in-flow image that sets the section's height by its natural aspect
 * ratio, and every overlay is positioned in % of that same box, so they
 * stay on the same spot of the picture at any phone width.
 */
export function MobileGateSection() {
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
    <section className="mobile-gate-section" id="gate" aria-label="Chief guest and official poster">
      <div ref={sceneRef} className="mobile-gate-scene">
        <img
          src={MOBILE_GATE_BG}
          alt=""
          width={850}
          height={1851}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="mobile-gate-scene__bg"
        />
        {/* Dark tint so the busy neon background sits behind the airship and billboard */}
        <div className="mobile-gate-scene__film" aria-hidden="true" />
        <div className="mobile-gate-scene__top-blend" aria-hidden="true" />
        <RainEffect zIndex={1} />
        <Airship className="airship--mobile-gate" />
        <SymposiumBillboard revealed={revealed} className="symposium-billboard--mobile-gate" />
      </div>
    </section>
  )
}
