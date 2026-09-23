import type { CredentialMember } from '@/data/credentials'
import { InstagramIcon, LinkedInIcon, PhoneIcon } from './SocialIcons'
import './StudentCircuitCard.css'

interface StudentCircuitCardProps {
  member: CredentialMember
  isActive?: boolean
  index?: number
  onClick?: () => void
}

export function StudentCircuitCard({
  member,
  isActive = false,
  index = 1,
  onClick,
}: StudentCircuitCardProps) {
  return (
    <div
      className={`student-circuit-card ${isActive ? 'student-circuit-card--active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.()
        }
      }}
    >
      {/* Corner Circuit Accents */}
      <span className="student-circuit-card__corner student-circuit-card__corner--tl" aria-hidden="true" />
      <span className="student-circuit-card__corner student-circuit-card__corner--tr" aria-hidden="true" />
      <span className="student-circuit-card__corner student-circuit-card__corner--bl" aria-hidden="true" />
      <span className="student-circuit-card__corner student-circuit-card__corner--br" aria-hidden="true" />

      {/* Holographic Laser Scanline Sweep */}
      <div className="student-circuit-card__scanner" aria-hidden="true">
        <div className="student-circuit-card__scanner-line" />
      </div>

      {/* Card Content */}
      <div className="student-circuit-card__content">
        {/* Top Telemetry Chip */}
        <div className="student-circuit-card__badge">
          <span className="student-circuit-card__dot" />
          <span>COORDINATOR // 0{index}</span>
        </div>

        {/* Photo Viewfinder with Glowing Frame */}
        <div className="student-circuit-card__photo-wrapper">
          <img
            src={member.image}
            alt={member.name}
            className="student-circuit-card__photo"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Name & Role */}
        <h4 className="student-circuit-card__name">{member.name}</h4>
        <p className="student-circuit-card__role">{member.role}</p>

        {/* Phone Contact */}
        {member.phone && (
          <a
            href={`tel:${member.phone.replace(/\s+/g, '')}`}
            className="student-circuit-card__phone"
            onClick={(e) => e.stopPropagation()}
            title="Call coordinator"
          >
            <PhoneIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>{member.phone}</span>
          </a>
        )}

        {/* Social Icons */}
        <div className="student-circuit-card__socials">
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="social-icon-btn"
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
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
