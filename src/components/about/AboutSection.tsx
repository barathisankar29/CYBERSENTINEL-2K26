import { useState } from 'react'
import {
  collegeData,
  cyberSentinelData,
  hackathonClubData,
  chiefPatrons,
  patrons,
} from '@/data/about'
import './AboutSection.css'

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'college' | 'symposium' | 'club'>('all')

  return (
    <section id="about" className="about-section" aria-label="About CyberSentinel 2K26">
      {/* Seamless Horizon Laser Seam & Portal Atmospheric Mist */}
      <div className="about-section__horizon-line" aria-hidden="true" />
      <div className="about-section__portal-mist" aria-hidden="true" />

      {/* Background Cyber Ambient Glow Elements */}
      <div className="about-section__bg-glow about-section__bg-glow--cyan" aria-hidden="true" />
      <div className="about-section__bg-glow about-section__bg-glow--violet" aria-hidden="true" />
      <div className="about-section__bg-glow about-section__bg-glow--pink" aria-hidden="true" />
      <div className="about-section__grid-pattern" aria-hidden="true" />

      <div className="about-section__container">
        {/* Section Header */}
        <header className="about-header">
          <div className="about-header__telemetry">
            <span className="about-header__dot" />
            <span className="about-header__code">SYSTEM ARCHIVE // NODE 0x01</span>
            <span className="about-header__bracket">[ABOUT_SECTION]</span>
          </div>

          <h2 className="about-header__title">
            <span className="about-header__title-gradient">ABOUT</span>{' '}
            <span className="about-header__title-neon">CYBERSENTINEL</span>
          </h2>

          <p className="about-header__subtitle">
            A convergence of visionary leadership, techno-cultural excellence, and student innovation at Vel Tech High Tech.
          </p>

          {/* Quick Filter Navigation HUD */}
          <div className="about-filter-hud" role="tablist" aria-label="About Navigation Filter">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`about-filter-btn ${activeTab === 'all' ? 'about-filter-btn--active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <span className="about-filter-btn__marker" />
              <span>ALL INTEL</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'college'}
              className={`about-filter-btn ${activeTab === 'college' ? 'about-filter-btn--active' : ''}`}
              onClick={() => setActiveTab('college')}
            >
              <span className="about-filter-btn__marker" />
              <span>VEL TECH</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'symposium'}
              className={`about-filter-btn ${activeTab === 'symposium' ? 'about-filter-btn--active' : ''}`}
              onClick={() => setActiveTab('symposium')}
            >
              <span className="about-filter-btn__marker" />
              <span>CYBERSENTINEL</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'club'}
              className={`about-filter-btn ${activeTab === 'club' ? 'about-filter-btn--active' : ''}`}
              onClick={() => setActiveTab('club')}
            >
              <span className="about-filter-btn__marker" />
              <span>HACKATHON CLUB</span>
            </button>
          </div>

          <div className="about-header__divider">
            <span className="about-header__divider-line" />
            <span className="about-header__divider-gem" />
            <span className="about-header__divider-line" />
          </div>
        </header>

        {/* 1. College Section: Vel Tech High Tech */}
        {(activeTab === 'all' || activeTab === 'college') && (
          <article className="cyber-card cyber-card--college bldg-card" data-aos="fade-up">
            <div className="bldg-card__roof">
              <div className="bldg-card__roof-beacon">
                <span className="bldg-card__roof-light" />
                <span className="bldg-card__roof-text">SECTOR 01 // MEGANODE COMPLEX</span>
              </div>
              <div className="bldg-card__roof-coords">
                <span>CHENNAI METROPOLIS // BLDG.01</span>
              </div>
            </div>

            <div className="cyber-card__corner cyber-card__corner--tl" />
            <div className="cyber-card__corner cyber-card__corner--tr" />
            <div className="cyber-card__corner cyber-card__corner--bl" />
            <div className="cyber-card__corner cyber-card__corner--br" />

            <div className="cyber-card__layout">
              {/* Left Visual: Floating Emblem Showcase */}
              <div className="cyber-card__visual">
                <div className="emblem-orb emblem-orb--college">
                  <div className="emblem-orb__scan-ring" />
                  <div className="emblem-orb__pulse" />
                  <img
                    src={collegeData.sealSrc}
                    alt="Vel Tech Emblem"
                    className="emblem-orb__image"
                    width={180}
                    height={180}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="cyber-card__label-tag">
                  <span className="cyber-card__label-dot" />
                  <span>ESTD. {collegeData.established}</span>
                </div>
              </div>

              {/* Right Content */}
              <div className="cyber-card__content">
                <div className="cyber-card__badge-row">
                  <span className="cyber-badge cyber-badge--pink">INSTITUTION PROFILE</span>
                  <span className="cyber-badge cyber-badge--subtle">AUTONOMOUS</span>
                </div>

                <h3 className="cyber-card__title">
                  {collegeData.name}
                </h3>

                <p className="cyber-card__lead">
                  {collegeData.affiliation}
                </p>

                <p className="cyber-card__desc">
                  {collegeData.description}
                </p>

                {/* Telemetry Stats Grid */}
                <div className="cyber-stats-grid">
                  {collegeData.stats.map((stat) => (
                    <div key={stat.label} className="cyber-stat-item">
                      <span className="cyber-stat-item__val">{stat.value}</span>
                      <span className="cyber-stat-item__lbl">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}

        {/* 2. Symposium Section: CyberSentinel 2K26 */}
        {(activeTab === 'all' || activeTab === 'symposium') && (
          <article className="cyber-card cyber-card--symposium cyber-card--reverse bldg-card" data-aos="fade-up">
            <div className="bldg-card__roof">
              <div className="bldg-card__roof-beacon">
                <span className="bldg-card__roof-light" />
                <span className="bldg-card__roof-text">SECTOR 02 // CENTRAL COMMAND TOWER</span>
              </div>
              <div className="bldg-card__roof-coords">
                <span>CYBER ARENA // BLDG.02</span>
              </div>
            </div>

            <div className="cyber-card__corner cyber-card__corner--tl" />
            <div className="cyber-card__corner cyber-card__corner--tr" />
            <div className="cyber-card__corner cyber-card__corner--bl" />
            <div className="cyber-card__corner cyber-card__corner--br" />

            <div className="cyber-card__layout">
              {/* Left Visual / Shield */}
              <div className="cyber-card__visual">
                <div className="emblem-orb emblem-orb--symposium">
                  <div className="emblem-orb__scan-ring emblem-orb__scan-ring--magenta" />
                  <div className="emblem-orb__pulse emblem-orb__pulse--magenta" />
                  <img
                    src={cyberSentinelData.shieldSrc}
                    alt="CyberSentinel Shield"
                    className="emblem-orb__image emblem-orb__image--shield"
                    width={180}
                    height={180}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="cyber-card__label-tag cyber-card__label-tag--magenta">
                  <span className="cyber-card__label-dot cyber-card__label-dot--magenta" />
                  <span>EDITION // 2K26</span>
                </div>
              </div>

              {/* Right Content */}
              <div className="cyber-card__content">
                <div className="cyber-card__badge-row">
                  <span className="cyber-badge cyber-badge--pink">ANNUAL SYMPOSIUM</span>
                  <span className="cyber-badge cyber-badge--cyan">TECHNO-CULTURAL</span>
                </div>

                <h3 className="cyber-card__title cyber-card__title--gradient">
                  {cyberSentinelData.title}
                </h3>

                <p className="cyber-card__lead cyber-card__lead--cyan">
                  {cyberSentinelData.subtitle} • {cyberSentinelData.organizedBy}
                </p>

                <p className="cyber-card__desc">
                  {cyberSentinelData.description}
                </p>

                {/* Cyber Highlights */}
                <div className="cyber-highlights">
                  <div className="cyber-highlight-chip">
                    <span className="cyber-highlight-chip__icon">⚡</span>
                    <span>High-Stakes Coding & Hackathons</span>
                  </div>
                  <div className="cyber-highlight-chip">
                    <span className="cyber-highlight-chip__icon">🛡️</span>
                    <span>Cybersecurity & CTF Warfare</span>
                  </div>
                  <div className="cyber-highlight-chip">
                    <span className="cyber-highlight-chip__icon">🚀</span>
                    <span>AI, Web3 & Tech Exhibitions</span>
                  </div>
                  <div className="cyber-highlight-chip">
                    <span className="cyber-highlight-chip__icon">🎭</span>
                    <span>Electrifying Cultural Showcases</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* 3. Hackathon Club Section */}
        {(activeTab === 'all' || activeTab === 'club') && (
          <article className="cyber-card cyber-card--club bldg-card" data-aos="fade-up">
            <div className="bldg-card__roof">
              <div className="bldg-card__roof-beacon">
                <span className="bldg-card__roof-light" />
                <span className="bldg-card__roof-text">SECTOR 03 // INNOVATION LAB CONCOURSE</span>
              </div>
              <div className="bldg-card__roof-coords">
                <span>R&D POD // BLDG.03</span>
              </div>
            </div>

            <div className="cyber-card__corner cyber-card__corner--tl" />
            <div className="cyber-card__corner cyber-card__corner--tr" />
            <div className="cyber-card__corner cyber-card__corner--bl" />
            <div className="cyber-card__corner cyber-card__corner--br" />

            <div className="cyber-card__layout">
              {/* Left Visual: Hackathon Club Official Logo */}
              <div className="cyber-card__visual">
                <div className="emblem-orb emblem-orb--club">
                  <div className="emblem-orb__scan-ring emblem-orb__scan-ring--violet" />
                  <div className="emblem-orb__pulse emblem-orb__pulse--violet" />
                  <img
                    src={hackathonClubData.logoSrc}
                    alt="Hackathon Club Logo"
                    className="emblem-orb__image emblem-orb__image--club"
                    width={180}
                    height={180}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="cyber-card__label-tag cyber-card__label-tag--violet">
                  <span className="cyber-card__label-dot cyber-card__label-dot--violet" />
                  <span>CLUB // HUB</span>
                </div>
              </div>

              {/* Right Content */}
              <div className="cyber-card__content">
                <div className="cyber-card__badge-row">
                  <span className="cyber-badge cyber-badge--pink">STUDENT INNOVATION</span>
                  <span className="cyber-badge cyber-badge--cyan">DEVELOPER SYNDICATE</span>
                </div>

                <h3 className="cyber-card__title">
                  {hackathonClubData.title}
                </h3>

                <p className="cyber-card__lead cyber-card__lead--violet">
                  {hackathonClubData.subtitle}
                </p>

                <p className="cyber-card__desc">
                  {hackathonClubData.description}
                </p>

                {/* Club Executive Council Section with Building Theme */}
                <div className="club-operatives">
                  <div className="club-operatives-header">
                    <div className="club-operatives-header__left">
                      <span className="club-operatives-header__beacon" />
                      <span className="club-operatives-header__title">COUNCIL ARCHITECTURE // CORE OPERATIVES</span>
                    </div>
                    <span className="club-operatives-header__count">[06 PODS ACTIVE]</span>
                  </div>

                  <div className="club-members-grid">
                    {hackathonClubData.members.map((member, idx) => (
                      <div
                        key={member.name}
                        className={`club-member-card club-member-card--${member.color} bldg-pod`}
                        tabIndex={0}
                      >
                        {/* Architectural Pod Rooftop Status */}
                        <div className="bldg-pod__roof">
                          <div className="bldg-pod__beacon">
                            <span className={`bldg-pod__dot bldg-pod__dot--${member.color}`} />
                            <span className="bldg-pod__id">POD-0{idx + 1}</span>
                          </div>
                          <span className={`bldg-pod__lvl bldg-pod__lvl--${member.color}`}>LVL.26</span>
                        </div>

                        {/* Structural Corner Brackets */}
                        <div className={`bldg-pod__corner bldg-pod__corner--tl bldg-pod__corner--${member.color}`} />
                        <div className={`bldg-pod__corner bldg-pod__corner--tr bldg-pod__corner--${member.color}`} />
                        <div className={`bldg-pod__corner bldg-pod__corner--bl bldg-pod__corner--${member.color}`} />
                        <div className={`bldg-pod__corner bldg-pod__corner--br bldg-pod__corner--${member.color}`} />

                        {/* Side Structural Guides */}
                        <div className={`bldg-pod__pillar bldg-pod__pillar--left bldg-pod__pillar--${member.color}`} aria-hidden="true" />
                        <div className={`bldg-pod__pillar bldg-pod__pillar--right bldg-pod__pillar--${member.color}`} aria-hidden="true" />

                        {/* Operative Details */}
                        <div className="club-member-card__details">
                          <h4 className="club-member-card__name">{member.name}</h4>
                          <div className={`club-member-card__role-pill club-member-card__role-pill--${member.color}`}>
                            <span className={`club-member-card__dot club-member-card__dot--${member.color}`} />
                            <span className="club-member-card__role">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        {/* Pod Base / Foundation */}
                        <div className="bldg-pod__base">
                          <span className="bldg-pod__base-line" />
                          <span className="bldg-pod__base-text">STATUS: ACTIVE</span>
                          <span className="bldg-pod__base-line" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* 4. Leadership & Patronage Section */}
        <section className="leadership-section" aria-label="Leadership & Patrons">
          {/* Chief Patrons */}
          <div className="leadership-group">
            <div className="leadership-header">
              <div className="leadership-header__tag">
                <span className="leadership-header__dot" />
                <span>EXECUTIVE GOVERNANCE</span>
              </div>
              <h3 className="leadership-header__title">CHIEF PATRONS</h3>
              <p className="leadership-header__desc">The guiding visionaries inspiring institutional excellence and student advancement</p>
            </div>

            <div className="patrons-grid patrons-grid--chief">
              {chiefPatrons.map((patron, idx) => (
                <div key={patron.name} className="patron-card bldg-tower" tabIndex={0}>
                  <div className="patron-card__frame bldg-tower__frame">
                    {/* Skyscraper Spire / Apex Crown */}
                    <div className="bldg-tower__roof">
                      <div className="bldg-tower__beacon">
                        <span className="bldg-tower__beacon-light" />
                        <span className="bldg-tower__beacon-code">
                          {idx === 0 ? 'TOWER-01 // FOUNDER APEX' : idx === 1 ? 'TOWER-02 // FOUNDRESS APEX' : 'TOWER-03 // EXECUTIVE APEX'}
                        </span>
                      </div>
                      <div className="bldg-tower__level">
                        <span>LVL.26</span>
                      </div>
                    </div>

                    {/* Structural Steel Joint Corner Brackets */}
                    <div className="patron-card__corner patron-card__corner--tl" />
                    <div className="patron-card__corner patron-card__corner--tr" />
                    <div className="patron-card__corner patron-card__corner--bl" />
                    <div className="patron-card__corner patron-card__corner--br" />

                    {/* Vertical Exoskeleton Structural Pillars */}
                    <div className="bldg-tower__pillar bldg-tower__pillar--left" aria-hidden="true" />
                    <div className="bldg-tower__pillar bldg-tower__pillar--right" aria-hidden="true" />

                    {/* Observation Bay (Clean Neutral Glass Viewport) */}
                    <div className="patron-card__photo-container">
                      <img
                        src={patron.image}
                        alt={patron.name}
                        className="patron-card__photo"
                        loading="eager"
                        decoding="async"
                        width={280}
                        height={240}
                      />
                      <div className="patron-card__photo-overlay" />
                    </div>

                    <div className="patron-card__info">
                      <h4 className="patron-card__name">{patron.name}</h4>
                      <div className="patron-card__role-chip">
                        <span className="patron-card__role-indicator" />
                        <span className="patron-card__role">{patron.role}</span>
                      </div>
                      <p className="patron-card__designation">{patron.designation}</p>
                    </div>

                    {/* Tower Podium Foundation */}
                    <div className="bldg-tower__podium">
                      <span className="bldg-tower__podium-bar" />
                      <span className="bldg-tower__podium-text">MONOLITH // 0x0{idx + 1}</span>
                      <span className="bldg-tower__podium-bar" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patron (Principal) */}
          <div className="leadership-group leadership-group--patron">
            <div className="leadership-header">
              <div className="leadership-header__tag">
                <span className="leadership-header__dot" />
                <span>ACADEMIC LEADERSHIP</span>
              </div>
              <h3 className="leadership-header__title">PATRON</h3>
              <p className="leadership-header__desc">Empowering student innovators and academic excellence</p>
            </div>

            <div className="patrons-grid patrons-grid--principal">
              {patrons.map((patron) => (
                <div key={patron.name} className="patron-card patron-card--principal bldg-tower" tabIndex={0}>
                  <div className="patron-card__frame bldg-tower__frame">
                    {/* Skyscraper Spire / Apex Crown */}
                    <div className="bldg-tower__roof">
                      <div className="bldg-tower__beacon">
                        <span className="bldg-tower__beacon-light" />
                        <span className="bldg-tower__beacon-code">TOWER-04 // ACADEMIC APEX</span>
                      </div>
                      <div className="bldg-tower__level">
                        <span>LVL.26</span>
                      </div>
                    </div>

                    <div className="patron-card__corner patron-card__corner--tl" />
                    <div className="patron-card__corner patron-card__corner--tr" />
                    <div className="patron-card__corner patron-card__corner--bl" />
                    <div className="patron-card__corner patron-card__corner--br" />

                    <div className="bldg-tower__pillar bldg-tower__pillar--left" aria-hidden="true" />
                    <div className="bldg-tower__pillar bldg-tower__pillar--right" aria-hidden="true" />

                    {/* Observation Bay (Clean Neutral Glass Viewport) */}
                    <div className="patron-card__photo-container">
                      <img
                        src={patron.image}
                        alt={patron.name}
                        className="patron-card__photo"
                        loading="eager"
                        decoding="async"
                        width={280}
                        height={240}
                      />
                      <div className="patron-card__photo-overlay" />
                    </div>

                    <div className="patron-card__info">
                      <h4 className="patron-card__name">{patron.name}</h4>
                      <div className="patron-card__role-chip">
                        <span className="patron-card__role-indicator" />
                        <span className="patron-card__role">{patron.role}</span>
                      </div>
                      <p className="patron-card__designation">{patron.designation}</p>
                    </div>

                    {/* Tower Podium Foundation */}
                    <div className="bldg-tower__podium">
                      <span className="bldg-tower__podium-bar" />
                      <span className="bldg-tower__podium-text">MONOLITH // 0x04</span>
                      <span className="bldg-tower__podium-bar" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
