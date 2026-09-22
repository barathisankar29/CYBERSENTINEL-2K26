import React, { useState, useRef, useCallback } from 'react'
import type { CredentialMember } from '@/data/credentials'
import './CoConvenorMechaCard.css'

interface CoConvenorMechaCardProps {
  member: CredentialMember
  index?: number
}

export function CoConvenorMechaCard({
  member,
  index = 1,
}: CoConvenorMechaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)')

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((centerY - y) / centerY) * 6
    const rotateY = ((x - centerX) / centerX) * 6

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)')
  }, [])

  return (
    <div className="coconvenor-mecha-perspective">
      <div
        ref={cardRef}
        className="coconvenor-mecha-card"
        style={{ transform: transformStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Futuristic Laser Scanline Sweep */}
        <div className="coconvenor-mecha-card__scanner" aria-hidden="true">
          <div className="coconvenor-mecha-card__scanner-line" />
        </div>

        {/* Scalable SVG Cyber Mecha Armor Frame Matching Reference Image */}
        <svg
          className="coconvenor-mecha-card__svg-frame"
          viewBox="0 0 320 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Main Outer Mecha Border with Chamfers */}
          <path
            d="M 16 12 L 180 12 L 200 20 L 304 20 L 304 100 L 312 112 L 312 340 L 304 352 L 304 424 L 170 424 L 150 432 L 24 432 L 8 416 L 8 130 L 16 118 Z"
            className="mecha-outer-border"
          />

          {/* Top-Left Tech Armor Plate with Speed Grooves */}
          <path
            d="M 18 14 L 125 14 L 138 28 L 18 28 Z"
            className="mecha-plate-tl"
          />
          <line x1="28" y1="18" x2="115" y2="18" className="mecha-groove" />
          <line x1="28" y1="23" x2="105" y2="23" className="mecha-groove" />

          {/* Upper-Right Corner Vents (Diagonal ///) */}
          <line x1="275" y1="32" x2="288" y2="45" className="mecha-vent-stripe" />
          <line x1="282" y1="39" x2="295" y2="52" className="mecha-vent-stripe" />
          <line x1="289" y1="46" x2="302" y2="59" className="mecha-vent-stripe" />

          {/* Left Mid Bracket (Vertical /// vents) */}
          <path
            d="M 8 180 L 14 190 L 14 245 L 8 255"
            className="mecha-bracket-left"
          />
          <line x1="11" y1="200" x2="11" y2="210" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="11" y1="216" x2="11" y2="226" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="11" y1="232" x2="11" y2="242" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />

          {/* Bottom-Left Hazard Cooling Vents (Diagonal ///////) */}
          <line x1="90" y1="422" x2="102" y2="410" className="mecha-hazard-vent" />
          <line x1="102" y1="422" x2="114" y2="410" className="mecha-hazard-vent" />
          <line x1="114" y1="422" x2="126" y2="410" className="mecha-hazard-vent" />
          <line x1="126" y1="422" x2="138" y2="410" className="mecha-hazard-vent" />
          <line x1="138" y1="422" x2="150" y2="410" className="mecha-hazard-vent" />

          {/* Bottom-Right Tech Armor Plate with Grooves */}
          <path
            d="M 175 422 L 195 408 L 302 408 L 302 422 Z"
            className="mecha-plate-br"
          />
          <line x1="208" y1="414" x2="295" y2="414" className="mecha-groove" />
          <line x1="218" y1="418" x2="295" y2="418" className="mecha-groove" />

          {/* Inner Cyan Hairline HUD Border */}
          <rect
            x="24"
            y="36"
            width="272"
            height="365"
            rx="6"
            className="mecha-inner-line"
          />
        </svg>

        {/* Card Internal Content */}
        <div className="coconvenor-mecha-card__content">
          {/* Top Telemetry Tag */}
          <div className="coconvenor-mecha-tag">
            <span className="coconvenor-mecha-dot" />
            <span>CO-CONVENOR // 0{index}</span>
          </div>

          {/* Glowing Circular Avatar with Cyber Ring */}
          <div className="coconvenor-mecha-avatar">
            <div className="coconvenor-mecha-avatar__inner">
              <img
                src={member.image}
                alt={member.name}
                className="coconvenor-mecha-avatar__img"
                style={{
                  ...(member.imagePosition ? { objectPosition: member.imagePosition } : {}),
                  ...(member.imageStyle || {}),
                }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Name & Roles */}
          <h4 className="coconvenor-mecha-name">{member.name}</h4>
          <p className="coconvenor-mecha-role">{member.role}</p>
          {member.subRole && (
            <p className="coconvenor-mecha-subrole">{member.subRole}</p>
          )}
        </div>
      </div>
    </div>
  )
}
