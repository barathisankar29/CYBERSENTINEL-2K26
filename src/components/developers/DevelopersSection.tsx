import React from 'react'
import { frontendDevelopersData, backendDevelopersData } from '@/data/developers'
import { CoverflowCarousel } from '@/components/credentials/CoverflowCarousel'
import { FrontendDeveloperCard } from './FrontendDeveloperCard'
import { DeveloperGlitchCard } from './DeveloperGlitchCard'
import './DevelopersSection.css'

// Both teams use the student coordinators' cover-flow carousel (same
// transition), each with its own card design and spacing.
export const DevelopersSection: React.FC = () => {
  return (
    <div id="developers" className="cred-group developers-section">
      {/* 1. WEB DESIGNERS AND FRONTEND DEVELOPERS */}
      <div className="developers-section__subgroup">
        <div className="developers-section__header">
          <h3 className="cred-group-title cred-group-title--pink developers-section__title">
            <span className="developers-section__title-white">WEB DESIGNERS AND</span>{' '}
            <span className="developers-section__title-neon">FRONTEND DEVELOPERS</span>
          </h3>
        </div>

        {/* Barathi (first entry) is always the card showing when this scrolls into view. */}
        <CoverflowCarousel
          items={frontendDevelopersData}
          getKey={(dev) => dev.id}
          getLabel={(dev) => dev.name}
          renderItem={(dev) => <FrontendDeveloperCard developer={dev} />}
          autoDelayMs={7000}
          xStep={{ desktop: (vw) => Math.min(620, vw * 0.43), mobile: 88 }}
          variant="infinite-carousel--frontend"
          rewindWhenHidden
          dimWith="opacity"
          labels={{
            prev: 'Previous developer',
            next: 'Next developer',
            dots: 'Web designers and frontend developers',
            dot: (name) => `Show ${name}`,
          }}
        />
      </div>

      {/* 2. BACKEND DEVELOPERS */}
      <div className="developers-section__subgroup developers-section__subgroup--backend">
        <div className="developers-section__header">
          <h3 className="cred-group-title cred-group-title--cyan developers-section__title">
            <span className="developers-section__title-white">MEET OUR</span>{' '}
            <span className="developers-section__title-neon developers-section__title-neon--cyan">BACKEND DEVELOPERS</span>
          </h3>
        </div>

        <CoverflowCarousel
          items={backendDevelopersData}
          getKey={(dev) => dev.id}
          getLabel={(dev) => dev.name}
          renderItem={(dev, { isActive }) => <DeveloperGlitchCard developer={dev} isActive={isActive} />}
          autoDelayMs={3000}
          xStep={{ desktop: 270, mobile: 88 }}
          variant="infinite-carousel--backend"
          dimWith="opacity"
          labels={{
            prev: 'Previous developer',
            next: 'Next developer',
            dots: 'Backend developers',
            dot: (name) => `Show ${name}`,
          }}
        />
      </div>
    </div>
  )
}
