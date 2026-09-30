import React from 'react'
import { frontendDevelopersData, backendDevelopersData } from '@/data/developers'
import { DeveloperMascotPushCarousel } from './DeveloperMascotPushCarousel'
import { BackendDevelopersCarousel } from './BackendDevelopersCarousel'
import './DevelopersSection.css'

export const DevelopersSection: React.FC = () => {
  return (
    <div id="developers" className="cred-group developers-section">
      {/* 1. FRONTEND DEVELOPERS (MASCOT PUSHING CAROUSEL WITH SIGNATURE NEON SPLATTER CARD) */}
      <div className="developers-section__subgroup">
        <div className="developers-section__header">
          <h3 className="cred-group-title cred-group-title--pink developers-section__title">
            <span className="developers-section__title-white">MEET OUR</span>{' '}
            <span className="developers-section__title-neon">FRONTEND DEVELOPERS</span>
          </h3>
        </div>

        <DeveloperMascotPushCarousel developers={frontendDevelopersData} />
      </div>

      {/* 2. BACKEND DEVELOPERS (FAST LIGHTWEIGHT CAROUSEL) */}
      <div className="developers-section__subgroup developers-section__subgroup--backend">
        <div className="developers-section__header">
          <h3 className="cred-group-title cred-group-title--cyan developers-section__title">
            <span className="developers-section__title-white">MEET OUR</span>{' '}
            <span className="developers-section__title-neon developers-section__title-neon--cyan">BACKEND DEVELOPERS</span>
          </h3>
        </div>

        <BackendDevelopersCarousel developers={backendDevelopersData} />
      </div>
    </div>
  )
}
