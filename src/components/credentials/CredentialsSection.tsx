import {
  convenorsData,
  coConvenorsData,
  studentCoordinatorsData,
  editorsData,
  designersData,
} from '@/data/credentials'
import { ConvenorHudCard } from './ConvenorHudCard'
import { CoConvenorMechaCard } from './CoConvenorMechaCard'
import { StudentInfiniteCarousel } from './StudentInfiniteCarousel'
import { EditorExpertCard } from './EditorExpertCard'
import { DesignerTeamCard } from './DesignerTeamCard'
import { DevelopersSection } from '@/components/developers/DevelopersSection'
import './CredentialsSection.css'

export function CredentialsSection() {

  return (
    <section id="credentials" className="credentials-section" aria-label="Credentials & Committee">
      {/* Background Graphic: User's Cyberpunk Campus Corridor Image */}
      <div className="credentials-section__bg-wrap" aria-hidden="true">
        <div className="credentials-section__bg-image" />
        <div className="credentials-section__scanlines" />
      </div>

      {/* Seamless Horizon Laser Seam & Portal Atmospheric Mist matching About Section */}
      <div className="credentials-section__horizon-line" aria-hidden="true" />
      <div className="credentials-section__portal-mist" aria-hidden="true" />

      {/* Cyber Ambient Glow Elements */}
      <div className="credentials-section__bg-glow credentials-section__bg-glow--cyan" aria-hidden="true" />
      <div className="credentials-section__bg-glow credentials-section__bg-glow--violet" aria-hidden="true" />
      <div className="credentials-section__bg-glow credentials-section__bg-glow--pink" aria-hidden="true" />
      <div className="credentials-section__bg-glow credentials-section__bg-glow--orange" aria-hidden="true" />
      <div className="credentials-section__grid-pattern" aria-hidden="true" />

      <div className="credentials-section__container">
        {/* Main Section Header */}
        <header className="credentials-header">

          <h2 className="credentials-header__title">
            <span className="credentials-header__title-gradient">EVENT</span>{' '}
            <span className="credentials-header__title-neon">CREDENTIALS</span>
          </h2>

          <p className="credentials-header__subtitle">
            The visionary faculty leadership, creative syndicate, and dedicated student operatives powering the National Level Extravaganza.
          </p>
        </header>

        {/* 1. CONVENORS SECTION */}
        <div id="convenors" className="cred-group">
          <h3 className="cred-group-title cred-group-title--cyan">
            CONVENORS
          </h3>

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

        {/* 2. CO-CONVENORS (FACULTY COORDINATORS) */}
        <div id="co-convenors" className="cred-group">
          <h3 className="cred-group-title cred-group-title--cyan">
            CO-CONVENORS
          </h3>

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

        {/* 3. MEET OUR DEVELOPERS (3D COVERFLOW INFINITE CAROUSEL) */}
        <DevelopersSection />

        {/* 4. STUDENT COORDINATORS (INTERACTIVE CAROUSEL) */}
        <div id="students" className="cred-group">
          <h3 className="cred-group-title cred-group-title--pink">
            STUDENT COORDINATORS
          </h3>
          <p className="cred-group-desc">
            Meet our talented team of student coordinators who work behind the scenes to make our events successful
          </p>

          <StudentInfiniteCarousel items={studentCoordinatorsData} />
        </div>

        {/* 4. OUR EDITING EXPERTS */}
        <div id="editors" className="cred-group">
          <h3 className="cred-group-title cred-group-title--cyan">
            <span className="cred-group-title__slash">OUR EDITING EXPERTS</span>
          </h3>

          <div className="crew-grid crew-grid--3">
            {editorsData.map((editor, idx) => (
              <EditorExpertCard
                key={editor.id}
                member={editor}
                index={idx + 1}
              />
            ))}
          </div>
        </div>

        {/* 5. POSTER DESIGNERS */}
        <div id="designers" className="cred-group">
          <h3 className="cred-group-title cred-group-title--violet">
            <span className="cred-group-title__slash">POSTER DESIGNERS</span>
          </h3>

          <div className="crew-grid crew-grid--5">
            {designersData.map((designer, idx) => (
              <DesignerTeamCard
                key={designer.id}
                member={designer}
                index={idx + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
