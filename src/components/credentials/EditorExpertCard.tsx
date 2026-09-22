import React, { useState, useRef, useCallback } from 'react'
import type { CredentialMember } from '@/data/credentials'
import { InstagramIcon, LinkedInIcon, PhoneIcon } from './SocialIcons'
import './EditorExpertCard.css'

interface EditorExpertCardProps {
  member: CredentialMember
  index?: number
}

export function EditorExpertCard({
  member,
  index = 1,
}: EditorExpertCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  )

  // Subtle 3D tilt interaction on hover
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

  const timelineTag = `TIMELINE // 0${index}`

  return (
    <div className="editor-card-perspective">
      <div
        ref={cardRef}
        className="editor-card"
        style={{ transform: transformStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Video Scrubber / Timeline Reel Bar */}
        <div className="editor-card__header">
          <div className="editor-card__status">
            <span className="editor-card__rec-dot" aria-hidden="true" />
            <span className="editor-card__rec-text">REC 24FPS</span>
          </div>
          <span className="editor-card__code">{timelineTag}</span>
        </div>

        {/* Mini Timeline Ticks Ruler */}
        <div className="editor-card__ruler" aria-hidden="true">
          <span className="ruler-tick ruler-tick--major" />
          <span className="ruler-tick" />
          <span className="ruler-tick" />
          <span className="ruler-tick ruler-tick--major" />
          <span className="ruler-tick" />
          <span className="ruler-tick" />
          <span className="ruler-tick ruler-tick--major" />
        </div>

        {/* Viewfinder Portrait Box */}
        <div className="editor-card__viewport">
          <span className="editor-card__bracket editor-card__bracket--tl" aria-hidden="true" />
          <span className="editor-card__bracket editor-card__bracket--tr" aria-hidden="true" />
          <span className="editor-card__bracket editor-card__bracket--bl" aria-hidden="true" />
          <span className="editor-card__bracket editor-card__bracket--br" aria-hidden="true" />
          
          <div className="editor-card__badge-4k" aria-hidden="true">4K UHD</div>

          <img
            src={member.image}
            alt={member.name}
            className="editor-card__img"
            loading="lazy"
          />
        </div>

        {/* Name & Role */}
        <h4 className="editor-card__name" title={member.name}>
          {member.name}
        </h4>
        <p className="editor-card__role" title={member.role}>
          {member.role}
        </p>

        {/* Quick-Dial Phone Contact */}
        {member.phone && (
          <a
            href={`tel:${member.phone.replace(/\s+/g, '')}`}
            className="editor-card__phone"
            title="Call editor"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>{member.phone}</span>
          </a>
        )}

        {/* Social Connection Icons */}
        <div className="editor-card__socials">
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="editor-social-btn"
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
              className="editor-social-btn"
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
