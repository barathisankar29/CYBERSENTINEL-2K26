import React from 'react'
import './PatronNeonCard.css'

export interface PatronNeonCardProps {
  title: string
  className?: string
  children: React.ReactNode
}

export function PatronNeonCard({
  title,
  className = '',
  children,
}: PatronNeonCardProps) {
  return (
    <div className={`patron-hud-card-wrapper ${className}`} data-hud-theme="streamer-frame">
      {/* Outer Glow & Stepped Frame Container */}
      <div className="patron-hud-card">
        {/* TOP SHOULDER CYAN HAZARD DASHES (Left & Right) */}
        <div className="patron-hud-card__shoulder patron-hud-card__shoulder--left" aria-hidden="true">
          <span className="patron-hud-card__slash" />
          <span className="patron-hud-card__slash" />
          <span className="patron-hud-card__slash" />
          <span className="patron-hud-card__slash" />
        </div>

        <div className="patron-hud-card__shoulder patron-hud-card__shoulder--right" aria-hidden="true">
          <span className="patron-hud-card__slash" />
          <span className="patron-hud-card__slash" />
          <span className="patron-hud-card__slash" />
          <span className="patron-hud-card__slash" />
        </div>

        {/* TOP ELEVATED TRAPEZOIDAL HEADER */}
        <div className="patron-hud-card__header-trapezoid">
          <svg
            className="patron-hud-card__header-svg"
            viewBox="0 0 380 44"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Trapezoid Outline */}
            <path
              d="M 6,40 L 18,6 L 362,6 L 374,40"
              className="patron-hud-card__header-path"
            />
          </svg>

          {/* Centered Title */}
          <div className="patron-hud-card__header-content">
            <span className="patron-hud-card__header-text">{title}</span>
          </div>

          {/* Horizontal Lens Flare Line */}
          <div className="patron-hud-card__lens-flare" aria-hidden="true" />
        </div>

        {/* LEFT & RIGHT STEPPED-OUT SIDE BRACKETS */}
        <div className="patron-hud-card__side-bracket patron-hud-card__side-bracket--left" aria-hidden="true">
          <svg viewBox="0 0 20 180" preserveAspectRatio="none" className="patron-hud-card__bracket-svg">
            <path
              d="M 18,10 L 4,32 L 4,148 L 18,170"
              className="patron-hud-card__bracket-path"
            />
          </svg>
        </div>

        <div className="patron-hud-card__side-bracket patron-hud-card__side-bracket--right" aria-hidden="true">
          <svg viewBox="0 0 20 180" preserveAspectRatio="none" className="patron-hud-card__bracket-svg">
            <path
              d="M 2,10 L 16,32 L 16,148 L 2,170"
              className="patron-hud-card__bracket-path"
            />
          </svg>
        </div>

        {/* MAIN INNER CONTAINER */}
        <div className="patron-hud-card__inner">
          {/* FOUR GLOWING NEON CYAN RETICLE CORNER BRACKETS */}
          <div className="patron-hud-card__reticle patron-hud-card__reticle--tl" aria-hidden="true" />
          <div className="patron-hud-card__reticle patron-hud-card__reticle--tr" aria-hidden="true" />
          <div className="patron-hud-card__reticle patron-hud-card__reticle--bl" aria-hidden="true" />
          <div className="patron-hud-card__reticle patron-hud-card__reticle--br" aria-hidden="true" />

          {/* Bottom Horizon Ambient Flare */}
          <div className="patron-hud-card__bottom-flare" aria-hidden="true" />

          {/* Content Slot */}
          <div className="patron-hud-card__body">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
