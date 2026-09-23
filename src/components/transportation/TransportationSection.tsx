import { transitRoutesData } from '@/data/transportation'
import { TransitBusCard } from './TransitBusCard'
import { TacticalMapHud } from './TacticalMapHud'
import './TransportationSection.css'

export function TransportationSection() {
  return (
    <section id="transportation" className="transportation-section" aria-label="Transportation & Campus Transit">
      {/* Background Graphic: User's Cyberpunk Vel Tech Gate Image */}
      <div className="transportation-section__bg-wrap" aria-hidden="true">
        <div className="transportation-section__bg-image" />
        <div className="transportation-section__scanlines" />
      </div>

      {/* Atmospheric Neon Bleed Glows */}
      <div className="transportation-section__glow transportation-section__glow--cyan" aria-hidden="true" />
      <div className="transportation-section__glow transportation-section__glow--magenta" aria-hidden="true" />
      <div className="transportation-section__glow transportation-section__glow--violet" aria-hidden="true" />

      {/* Horizon Laser Seam */}
      <div className="transportation-section__horizon-line" aria-hidden="true" />

      <div className="transportation-section__container">
        {/* Section Main Header */}
        <header className="transport-header">
          <h2 className="transport-header__title">
            <span className="transport-header__title-gradient">CAMPUS TRANSIT &</span>{' '}
            <span className="transport-header__title-neon">NAVIGATION</span>
          </h2>

          <p className="transport-header__subtitle">
            Synchronized college shuttles, metropolitan MTC express transit corridors, and tactical satellite GPS navigation for CyberSentinel 2K26.
          </p>

          <div className="transport-header__divider">
            <span className="transport-header__divider-line" />
            <span className="transport-header__divider-gem" />
            <span className="transport-header__divider-line" />
          </div>
        </header>

        {/* 1. BUS INFORMATION SECTION */}
        <div className="transport-bus-area" id="bus">
          <div className="transport-subhead">
            <div className="transport-subhead__tag">
              <span className="transport-subhead__icon">🚌</span>
              <span>METROPOLITAN & CAMPUS FLEET</span>
            </div>
            <h3 className="transport-subhead__title">BUS INFORMATION</h3>
            <p className="transport-subhead__desc">
              Select your transit corridor below for route itineraries, drop-off terminals, and boarding advisories.
            </p>
          </div>

          {/* Bus Cards Grid */}
          <div className="transport-cards-grid">
            {transitRoutesData.map((route, idx) => (
              <TransitBusCard
                key={route.id}
                route={route}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* 2. TACTICAL MAP SECTION */}
        <div className="transport-map-area" id="map-section">
          <div className="transport-subhead transport-subhead--map">
            <div className="transport-subhead__tag transport-subhead__tag--cyan">
              <span className="transport-subhead__icon">📍</span>
              <span>GEO-SPATIAL RADAR TERMINAL</span>
            </div>
            <h3 className="transport-subhead__title">FIND US</h3>
            <p className="transport-subhead__desc">
              Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College,<br />
              Vel Tech Road, Avadi, Chennai, Tamil Nadu, India
            </p>
          </div>

          {/* Tactical Map HUD */}
          <TacticalMapHud />
        </div>
      </div>
    </section>
  )
}
