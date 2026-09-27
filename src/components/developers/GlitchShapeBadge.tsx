import type React from 'react'
import './GlitchShapeBadge.css'

interface GlitchShapeBadgeProps {
  shape: 'diamond-magenta' | 'triangle-yellow' | 'triangle-cyan' | 'diamond-purple' | 'hexagon-green' | 'shard-crimson'
  className?: string
  size?: number
}

export const GlitchShapeBadge: React.FC<GlitchShapeBadgeProps> = ({
  shape,
  className = '',
  size = 72,
}) => {
  return (
    <div
      className={`glitch-badge glitch-badge--${shape} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {shape === 'diamond-magenta' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="glitch-svg">
          <defs>
            <linearGradient id="gm1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3ea5" />
              <stop offset="60%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="glow-magenta" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ff3ea5" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Outer Glitch Diamond Wireframe */}
          <polygon points="50,6 94,50 50,94 6,50" stroke="#ff3ea5" strokeWidth="2.5" fill="none" filter="url(#glow-magenta)" />
          {/* Inner Filled Diamond */}
          <polygon points="50,15 85,50 50,85 15,50" fill="url(#gm1)" opacity="0.85" />
          {/* Glitch Horizontal Slices */}
          <rect x="0" y="32" width="45" height="3.5" fill="#facc15" />
          <rect x="58" y="24" width="40" height="3" fill="#22d3ee" />
          <rect x="8" y="58" width="55" height="4" fill="#ffffff" opacity="0.9" />
          <rect x="52" y="66" width="46" height="3.5" fill="#ff3ea5" />
          <rect x="20" y="44" width="22" height="3" fill="#22d3ee" />
          {/* Secondary Shard Accents */}
          <polygon points="22,12 36,4 42,16" stroke="#22d3ee" strokeWidth="1.5" fill="none" />
          <polygon points="80,78 96,84 88,96" stroke="#facc15" strokeWidth="1.5" fill="none" />
        </svg>
      )}

      {shape === 'triangle-yellow' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="glitch-svg">
          <defs>
            <linearGradient id="gy1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <filter id="glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#facc15" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Outer Triangle Shards */}
          <polygon points="50,8 94,88 6,88" stroke="#facc15" strokeWidth="2.5" fill="none" filter="url(#glow-yellow)" />
          {/* Secondary Offset Wireframe */}
          <polygon points="46,16 88,92 14,84" stroke="#c084fc" strokeWidth="1.8" fill="none" opacity="0.75" />
          {/* Inner Filled Body */}
          <polygon points="50,22 83,82 17,82" fill="url(#gy1)" opacity="0.9" />
          {/* Glitch Slices */}
          <rect x="2" y="46" width="38" height="4" fill="#a855f7" />
          <rect x="48" y="38" width="50" height="3.5" fill="#fef08a" />
          <rect x="8" y="68" width="84" height="4" fill="#18181b" />
          <rect x="18" y="70" width="48" height="2.5" fill="#ffffff" />
          <rect x="65" y="76" width="32" height="3.5" fill="#facc15" />
        </svg>
      )}

      {shape === 'triangle-cyan' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="glitch-svg">
          <defs>
            <linearGradient id="gc1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Dynamic Inverted Triangle */}
          <polygon points="8,16 92,16 50,92" stroke="#22d3ee" strokeWidth="2.5" fill="none" filter="url(#glow-cyan)" />
          <polygon points="14,10 98,22 56,96" stroke="#38bdf8" strokeWidth="1.6" fill="none" opacity="0.6" />
          <polygon points="18,24 82,24 50,84" fill="url(#gc1)" opacity="0.9" />
          {/* Glitch Slices */}
          <rect x="0" y="30" width="46" height="4" fill="#3b82f6" />
          <rect x="52" y="34" width="48" height="3.5" fill="#ffffff" />
          <rect x="22" y="52" width="60" height="4" fill="#0891b2" />
          <rect x="4" y="64" width="36" height="3" fill="#22d3ee" />
          <rect x="44" y="72" width="40" height="3" fill="#67e8f9" />
        </svg>
      )}

      {shape === 'diamond-purple' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="glitch-svg">
          <defs>
            <linearGradient id="gp1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#c084fc" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Layered Diamond Shard */}
          <polygon points="50,8 92,50 50,92 8,50" stroke="#c084fc" strokeWidth="2.5" fill="none" filter="url(#glow-purple)" />
          <polygon points="46,4 96,48 54,96 4,52" stroke="#ec4899" strokeWidth="1.5" fill="none" opacity="0.7" />
          <polygon points="50,18 82,50 50,82 18,50" fill="url(#gp1)" opacity="0.9" />
          {/* Glitch Cuts */}
          <rect x="2" y="28" width="44" height="3" fill="#f43f5e" />
          <rect x="56" y="36" width="42" height="4" fill="#ffffff" />
          <rect x="12" y="54" width="76" height="4.5" fill="#4c1d95" />
          <rect x="4" y="68" width="50" height="3.5" fill="#e879f9" />
          <rect x="60" y="76" width="34" height="3" fill="#c084fc" />
        </svg>
      )}

      {shape === 'hexagon-green' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="glitch-svg">
          <defs>
            <linearGradient id="gg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Cyber Hexagon */}
          <polygon points="26,10 74,10 94,50 74,90 26,90 6,50" stroke="#10b981" strokeWidth="2.5" fill="none" filter="url(#glow-green)" />
          <polygon points="30,16 70,16 86,50 70,84 30,84 14,50" fill="url(#gg1)" opacity="0.88" />
          {/* Glitch Slices */}
          <rect x="0" y="28" width="48" height="3.5" fill="#06b6d4" />
          <rect x="54" y="38" width="44" height="4" fill="#ffffff" />
          <rect x="10" y="56" width="60" height="3" fill="#064e3b" />
          <rect x="35" y="70" width="55" height="4" fill="#34d399" />
        </svg>
      )}

      {shape === 'shard-crimson' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="glitch-svg">
          <defs>
            <linearGradient id="gr1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Cyber Shard / Shield */}
          <polygon points="50,6 94,28 80,88 50,96 20,88 6,28" stroke="#ef4444" strokeWidth="2.5" fill="none" filter="url(#glow-red)" />
          <polygon points="50,14 84,34 72,82 50,88 28,82 16,34" fill="url(#gr1)" opacity="0.9" />
          {/* Glitch Slices */}
          <rect x="0" y="24" width="42" height="3" fill="#f97316" />
          <rect x="52" y="42" width="48" height="4" fill="#ffffff" />
          <rect x="8" y="58" width="64" height="3.5" fill="#450a0a" />
          <rect x="42" y="74" width="50" height="3.5" fill="#f87171" />
        </svg>
      )}
    </div>
  )
}
