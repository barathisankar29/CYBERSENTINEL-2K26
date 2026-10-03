import { memo, type ReactNode } from 'react'
import './StageAnimation.css'

/**
 * A tiny looping pixel-art "GIF" for each timeline stage, drawn as an inline
 * 16x16 SVG and animated with CSS transform/opacity only (compositor-friendly,
 * no image download). Only the current stop's card is ever on screen, so at
 * most one of these runs at a time. Memoized on the stage id because the
 * journey re-renders its parent up to 60x/second.
 */

const CYAN = '#22d3ee'
const PINK = '#e04bd6'
const GOLD = '#ffd166'
const WHITE = '#f8fafc'
const STEEL = '#94a3b8'
const SLATE = '#64748b'
const DARK = '#334155'
const FLAME = '#fb923c'
const PALE = '#fde68a'
// Same as the tile background (see .stage-anim) — used to "cut" shapes.
const BG = '#070a18'

/** One pixel-art rectangle in the 16x16 grid. */
function P({ x, y, w = 1, h = 1, c, className }: { x: number; y: number; w?: number; h?: number; c: string; className?: string }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} className={className} />
}

const ART: Record<string, ReactNode> = {
  // ID card under a scanner beam.
  registration: (
    <>
      <P x={7} y={1} w={2} h={3} c={PINK} />
      <P x={2} y={4} w={12} h={9} c="#0f172a" />
      <P x={2} y={4} w={12} c={CYAN} />
      <P x={2} y={12} w={12} c={CYAN} />
      <P x={2} y={4} h={9} c={CYAN} />
      <P x={13} y={4} h={9} c={CYAN} />
      <P x={4} y={6} w={2} h={2} c={WHITE} />
      <P x={3} y={8} w={4} h={3} c={SLATE} />
      <P x={8} y={6} w={4} c={SLATE} />
      <P x={8} y={8} w={3} c={SLATE} />
      <P x={8} y={10} w={4} c={SLATE} />
      <P x={1} y={4} w={14} c="#4ade80" className="sa-scan" />
    </>
  ),

  // Traditional lamp being lit.
  inauguration: (
    <>
      <circle cx={8} cy={4} r={5} fill={FLAME} className="sa-glow" />
      <g className="sa-flame">
        <P x={4} y={4} h={2} c={FLAME} />
        <P x={4} y={3} c={PALE} />
      </g>
      <g className="sa-flame sa-d2">
        <P x={7} y={3} w={2} h={3} c={FLAME} />
        <P x={7} y={2} w={2} c={PALE} />
      </g>
      <g className="sa-flame sa-d3">
        <P x={11} y={4} h={2} c={FLAME} />
        <P x={11} y={3} c={PALE} />
      </g>
      <P x={3} y={6} w={10} c={GOLD} />
      <P x={5} y={7} w={6} c={GOLD} />
      <P x={7} y={8} w={2} h={5} c={GOLD} />
      <P x={6} y={13} w={4} c={GOLD} />
      <P x={4} y={14} w={8} c={GOLD} />
    </>
  ),

  // Microphone with sound waves.
  welcome: (
    <>
      <P x={6} y={2} w={4} h={5} c={STEEL} />
      <P x={6} y={3} w={4} c={DARK} />
      <P x={6} y={5} w={4} c={DARK} />
      <P x={5} y={6} h={2} c={SLATE} />
      <P x={10} y={6} h={2} c={SLATE} />
      <P x={5} y={8} w={6} c={SLATE} />
      <P x={7} y={9} w={2} h={4} c={SLATE} />
      <P x={5} y={13} w={6} c={SLATE} />
      <P x={3} y={3} h={3} c={CYAN} className="sa-wave" />
      <P x={12} y={3} h={3} c={CYAN} className="sa-wave" />
      <P x={1} y={2} h={5} c={PINK} className="sa-wave sa-d2" />
      <P x={14} y={2} h={5} c={PINK} className="sa-wave sa-d2" />
    </>
  ),

  // Terminal typing code.
  'technical-programme': (
    <>
      <P x={1} y={2} w={14} h={10} c={DARK} />
      <P x={2} y={3} w={12} h={8} c="#020617" />
      <P x={7} y={12} w={2} h={2} c={DARK} />
      <P x={5} y={14} w={6} c={DARK} />
      <P x={3} y={4} w={5} c={CYAN} className="sa-type" />
      <P x={4} y={6} w={6} c={PINK} className="sa-type sa-type-2" />
      <P x={3} y={8} w={4} c={CYAN} className="sa-type sa-type-3" />
      <P x={8} y={8} c={WHITE} className="sa-blink" />
    </>
  ),

  // Crescent moon and twinkling stars.
  'day1-closing': (
    <>
      <g className="sa-bob">
        <P x={5} y={3} w={4} c={PALE} />
        <P x={4} y={4} w={6} c={PALE} />
        <P x={3} y={5} w={8} h={4} c={PALE} />
        <P x={4} y={9} w={6} c={PALE} />
        <P x={5} y={10} w={4} c={PALE} />
        <P x={8} y={3} w={4} c={BG} />
        <P x={7} y={4} w={6} c={BG} />
        <P x={6} y={5} w={8} h={4} c={BG} />
        <P x={7} y={9} w={6} c={BG} />
        <P x={8} y={10} w={4} c={BG} />
      </g>
      <P x={12} y={2} c={WHITE} className="sa-twinkle" />
      <P x={11} y={7} c={CYAN} className="sa-twinkle sa-d2" />
      <P x={13} y={11} c={WHITE} className="sa-twinkle sa-d3" />
      <P x={2} y={13} c={PINK} className="sa-twinkle sa-d2" />
    </>
  ),

  // Sunrise over the horizon.
  'day2-opening': (
    <>
      <g className="sa-pulse">
        <P x={7} y={1} w={2} h={2} c={GOLD} />
        <P x={3} y={4} c={GOLD} />
        <P x={12} y={4} c={GOLD} />
        <P x={0} y={8} w={2} c={GOLD} />
        <P x={14} y={8} w={2} c={GOLD} />
      </g>
      <g className="sa-rise">
        <P x={6} y={5} w={4} c={GOLD} />
        <P x={5} y={6} w={6} c={GOLD} />
        <P x={4} y={7} w={8} h={5} c={GOLD} />
        <P x={6} y={7} w={2} c={PALE} />
      </g>
      <P x={0} y={11} w={16} c={PINK} />
      <P x={0} y={12} w={16} h={4} c="#1e1b4b" />
    </>
  ),

  // Robot grooving to music.
  'techno-cultural': (
    <>
      <g className="sa-nod">
        <P x={8} y={1} h={2} c={SLATE} />
        <P x={7} y={0} w={3} c={PINK} />
        <P x={4} y={3} w={8} h={6} c={STEEL} />
        <P x={6} y={5} h={2} c={CYAN} className="sa-blink-slow" />
        <P x={9} y={5} h={2} c={CYAN} className="sa-blink-slow" />
        <P x={6} y={7} w={4} c={DARK} />
      </g>
      <P x={5} y={10} w={6} h={4} c={SLATE} />
      <P x={7} y={11} w={2} c={PINK} className="sa-blink" />
      <P x={5} y={14} w={2} h={2} c={DARK} />
      <P x={9} y={14} w={2} h={2} c={DARK} />
      <g className="sa-note">
        <P x={13} y={2} h={5} c={CYAN} />
        <P x={14} y={2} c={CYAN} />
        <P x={12} y={6} w={2} h={2} c={CYAN} />
      </g>
      <g className="sa-note sa-d2">
        <P x={2} y={5} h={5} c={PINK} />
        <P x={3} y={5} c={PINK} />
        <P x={1} y={9} w={2} h={2} c={PINK} />
      </g>
    </>
  ),

  // Sweeping spotlight on a star performer.
  'special-programme': (
    <>
      <polygon points="3,3 5,2 13,14 5,14" fill={WHITE} className="sa-sweep" />
      <P x={1} y={1} w={3} h={2} c={SLATE} />
      <g className="sa-pop">
        <P x={7} y={7} w={2} h={2} c={GOLD} />
        <P x={5} y={9} w={6} h={2} c={GOLD} />
        <P x={6} y={11} w={4} c={GOLD} />
        <P x={5} y={12} w={2} c={GOLD} />
        <P x={9} y={12} w={2} c={GOLD} />
      </g>
      <P x={0} y={14} w={16} h={2} c={PINK} />
    </>
  ),

  // Graduation cap tossed in the air, with confetti.
  valedictory: (
    <>
      <g className="sa-toss">
        <P x={3} y={5} w={10} c={WHITE} />
        <P x={4} y={6} w={8} c="#cbd5e1" />
        <P x={5} y={7} w={6} h={3} c={STEEL} />
        <P x={12} y={6} h={4} c={GOLD} />
        <P x={11} y={10} w={2} c={GOLD} />
      </g>
      <P x={1} y={2} c={PINK} className="sa-twinkle" />
      <P x={14} y={1} c={CYAN} className="sa-twinkle sa-d2" />
      <P x={2} y={12} c={GOLD} className="sa-twinkle sa-d3" />
      <P x={13} y={13} c={PINK} className="sa-twinkle" />
      <P x={7} y={14} c={CYAN} className="sa-twinkle sa-d2" />
    </>
  ),

  // Gleaming trophy.
  'prize-distribution': (
    <>
      <g className="sa-bob">
        <P x={4} y={2} w={8} h={5} c={GOLD} />
        <P x={5} y={7} w={6} c={GOLD} />
        <P x={6} y={8} w={4} c={GOLD} />
        <P x={7} y={9} w={2} h={2} c={GOLD} />
        <P x={5} y={11} w={6} c={GOLD} />
        <P x={2} y={3} w={2} c={GOLD} />
        <P x={2} y={4} h={2} c={GOLD} />
        <P x={3} y={6} c={GOLD} />
        <P x={12} y={3} w={2} c={GOLD} />
        <P x={13} y={4} h={2} c={GOLD} />
        <P x={12} y={6} c={GOLD} />
        <P x={6} y={3} h={3} c="#fff7d6" className="sa-blink-slow" />
      </g>
      <P x={4} y={12} w={8} h={2} c="#a16207" />
      <P x={1} y={0} c={WHITE} className="sa-twinkle" />
      <P x={14} y={8} c={WHITE} className="sa-twinkle sa-d2" />
      <P x={1} y={10} c={PALE} className="sa-twinkle sa-d3" />
      <P x={14} y={1} c={PALE} className="sa-twinkle sa-d3" />
    </>
  ),

  // Spinning deck and a bouncing equalizer.
  'dj-play': (
    <>
      <P x={1} y={2} w={2} h={5} c={CYAN} className="sa-eq" />
      <P x={4} y={2} w={2} h={5} c={PINK} className="sa-eq sa-eq-2" />
      <P x={7} y={2} w={2} h={5} c={CYAN} className="sa-eq sa-eq-3" />
      <P x={10} y={2} w={2} h={5} c={PINK} className="sa-eq sa-eq-4" />
      <P x={13} y={2} w={2} h={5} c={CYAN} className="sa-eq sa-eq-2" />
      <P x={0} y={8} w={16} h={8} c={DARK} />
      <P x={0} y={8} w={16} c={PINK} />
      <g className="sa-spin">
        <circle cx={5} cy={12} r={3} fill="#020617" />
        <circle cx={5} cy={12} r={1} fill={PINK} />
        <P x={4} y={9} w={2} c={STEEL} />
      </g>
      <P x={10} y={9} h={4} c={STEEL} />
      <P x={9} y={12} c={STEEL} />
      <P x={12} y={10} w={2} c={CYAN} className="sa-blink" />
      <P x={12} y={13} w={2} c={GOLD} className="sa-blink-slow" />
    </>
  ),
}

function StageAnimationImpl({ stageId }: { stageId: string }) {
  const art = ART[stageId]
  if (!art) return null
  return (
    <div className="stage-anim" aria-hidden="true">
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges">
        {art}
      </svg>
    </div>
  )
}

export const StageAnimation = memo(StageAnimationImpl)
