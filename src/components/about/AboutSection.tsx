import {
  collegeData,
  cyberSentinelData,
  hackathonClubData,
  chiefPatrons,
  patrons,
} from '@/data/about'
import {
  convenorsData,
  coConvenorsData,
} from '@/data/credentials'
import { CyberNeonCard } from './CyberNeonCard'
import { PatronNeonCard } from './PatronNeonCard'
import { ConvenorHudCard } from '@/components/credentials/ConvenorHudCard'
import { CoConvenorMechaCard } from '@/components/credentials/CoConvenorMechaCard'
import './AboutSection.css'

export function AboutSection() {

  return (
    <section id="about" className="about-section" aria-label="About CyberSentinel 2K26">
      {/* Background Graphic: User's Cyberpunk Vel Tech College Building Image */}
      <div className="about-section__bg-wrap" aria-hidden="true">
        <div className="about-section__bg-image" />
        <div className="about-section__scanlines" />
      </div>


      {/* Background Cyber Ambient Glow Elements */}
      <div className="about-section__bg-glow about-section__bg-glow--cyan" aria-hidden="true" />
      <div className="about-section__bg-glow about-section__bg-glow--violet" aria-hidden="true" />
      <div className="about-section__bg-glow about-section__bg-glow--pink" aria-hidden="true" />
      <div className="about-section__grid-pattern" aria-hidden="true" />

      <div className="about-section__container">
        {/* Section Header */}
        <header className="about-header">

          <h2 className="about-header__title">
            <span className="about-header__title-gradient">ABOUT</span>{' '}
            <span className="about-header__title-neon">CYBERSENTINEL</span>
          </h2>

          <p className="about-header__subtitle">
            A convergence of visionary leadership, techno-cultural excellence, and student innovation at Vel Tech High Tech.
          </p>

          <div className="about-header__divider">
            <span className="about-header__divider-line" />
            <span className="about-header__divider-gem" />
            <span className="about-header__divider-line" />
          </div>
        </header>

        {/* 1. College Section: Vel Tech High Tech */}
        <CyberNeonCard
          badgeTitle=""
          badgeTag="VEL TECH"
          accentColor="purple"
          className="bldg-card"
        >
            <div className="bldg-card__roof">
              <div className="bldg-card__roof-beacon">
                <span className="bldg-card__roof-light" />
                <span className="bldg-card__roof-text">SECTOR 01 // MEGANODE COMPLEX</span>
              </div>
              <div className="bldg-card__roof-coords">
                <span>CHENNAI METROPOLIS // BLDG.01</span>
              </div>
            </div>

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
          </CyberNeonCard>

        {/* 2. Symposium Section: CyberSentinel 2K26 */}
        <CyberNeonCard
          badgeTitle=""
          badgeTag="CYBERSENTINEL 2K26"
          accentColor="purple"
          className="cyber-card--reverse bldg-card"
        >
            <div className="bldg-card__roof">
              <div className="bldg-card__roof-beacon">
                <span className="bldg-card__roof-light" />
                <span className="bldg-card__roof-text">SECTOR 02 // CENTRAL COMMAND TOWER</span>
              </div>
              <div className="bldg-card__roof-coords">
                <span>CYBER ARENA // BLDG.02</span>
              </div>
            </div>

            <div className="cyber-card__layout">
              {/* Left Visual / Shield */}
              <div className="cyber-card__visual">
                <div className="emblem-orb emblem-orb--symposium">
                  <div className="emblem-orb__scan-ring emblem-orb__scan-ring--magenta" />
                  <div className="emblem-orb__pulse emblem-orb__pulse--magenta" />
                  <img
                    src={cyberSentinelData.shieldSrc}
                    alt="CyberSentinel 2K26 logo"
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
          </CyberNeonCard>

        {/* 3. Hackathon Club Section */}
        <CyberNeonCard
          badgeTitle=""
          badgeTag="HACKATHON CLUB"
          accentColor="purple"
          className="bldg-card"
        >
            <div className="bldg-card__roof">
              <div className="bldg-card__roof-beacon">
                <span className="bldg-card__roof-light" />
                <span className="bldg-card__roof-text">SECTOR 03 // INNOVATION LAB CONCOURSE</span>
              </div>
              <div className="bldg-card__roof-coords">
                <span>R&D POD // BLDG.03</span>
              </div>
            </div>

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
                    <span className="club-operatives-header__count">[{String(hackathonClubData.members.length).padStart(2, '0')} PODS ACTIVE]</span>
                  </div>

                  <div className="club-members-grid">
                    {hackathonClubData.members.map((member) => {
                      const isPresident = member.role.toLowerCase() === 'president';
                      return (
                        <div
                          key={member.name}
                          className={`club-member-card club-member-card--${member.color} bldg-pod ${isPresident ? 'club-member-card--president' : ''}`}
                        >
                          {/* Heading as their role */}
                          <div className="bldg-pod__roof">
                            <div className="bldg-pod__beacon">
                              <span className={`bldg-pod__dot bldg-pod__dot--${member.color}`} />
                              <span className={`bldg-pod__role-heading bldg-pod__role-heading--${member.color}`}>{member.role}</span>
                            </div>
                          </div>

                          {/* Structural Corner Reticles */}
                          <div className={`bldg-pod__corner bldg-pod__corner--tl bldg-pod__corner--${member.color}`} />
                          <div className={`bldg-pod__corner bldg-pod__corner--tr bldg-pod__corner--${member.color}`} />
                          <div className={`bldg-pod__corner bldg-pod__corner--bl bldg-pod__corner--${member.color}`} />
                          <div className={`bldg-pod__corner bldg-pod__corner--br bldg-pod__corner--${member.color}`} />

                          {/* Operative Name */}
                          <div className="club-member-card__details">
                            <h4 className="club-member-card__name">{member.name}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CyberNeonCard>

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
                <PatronNeonCard
                  key={patron.name}
                  title={idx === 0 ? 'FOUNDER & CHAIRMAN' : idx === 1 ? 'FOUNDRESS & VICE-CHAIRMAN' : 'EXECUTIVE DIRECTOR'}
                  className="patron-hud-item"
                >
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
                </PatronNeonCard>
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
                <PatronNeonCard
                  key={patron.name}
                  title="PATRON // PRINCIPAL"
                  className="patron-hud-item patron-hud-item--principal"
                >
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
                </PatronNeonCard>
              ))}
            </div>
          </div>

          {/* Convenors */}
          <div id="convenors" className="leadership-group leadership-group--convenors">
            <div className="leadership-header">
              <div className="leadership-header__tag leadership-header__tag--cyan">
                <span className="leadership-header__dot leadership-header__dot--cyan" />
                <span>SYMPOSIUM CONVENORS</span>
              </div>
              <h3 className="leadership-header__title leadership-header__title--cyan">CONVENORS</h3>
              <p className="leadership-header__desc">Academic stewardship and departmental governance powering CyberSentinel 2K26</p>
            </div>

            <div className="convenors-grid">
              {convenorsData.map((conv, idx) => (
                <ConvenorHudCard
                  key={conv.id}
                  member={conv}
                  nodeCode={idx === 1 ? 'HOD_COMMAND // CSE' : 'ACAD_COMMAND // DEAN'}
                />
              ))}
            </div>
          </div>

          {/* Co-Convenors (Faculty Coordinators) */}
          <div id="co-convenors" className="leadership-group leadership-group--coconvenors">
            <div className="leadership-header">
              <div className="leadership-header__tag leadership-header__tag--cyan">
                <span className="leadership-header__dot leadership-header__dot--cyan" />
                <span>FACULTY COORDINATION</span>
              </div>
              <h3 className="leadership-header__title leadership-header__title--cyan">CO-CONVENORS</h3>
              <p className="leadership-header__desc">Faculty event coordinators driving execution, technical oversight, and logistics</p>
            </div>

            <div className="coconvenors-grid">
              {coConvenorsData.map((fac, idx) => (
                <CoConvenorMechaCard
                  key={fac.id}
                  member={fac}
                  index={idx + 1}
                />
              ))}
            </div>
          </div>

        </section>
      </div>
    </section>
  )
}
