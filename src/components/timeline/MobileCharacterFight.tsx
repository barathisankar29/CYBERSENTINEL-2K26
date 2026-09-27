import type { CSSProperties } from 'react'
import './MobileCharacterFight.css'

type PoseName = 'idle' | 'action' | 'attack' | 'recoil'

interface Pose {
  /** Intrinsic PNG size in image pixels. */
  w: number
  h: number
  /** Where the feet are, as a fraction of the image (x from left, y from top). */
  fx: number
  fy: number
}

interface Fighter {
  id: 'nico' | 'ruelle'
  label: string
  poses: Record<PoseName, Pose>
}

// Measured from the extracted PNGs (public/assets/timeline/characters/*):
// each character's poses share one scale, and the foot anchor lets poses
// crossfade in place without the body jumping.
//   NICO:   idle / action = spin slash / attack = gun fire / recoil = crouch
//   RUELLE: idle / action = orb charge / attack = crystal burst / recoil = swirl crouch
const NICO: Fighter = {
  id: 'nico',
  label: 'NICO',
  poses: {
    idle: { w: 201, h: 356, fx: 0.441, fy: 0.961 },
    action: { w: 311, h: 334, fx: 0.433, fy: 0.964 },
    attack: { w: 332, h: 351, fx: 0.391, fy: 0.969 },
    recoil: { w: 230, h: 288, fx: 0.49, fy: 0.955 },
  },
}

const RUELLE: Fighter = {
  id: 'ruelle',
  label: 'RUELLE',
  poses: {
    idle: { w: 330, h: 360, fx: 0.476, fy: 0.956 },
    action: { w: 377, h: 319, fx: 0.497, fy: 0.928 },
    attack: { w: 575, h: 339, fx: 0.573, fy: 0.947 },
    recoil: { w: 418, h: 375, fx: 0.666, fy: 0.933 },
  },
}

const POSE_NAMES: PoseName[] = ['idle', 'action', 'attack', 'recoil']
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

function FighterSprite({ fighter }: { fighter: Fighter }) {
  return (
    <div className={`mcf-fighter mcf-fighter--${fighter.id}`}>
      {/* Translation only (lunge / knockback) — carries the shadow along. */}
      <div className="mcf-move">
        <span className="mcf-shadow" />
        <span className="mcf-aura" />
        {/* Tilt + squash/stretch, pivoting at the feet. */}
        <div className="mcf-body">
          <div className="mcf-breathe">
            {POSE_NAMES.map((pose) => {
              const { w, h, fx, fy } = fighter.poses[pose]
              return (
                <img
                  key={pose}
                  src={`/assets/timeline/characters/${fighter.id}/${pose}.png`}
                  alt=""
                  width={w}
                  height={h}
                  draggable={false}
                  decoding="async"
                  fetchPriority="low"
                  className={`mcf-pose mcf-pose--${pose}`}
                  style={{ '--w': w, '--h': h, '--fx': fx, '--fy': fy } as CSSProperties}
                />
              )
            })}
          </div>
        </div>
      </div>
      <span className="mcf-name">{fighter.label}</span>
    </div>
  )
}

/**
 * NICO vs RUELLE on a small ledge below the mobile Timeline's track. Lives
 * inside the Timeline stage (the city artwork is its background), mobile
 * only, purely decorative.
 *
 * A tiny 2D fight rather than sliding images: each fighter is layered as
 * move (translate) > body (tilt / squash-stretch around the feet) > breathe
 * (idle bob) > four extracted poses that crossfade into each other, all on
 * one shared CSS keyframe loop — idle, anticipation, attack, energy clash,
 * recoil, recovery. transform/opacity only; no React state, no JS loop;
 * `pointer-events: none` so the journey's scroll/swipe input is untouched.
 * Reduced motion shows a static "NICO ⚡ VS ⚡ RUELLE" standoff.
 */
export function MobileCharacterFight() {
  return (
    <div className="mobile-character-fight" aria-hidden="true">
      <div className="mcf-stage">
        <div className="mcf-platform">
          <span className="mcf-platform__reflection" />
          <span className="mcf-platform__deck" />
          <span className="mcf-platform__edge" />
          <span className="mcf-mote mcf-mote--1" />
          <span className="mcf-mote mcf-mote--2" />
          <span className="mcf-mote mcf-mote--3" />
          <span className="mcf-mote mcf-mote--4" />
        </div>

        <FighterSprite fighter={NICO} />
        <FighterSprite fighter={RUELLE} />

        <span className="mcf-beam mcf-beam--nico" />
        <span className="mcf-beam mcf-beam--ruelle" />

        <div className="mcf-clash">
          <span className="mcf-clash__flash" />
          <span className="mcf-clash__ring" />
          {PARTICLE_ANGLES.map((angle, i) => (
            <span
              key={angle}
              className={`mcf-clash__particle ${i % 2 ? 'mcf-clash__particle--purple' : ''}`}
              style={{ '--a': `${angle}deg` } as CSSProperties}
            />
          ))}
        </div>

        <span className="mcf-versus">
          <span className="mcf-versus__bolt">⚡</span>
          VS
          <span className="mcf-versus__bolt">⚡</span>
        </span>
      </div>
    </div>
  )
}
