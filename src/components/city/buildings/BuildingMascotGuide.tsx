import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MASCOT_SPRITES, type MascotExpression } from '@/data/mascot'
import './BuildingMascotGuide.css'

interface LandmarkGuide {
  id: string
  label: string
  pose: MascotExpression
  accentColor: string
  coords: { x: number; y: number }
  speech: string
  bubblePosition: 'left' | 'right'
}

const LANDMARK_GUIDES: LandmarkGuide[] = [
  {
    id: 'events',
    label: 'EVENTS ARENA',
    pose: 'happy',
    accentColor: '#ff007f',
    coords: { x: 50, y: 11 },
    speech: '⚡ CLICK EVENTS SPIRE FOR HACKATHONS & ESPORTS!',
    bubblePosition: 'right',
  },
  {
    id: 'timeline',
    label: 'CHRONO SKYRAIL',
    pose: 'fly',
    accentColor: '#00f0ff',
    coords: { x: 80, y: 22 },
    speech: '⏳ CLICK SKYRAIL FOR SCHEDULE & ROUND TIMINGS!',
    bubblePosition: 'left',
  },
  {
    id: 'transport',
    label: 'TRANSIT GATEWAY',
    pose: 'cheer',
    accentColor: '#38bdf8',
    coords: { x: 93, y: 9 },
    speech: '🚀 CLICK TRANSPORT FOR BUS ROUTES & SCHEDULES!',
    bubblePosition: 'left',
  },
  {
    id: 'credentials',
    label: 'SYNDICATE TERMINAL',
    pose: 'wave',
    accentColor: '#00f0ff',
    coords: { x: 8, y: 16 },
    speech: '🕶️ CLICK CREDENTIALS TO MEET OUR CORE TEAM!',
    bubblePosition: 'right',
  },
  {
    id: 'contact',
    label: 'COMMS RELAY',
    pose: 'curious',
    accentColor: '#f43f5e',
    coords: { x: 19, y: 10 },
    speech: '📡 CLICK CONTACT TO REACH FACULTY & LEADS!',
    bubblePosition: 'right',
  },
  {
    id: 'about',
    label: 'INNOVATION CITADEL',
    pose: 'float',
    accentColor: '#a855f7',
    coords: { x: 33, y: 13 },
    speech: '🏛️ CLICK ABOUT VTHT FOR INSTITUTION ARCHIVE!',
    bubblePosition: 'right',
  },
]

export const BuildingMascotGuide: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentGuide = LANDMARK_GUIDES[currentIndex]
  const sprite = MASCOT_SPRITES[currentGuide.pose] || MASCOT_SPRITES.float
  const isBubbleLeft = currentGuide.bubblePosition === 'left'

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % LANDMARK_GUIDES.length)
  }, [])

  // Auto-tour timer: smoothly flies to next landmark every 3.0s as requested
  useEffect(() => {
    timerRef.current = setInterval(() => {
      goToNext()
    }, 3000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [goToNext])

  return (
    <div
      className={`building-mascot-guide ${isBubbleLeft ? 'building-mascot-guide--bubble-left' : 'building-mascot-guide--bubble-right'}`}
      style={{
        left: `${currentGuide.coords.x}%`,
        top: `${currentGuide.coords.y}%`,
        '--landmark-accent': currentGuide.accentColor,
      } as React.CSSProperties}
      role="region"
      aria-label="Interactive Skyline Mascot Companion"
    >
      {/* If bubble is on the left, card comes first in DOM so it sits left of the mascot */}
      {isBubbleLeft && (
        <div className="building-mascot-guide__bubble">
          <div className="building-mascot-guide__bubble-beak" aria-hidden="true" />
          <p className="building-mascot-guide__speech">{currentGuide.speech}</p>
        </div>
      )}

      {/* Floating Cyber Ghost Mascot Actor */}
      <div
        className="building-mascot-guide__actor"
        onClick={goToNext}
        title="Click mascot to fly to next landmark"
      >
        <div className="building-mascot-guide__beacon" aria-hidden="true" />
        <div className="building-mascot-guide__glow" aria-hidden="true" />
        <img
          src={sprite.src}
          alt={`CyberSentinel Mascot - ${sprite.label}`}
          className="building-mascot-guide__img"
          draggable={false}
        />
        <div className="building-mascot-guide__badge" aria-hidden="true">
          GUIDE
        </div>
      </div>

      {/* If bubble is on the right, card comes after the mascot */}
      {!isBubbleLeft && (
        <div className="building-mascot-guide__bubble">
          <div className="building-mascot-guide__bubble-beak" aria-hidden="true" />
          <p className="building-mascot-guide__speech">{currentGuide.speech}</p>
        </div>
      )}
    </div>
  )
}
