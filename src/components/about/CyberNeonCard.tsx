import React from 'react'
import './CyberNeonCard.css'

export interface CyberNeonCardProps {
  badgeTitle?: string
  badgeTag?: string
  accentColor?: 'purple' | 'cyan' | 'pink'
  className?: string
  children: React.ReactNode
  id?: string
  showWings?: boolean
  showChassis?: boolean
}

export function CyberNeonCard({
  badgeTitle = 'BORCELLE',
  badgeTag,
  accentColor = 'purple',
  className = '',
  children,
  id,
  showWings = true,
  showChassis = true,
}: CyberNeonCardProps) {
  const colorClass = `cyber-neon-card--${accentColor}`

  return (
    <div
      id={id}
      className={`cyber-neon-card-wrapper ${colorClass} ${className}`}
      data-card-theme="neon-armor"
    >
      {/* SVG Filters for Neon Glow Rendering */}
      <svg className="cyber-neon-card__svg-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="neon-purple-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* LEFT SCI-FI ARMOR WING / FIN */}
      {showWings && (
        <div className="cyber-neon-card__flank cyber-neon-card__flank--left" aria-hidden="true">
          <svg
            viewBox="0 0 54 240"
            className="cyber-neon-card__wing-svg"
            preserveAspectRatio="none"
          >
            {/* Outer Armor Wing with Upper Spike (↖) and Lower Spike (↙) */}
            <path
              d="M 52,5 L 4,28 L 32,85 L 8,145 L 38,198 L 52,230 Z"
              className="cyber-neon-card__wing-polygon"
            />
            {/* Tech Detailing Line */}
            <path
              d="M 46,50 L 22,82 L 28,118 L 16,145"
              className="cyber-neon-card__wing-detail"
            />
          </svg>
        </div>
      )}

      {/* RIGHT SCI-FI ARMOR WING / FIN */}
      {showWings && (
        <div className="cyber-neon-card__flank cyber-neon-card__flank--right" aria-hidden="true">
          <svg
            viewBox="0 0 54 240"
            className="cyber-neon-card__wing-svg"
            preserveAspectRatio="none"
          >
            {/* Outer Armor Wing with Upper Spike (↗) and Lower Spike (↘) */}
            <path
              d="M 2,5 L 50,28 L 22,85 L 46,145 L 16,198 L 2,230 Z"
              className="cyber-neon-card__wing-polygon"
            />
            {/* Tech Detailing Line */}
            <path
              d="M 8,50 L 32,82 L 26,118 L 38,145"
              className="cyber-neon-card__wing-detail"
            />
          </svg>
        </div>
      )}

      {/* RAISED CENTER TOP PILL / TAB BADGE */}
      <div className="cyber-neon-card__badge-anchor">
        <div className="cyber-neon-card__badge-pill">
          <span className="cyber-neon-card__badge-dot" />
          <span className="cyber-neon-card__badge-title">{badgeTitle}</span>
          {badgeTag && <span className="cyber-neon-card__badge-tag">{badgeTag}</span>}
        </div>
      </div>

      {/* MAIN INNER CARD BODY */}
      <div className="cyber-neon-card__body">
        {/* Subtle Cyber Grid Texture & Scanlines */}
        <div className="cyber-neon-card__grid-overlay" aria-hidden="true" />

        {/* Card Content Slot */}
        <div className="cyber-neon-card__content-slot">
          {children}
        </div>
      </div>

      {/* BOTTOM JAGGED GEOMETRIC CRYSTALLINE CHASSIS */}
      {showChassis && (
        <div className="cyber-neon-card__bottom-chassis" aria-hidden="true">
          <svg
            viewBox="0 0 1000 65"
            className="cyber-neon-card__chassis-svg"
            preserveAspectRatio="none"
          >
            {/* Faceted Jagged Silhouette matching the exact downward chevron peaks */}
            <polygon
              points="60,0 185,55 315,18 475,58 540,22 705,56 815,18 940,0"
              className="cyber-neon-card__chassis-polygon"
            />
            {/* Glowing Neon Outline */}
            <polyline
              points="60,0 185,55 315,18 475,58 540,22 705,56 815,18 940,0"
              className="cyber-neon-card__chassis-stroke"
            />
            {/* Center Chassis Tech Accent */}
            <circle cx="500" cy="38" r="3.5" className="cyber-neon-card__chassis-dot" />
            <line x1="480" y1="38" x2="492" y2="38" className="cyber-neon-card__chassis-dash" />
            <line x1="508" y1="38" x2="520" y2="38" className="cyber-neon-card__chassis-dash" />
          </svg>
        </div>
      )}
    </div>
  )
}
