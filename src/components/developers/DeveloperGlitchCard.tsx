import React, { memo, type CSSProperties } from 'react'
import type { DeveloperMember } from '@/data/developers'
import { NeonSplatterCard } from './NeonSplatterCard'
import './FrontendDeveloperCard.css'
import './DeveloperGlitchCard.css'

interface DeveloperGlitchCardProps {
  developer: DeveloperMember
  isActive?: boolean
  onClick?: () => void
}

export const DeveloperGlitchCard: React.FC<DeveloperGlitchCardProps> = memo(({
  developer,
}) => {
  const nameColor = developer.nameColor || developer.accentHex || '#00f0ff'
  const textColor = developer.textColor || developer.secondaryHex || '#38bdf8'

  const themeVars = {
    '--dev-accent': developer.accentHex || nameColor,
    '--dev-secondary': developer.secondaryHex || textColor,
  } as CSSProperties

  return (
    <NeonSplatterCard>
      {/* Top Column: Cyberpunk Geometric Stitch Art Showcase matching frontend badges */}
      <div className="frontend-dev-card__graphic-col" style={themeVars}>
        <div className="frontend-dev-card__img-container">
          <div className="dev-card__art-stage">
            {/* Layer 1: Geometric Stitched Facets Behind Avatar */}
            <div className="dev-card__geo-wrap" aria-hidden="true">
              {/* Main Tilted Polygonal Shield */}
              <div className="dev-card__geo-shape dev-card__geo-shape--primary" />

              {/* Running Stitches on the Geometric Polygon (SVG with neon dash) */}
              <svg className="dev-card__geo-stitch-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon
                  points="10,22 88,8 78,92 12,80"
                  className="dev-card__polygon-stitch"
                />
                <polygon
                  points="18,28 80,18 72,84 20,74"
                  className="dev-card__polygon-stitch-inner"
                />
              </svg>

              {/* Secondary Intersecting Angle Shard with Dashed Seam */}
              <div className="dev-card__geo-shape dev-card__geo-shape--secondary" />
            </div>

            {/* Top-Right Energy Ray Burst Spikes */}
            <div className="dev-card__burst-sparks" aria-hidden="true">
              <span className="dev-card__burst-ray dev-card__burst-ray--1" />
              <span className="dev-card__burst-ray dev-card__burst-ray--2" />
              <span className="dev-card__burst-ray dev-card__burst-ray--3" />
            </div>

            {/* Developer Cutout Avatar */}
            <div className="dev-card__avatar-wrap">
              <img
                src={developer.avatar}
                alt={developer.name}
                className="dev-card__avatar-img"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Horizontal Speed & Glitch Slice Bars (Slicing across lower torso & sides) */}
            <div className="dev-card__speed-slices" aria-hidden="true">
              <span className="dev-card__slice dev-card__slice--1" />
              <span className="dev-card__slice dev-card__slice--2" />
              <span className="dev-card__slice dev-card__slice--3" />
              <span className="dev-card__slice dev-card__slice--4" />
              <span className="dev-card__slice dev-card__slice--5" />
              <span className="dev-card__slice dev-card__slice--6" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Column: Name, Description, and Social Links */}
      <div className="frontend-dev-card__info-col">
        {/* Developer Name in stylized Bangers font */}
        <h2
          className="frontend-dev-card__name"
          style={{
            color: nameColor,
            textShadow: `0 2px 14px rgba(0, 0, 0, 0.8), 0 0 25px ${nameColor}44`,
          }}
        >
          {developer.name}
        </h2>

        {/* Description Paragraph in Share Tech Mono font */}
        <p
          className="frontend-dev-card__desc"
          style={{
            color: textColor,
            textShadow: `0 0 12px ${textColor}33`,
          }}
        >
          {developer.description}
        </p>

        {/* Social Icons */}
        <div className="frontend-dev-card__socials">
          {/* LinkedIn Icon */}
          {developer.linkedin && (
            <a
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${developer.name}'s LinkedIn Profile`}
              className="frontend-dev-card__social-link frontend-dev-card__social-link--linkedin"
              title="LinkedIn Profile"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="frontend-dev-card__social-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
            </a>
          )}

          {/* GitHub Icon */}
          {developer.github && (
            <a
              href={developer.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${developer.name}'s GitHub Profile`}
              className="frontend-dev-card__social-link frontend-dev-card__social-link--github"
              title="GitHub Profile"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="frontend-dev-card__social-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          )}

          {/* Instagram Icon */}
          {developer.instagram && (
            <a
              href={developer.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${developer.name}'s Instagram Profile`}
              className="frontend-dev-card__social-link frontend-dev-card__social-link--instagram"
              title="Instagram Profile"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="frontend-dev-card__social-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.413.56.218.96.478 1.38.898.42.42.68.82.898 1.38.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.218.56-.478.96-.898 1.38-.42.42-.82.68-1.38.898-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413a3.71 3.71 0 0 1-1.38-.898 3.71 3.71 0 0 1-.898-1.38c-.164-.422-.36-1.057-.413-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.413-2.227.218-.56.478-.96.898-1.38.42-.42.82-.68 1.38-.898.422-.164 1.057-.36 2.227-.413 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.88 5.88 0 0 0-2.126 1.384A5.88 5.88 0 0 0 .63 4.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.058 1.278.261 2.15.558 2.913a5.88 5.88 0 0 0 1.384 2.126A5.88 5.88 0 0 0 4.14 23.37c.763.297 1.635.5 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.058 2.15-.261 2.913-.558a5.88 5.88 0 0 0 2.126-1.384 5.88 5.88 0 0 0 1.384-2.126c.297-.763.5-1.635.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.278-.261-2.15-.558-2.913a5.88 5.88 0 0 0-1.384-2.126A5.88 5.88 0 0 0 19.86.63C19.097.333 18.225.13 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </NeonSplatterCard>
  )
})
