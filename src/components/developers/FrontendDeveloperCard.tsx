import React, { memo } from 'react'
import type { FrontendDeveloperMember } from '@/data/developers'
import { NeonSplatterCard } from './NeonSplatterCard'
import './FrontendDeveloperCard.css'

interface FrontendDeveloperCardProps {
  developer: FrontendDeveloperMember
}

export const FrontendDeveloperCard: React.FC<FrontendDeveloperCardProps> = memo(({ developer }) => {
  return (
    <NeonSplatterCard>
      {/* Left Column: Graphic / Artwork with Transparent Background */}
      <div className="frontend-dev-card__graphic-col">
        <div className="frontend-dev-card__img-container">
          <img
            src={developer.image}
            alt={developer.name}
            className="frontend-dev-card__img"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Right Column: Name, Description, and Social Links */}
      <div className="frontend-dev-card__info-col">
        {/* Developer Name */}
        <h2
          className="frontend-dev-card__name"
          style={{
            color: developer.nameColor,
            textShadow: `0 2px 14px rgba(0, 0, 0, 0.8), 0 0 25px ${developer.nameColor}44`,
          }}
        >
          {developer.name}
        </h2>

        {/* Description Paragraph */}
        <p
          className="frontend-dev-card__desc"
          style={{
            color: developer.textColor,
            textShadow: `0 0 12px ${developer.textColor}33`,
          }}
        >
          {developer.description}
        </p>

        {/* Social Icons */}
        <div className="frontend-dev-card__socials">
          {/* LinkedIn Icon */}
          <a
            href={developer.linkedinUrl || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${developer.name}'s LinkedIn Profile`}
            className="frontend-dev-card__social-link frontend-dev-card__social-link--linkedin"
            title="LinkedIn Profile"
          >
            <svg
              className="frontend-dev-card__social-svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
            </svg>
          </a>

          {/* GitHub Icon */}
          <a
            href={developer.githubUrl || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${developer.name}'s GitHub Profile`}
            className="frontend-dev-card__social-link frontend-dev-card__social-link--github"
            title="GitHub Profile"
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
        </div>
      </div>
    </NeonSplatterCard>
  )
})
