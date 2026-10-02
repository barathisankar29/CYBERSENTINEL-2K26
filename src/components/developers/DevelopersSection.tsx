import React, { useState } from 'react'
import {
  frontendDevelopersData,
  backendDevelopersData,
} from '@/data/developers'
import { DeveloperMascotPushCarousel, type UnifiedDeveloper } from './DeveloperMascotPushCarousel'
import './DevelopersSection.css'

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

        {/* Unified Mascot Pushing Carousel with all 5 Operatives */}
        <DeveloperMascotPushCarousel
          developers={allDevelopers}
          onActiveChange={setActiveDev}
        />
      </div>
    </div>
  )
}
