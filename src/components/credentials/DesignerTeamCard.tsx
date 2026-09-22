import React, { useState, useRef, useCallback } from 'react'
import type { CredentialMember } from '@/data/credentials'
import { InstagramIcon, LinkedInIcon, PhoneIcon } from './SocialIcons'
import './DesignerTeamCard.css'

interface DesignerTeamCardProps {
  member: CredentialMember
  index?: number
}

export function DesignerTeamCard({
  member,
  index = 1,
}: DesignerTeamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  )

  // 3D Parallax tilt on hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((centerY - y) / centerY) * 4.5
    const rotateY = ((x - centerX) / centerX) * 4.5

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`
    )
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)')
  }, [])

  const canvasCode = `CANVAS // 0${index}`

  return (
    <div className="designer-card-perspective">
      <div
        ref={cardRef}
        className="designer-card"
        style={{ transform: transformStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Creative Studio Header */}
        <div className="designer-card__header">
          <div className="designer-card__badge">
            <span className="designer-card__vector-glyph" aria-hidden="true">◆</span>
            <span className="designer-card__code">{canvasCode}</span>
          </div>

          {/* Color Palette Swatches */}
          <div className="designer-card__palette" title="Color Swatches" aria-hidden="true">
            <span className="palette-swatch palette-swatch--pink" />
            <span className="palette-swatch palette-swatch--violet" />
            <span className="palette-swatch palette-swatch--cyan" />
          </div>
        </div>

        {/* Squircle Photo Frame with Gradient Ring & Vector Anchors */}
        <div className="designer-card__viewport">
          {/* Vector Handle Anchors (Figma Pen tool style) */}
          <span className="vector-anchor vector-anchor--tl" aria-hidden="true" />
          <span className="vector-anchor vector-anchor--tr" aria-hidden="true" />
          <span className="vector-anchor vector-anchor--bl" aria-hidden="true" />
          <span className="vector-anchor vector-anchor--br" aria-hidden="true" />

          <img
            src={member.image}
            alt={member.name}
            className="designer-card__img"
            loading="lazy"
          />
        </div>

        {/* Name & Role */}
        <h4 className="designer-card__name" title={member.name}>
          {member.name}
        </h4>
        <p className="designer-card__role" title={member.role}>
          {member.role}
        </p>

        {/* Quick-Dial Phone Contact */}
        {member.phone && (
          <a
            href={`tel:${member.phone.replace(/\s+/g, '')}`}
            className="designer-card__phone"
            title="Call designer"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>{member.phone}</span>
          </a>
        )}

        {/* Social Connection Icons */}
        <div className="designer-card__socials">
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="designer-social-btn"
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
              className="designer-social-btn"
              aria-label={`${member.name} LinkedIn`}
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
