import type { TransitRoute } from '@/data/transportation'
import './TransitBusCard.css'

interface TransitBusCardProps {
  route: TransitRoute
  index: number
}

export function TransitBusCard({ route, index }: TransitBusCardProps) {
  const nodeIndex = `0${index + 1}`

  return (
    <div className="cyber-trading-card-wrapper">
      <div className={`cyber-trading-card cyber-trading-card--${route.accentColor}`}>
        {/* Background Cyber Circuit Grid Accent */}
        <div className="cyber-card-bg-grid" aria-hidden="true" />

        {/* TOP HUD BAR */}
        <div className="cyber-card-top-bar">
          {/* Top-Left: Node / Cost Indicator Box */}
          <div className="cyber-cost-pod">
            <span className="cyber-cost-label">// NODE</span>
            <span className="cyber-cost-value">{route.cardCost || nodeIndex}</span>
          </div>

          {/* Top-Center: Angular Role Badge (FIGHTER equivalent) */}
          <div className="cyber-role-badge">
            <span className="cyber-role-bracket">[</span>
            <span className="cyber-role-text">{route.role || route.serviceType}</span>
            <span className="cyber-role-bracket">]</span>
          </div>

          {/* Top-Right: Operational Status Badge */}
          <div className="cyber-status-pod">
            <span className="cyber-status-pulse" />
            <span className="cyber-status-text">{route.badgeText}</span>
          </div>
        </div>

        {/* CHARACTER / VEHICLE ART VIEWPORT FRAME */}
        <div className="cyber-art-viewport">
          {/* Corner Cyber Reticles */}
          <span className="cyber-art-reticle cyber-art-reticle--tl" aria-hidden="true" />
          <span className="cyber-art-reticle cyber-art-reticle--tr" aria-hidden="true" />
          <span className="cyber-art-reticle cyber-art-reticle--bl" aria-hidden="true" />
          <span className="cyber-art-reticle cyber-art-reticle--br" aria-hidden="true" />

          {/* Holographic Scanline Overlay */}
          <div className="cyber-art-scanlines" aria-hidden="true" />

          {/* Futuristic Concept Mecha Bus Image */}
          <img
            src={route.image}
            alt={route.title}
            className="cyber-art-image"
            loading="lazy"
          />

          {/* Bottom Edge Light Bar */}
          <div className="cyber-art-lightbar" aria-hidden="true" />
        </div>

        {/* CARD TITLE (SAMURAI equivalent) */}
        <div className="cyber-title-block">
          <h3 className="cyber-card-name">{route.title}</h3>
          <span className="cyber-route-code">{route.routeNumber}</span>
        </div>

        {/* TRANSIT DIRECTIVE (EFFECTS equivalent from Image 3) */}
        <div className="cyber-directive-section">
          <div className="cyber-directive-label">
            <span className="cyber-directive-dash" />
            <span>TRANSIT DIRECTIVE</span>
            <span className="cyber-directive-dash" />
          </div>

          <div className="cyber-directive-panel">
            {/* Waypoint Path Flow */}
            <div className="cyber-waypoint-flow">
              <span className="cyber-wp cyber-wp--origin" title={route.origin}>
                {route.origin.split('/')[0].trim()}
              </span>
              <span className="cyber-wp-arrow">➜</span>
              <span className="cyber-wp cyber-wp--dest" title={route.destinationHighlight}>
                {route.destinationHighlight}
              </span>
            </div>

            <p className="cyber-directive-text">{route.instructions}</p>

            <div className="cyber-directive-footer">
              <span className="cyber-directive-sub">
                SCHEDULE: <strong className="cyber-white">{route.operatingHours}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM STAT PODS (ATK 5 / DEF 3 style from Image 3) */}
        <div className="cyber-card-footer">
          {/* Left Stat Pod (Frequency / Speed) */}
          <div className="cyber-stat-box cyber-stat-box--left">
            <span className="cyber-stat-label">{route.statLeft.label}</span>
            <span className="cyber-stat-number">{route.statLeft.value}</span>
          </div>

          {/* Center Mecha Tech Crest Emblem */}
          <div className="cyber-card-crest">
            <div className="cyber-crest-hexagon">
              <span className="cyber-crest-icon">⚡</span>
            </div>
          </div>

          {/* Right Stat Pod (Pass / Access / Drop) */}
          <div className="cyber-stat-box cyber-stat-box--right">
            <span className="cyber-stat-label">{route.statRight.label}</span>
            <span className="cyber-stat-number">{route.statRight.value}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
