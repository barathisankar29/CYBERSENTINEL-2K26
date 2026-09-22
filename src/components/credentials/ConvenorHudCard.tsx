import React, { useState, useRef, useCallback } from 'react'
import type { CredentialMember } from '@/data/credentials'
import './ConvenorHudCard.css'

interface ConvenorHudCardProps {
  member: CredentialMember
  nodeCode?: string
}

export function ConvenorHudCard({
  member,
  nodeCode = 'COMMAND_NODE // CSE',
}: ConvenorHudCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)')

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max 8 degrees tilt for sleek subtle cyber feel
    const rotateX = ((centerY - y) / centerY) * 7
    const rotateY = ((x - centerX) / centerX) * 7

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)')
  }, [])

  return (
    <div className="convenor-hud-perspective">
      <div
        ref={cardRef}
        className="convenor-hud-card"
        style={{ transform: transformStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Holographic Laser Scanline Sweep */}
        <div className="convenor-hud-card__scanner" aria-hidden="true">
          <div className="convenor-hud-card__scanner-line" />
        </div>

        {/* Bottom Uplight Plasma Flare Effect */}
        <div className="hud-bottom-flare" aria-hidden="true" />
        <div className="hud-bottom-laser" aria-hidden="true" />

        {/* Exact Futuristic HUD Vector Frame Matching Reference Image */}
        <svg
          className="convenor-hud-card__svg-frame"
          viewBox="0 0 440 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Main Outer Glowing Purple Rectangular Frame */}
          <rect
            x="28"
            y="20"
            width="384"
            height="480"
            rx="12"
            className="hud-border-rect"
            fill="none"
          />

          {/* Left Wing / Side Handle with 45° Chamfers */}
          <path
            d="M 28 185 L 8 205 L 8 315 L 28 335"
            className="hud-wing"
          />

          {/* Right Wing / Side Handle with 45° Chamfers */}
          <path
            d="M 412 185 L 432 205 L 432 315 L 412 335"
            className="hud-wing"
          />

          {/* Four Inner Cyan Reticles (┌ ┐ └ ┘) */}
          {/* Top-Left */}
          <path d="M 48 42 L 82 42 M 48 42 L 48 76" className="hud-reticle" />

          {/* Top-Right */}
          <path d="M 392 42 L 358 42 M 392 42 L 392 76" className="hud-reticle" />

          {/* Bottom-Left */}
          <path d="M 48 478 L 82 478 M 48 478 L 48 444" className="hud-reticle" />

          {/* Bottom-Right */}
          <path d="M 392 478 L 358 478 M 392 478 L 392 444" className="hud-reticle" />
        </svg>

        {/* Card Internal Content */}
        <div className="convenor-hud-card__content">
          {/* Top Telemetry Bar */}
          <div className="convenor-hud-telemetry">
            <div className="convenor-hud-telemetry__status">
              <span className="convenor-hud-telemetry__dot" />
              <span>{nodeCode}</span>
            </div>
          </div>

          {/* Photo Viewfinder Showcase with Cyber Brackets */}
          <div className="convenor-hud-viewfinder">
            <span className="viewfinder-bracket viewfinder-bracket--tl" aria-hidden="true" />
            <span className="viewfinder-bracket viewfinder-bracket--tr" aria-hidden="true" />
            <span className="viewfinder-bracket viewfinder-bracket--bl" aria-hidden="true" />
            <span className="viewfinder-bracket viewfinder-bracket--br" aria-hidden="true" />

            <img
              src={member.image}
              alt={member.name}
              className="convenor-hud-photo"
              style={{
                ...(member.imagePosition ? { objectPosition: member.imagePosition } : {}),
                ...(member.imageStyle || {}),
              }}
              loading="lazy"
            />
          </div>

          {/* Person Details */}
          <div className="convenor-hud-details">
            <h4 className="convenor-hud-name">{member.name}</h4>

            <div className="convenor-hud-role-badge">
              <span className="convenor-hud-role-dot" />
              <span>{member.role}</span>
            </div>

            {member.subRole && (
              <p className="convenor-hud-subrole">{member.subRole}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
