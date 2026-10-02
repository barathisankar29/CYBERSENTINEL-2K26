import React, { useState } from 'react'
import {
  frontendDevelopersData,
  backendDevelopersData,
  type FrontendDeveloperMember,
  type DeveloperMember,
} from '@/data/developers'
import { CoverflowCarousel } from '@/components/credentials/CoverflowCarousel'
import { FrontendDeveloperCard } from './FrontendDeveloperCard'
import { DeveloperGlitchCard } from './DeveloperGlitchCard'
import './DevelopersSection.css'

export type UnifiedDeveloper =
  | { type: 'frontend'; data: FrontendDeveloperMember }
  | { type: 'backend'; data: DeveloperMember }

const barathi = frontendDevelopersData.find((d) => d.id === 'fed-barathi-sankar')!
const hariharan = backendDevelopersData.find((d) => d.id === 'dev-hariharan-ramesh')!
const jeevadharani = frontendDevelopersData.find((d) => d.id === 'fed-jeevadharani')!
const hemal = backendDevelopersData.find((d) => d.id === 'dev-hemal-ramm-s')!
const pranith = frontendDevelopersData.find((d) => d.id === 'fed-pranith-l')!

// Specified order: 1. Barathi Sankar -> 2. Hariharan Ramesh -> 3. Jeevadharani -> 4. Hemal -> 5. Pranith
const allDevelopers: UnifiedDeveloper[] = [
  { type: 'frontend', data: barathi },
  { type: 'backend', data: hariharan },
  { type: 'frontend', data: jeevadharani },
  { type: 'backend', data: hemal },
  { type: 'frontend', data: pranith },
]

export const DevelopersSection: React.FC = () => {
  const [activeDev, setActiveDev] = useState<UnifiedDeveloper>(allDevelopers[0])

  return (
    <div id="developers" className="cred-group developers-section">
      <div className="developers-section__subgroup">
        <div className="developers-section__header">
          {/* Main Title: Our Designers & Developers */}
          <h3 className="cred-group-title developers-section__title">
            <span className="developers-section__title-neon">OUR DESIGNERS &</span>{' '}
            <span className="developers-section__title-neon">DEVELOPERS</span>
          </h3>

          {/* Dynamic Second Title: switches between "Backend Team" and "Frontend Team" */}
          <div className="developers-section__subtitle-wrap" aria-live="polite">
            <h4
              className={`developers-section__subtitle developers-section__subtitle--${activeDev.type}`}
            >
              <span className="developers-section__subtitle-dot" />
              <span className="developers-section__subtitle-text">
                {activeDev.type === 'backend' ? 'Backend Team' : 'Frontend Team'}
              </span>
            </h4>
          </div>
        </div>

        {/* Unified Coverflow Carousel combining both Backend and Frontend Developers */}
        <CoverflowCarousel
          items={allDevelopers}
          getKey={(dev) => dev.data.id}
          getLabel={(dev) => dev.data.name}
          getItemClassName={(dev) =>
            dev.type === 'frontend'
              ? 'infinite-carousel-item--frontend'
              : 'infinite-carousel-item--backend'
          }
          renderItem={(dev, { isActive }) =>
            dev.type === 'frontend' ? (
              <FrontendDeveloperCard developer={dev.data} />
            ) : (
              <DeveloperGlitchCard developer={dev.data} isActive={isActive} />
            )
          }
          onActiveChange={(_idx, dev) => setActiveDev(dev)}
          autoDelayMs={4500}
          xStep={{
            desktop: 270,
            mobile: 88,
          }}
          variant={`infinite-carousel--developers infinite-carousel--developers-${activeDev.type}`}
          rewindWhenHidden
          dimWith="opacity"
          labels={{
            prev: 'Previous developer',
            next: 'Next developer',
            dots: 'Developers team',
            dot: (name) => `Show ${name}`,
          }}
        />
      </div>
    </div>
  )
}
