import React, { useState, useRef, useCallback } from 'react'
import type { CredentialMember } from '@/data/credentials'
import { InstagramIcon, LinkedInIcon, PhoneIcon } from './SocialIcons'
import './CreativeHudCard.css'

interface CreativeHudCardProps {
  member: CredentialMember
  variant?: 'cyan' | 'violet'
  index?: number
}

export function CreativeHudCard({
  member,
  variant = 'cyan',
  index = 1,
}: CreativeHudCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  )

  // 3D Parallax Tilt Effect on Mouse Move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((centerY - y) / centerY) * 4
    const rotateY = ((x - centerX) / centerX) * 4

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`
    )
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)')
  }, [])

  const unitTag = variant === 'cyan' ? `EDITING // 0${index}` : `DESIGN // 0${index}`

  return (
    <div className="creative-hud-perspective">
      <div
        ref={cardRef}
        className={`creative-hud-card creative-hud-card--${variant}`}
        style={{ transform: transformStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Content Interior */}
        <div className="creative-hud-card__content">
          {/* Top Telemetry Chip */}
          <div className="creative-hud-card__badge">
            <span className="creative-hud-card__dot" />
            <span>{unitTag}</span>
          </div>

          {/* Holographic Photo Viewfinder */}
          <div className="creative-hud-card__photo-wrapper">
            <span className="creative-hud-bracket creative-hud-bracket--tl" aria-hidden="true" />
            <span className="creative-hud-bracket creative-hud-bracket--tr" aria-hidden="true" />
            <span className="creative-hud-bracket creative-hud-bracket--bl" aria-hidden="true" />
            <span className="creative-hud-bracket creative-hud-bracket--br" aria-hidden="true" />

            <img
              src={member.image}
              alt={member.name}
              className="creative-hud-card__photo"
              loading="lazy"
            />
          </div>

          {/* Name & Role */}
          <h4 className="creative-hud-card__name">{member.name}</h4>
          <p className="creative-hud-card__role">{member.role}</p>

          {/* Phone Contact Quick-Dial */}
          {member.phone && (
            <a
              href={`tel:${member.phone.replace(/\s+/g, '')}`}
              className="creative-hud-card__phone"
              title="Call coordinator"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>{member.phone}</span>
            </a>
          )}

          {/* Social Links */}
          <div className="creative-hud-card__socials">
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="social-icon-btn"
                aria-label={`${member.name} Instagram`}
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="social-icon-btn"
                aria-label={`${member.name} LinkedIn`}
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
