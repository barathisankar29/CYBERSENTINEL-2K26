import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type PointerEvent,
  type CSSProperties,
} from 'react'
import { useMascot } from './MascotContext'
import {
  DEFAULT_PHYSICS_CONFIG,
  getSafeScreenBounds,
} from './MascotPhysics'
import { useReducedMotion } from '@/animation/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { MascotSpeechBubble } from './MascotSpeechBubble'
import type { MascotState } from '@/types/mascot'
import { MASCOT_DIALOGUE } from './mascotDialogue'
import './Mascot.css'

const TEST_CYCLE_STATES: MascotState[] = [
  'idle',
  'blink',
  'wave',
  'happy',
  'point',
  'guide',
  'thinking',
  'celebrate',
  'error',
  'sleep',
]

export function Mascot() {
  const {
    state,
    setMascotState,
    saySequence,
    position,
    setPosition,
    resetPosition,
    currentSpeech,
    dismissSpeech,
    isDragging,
    isFalling,
    isSleeping,
    isRelocating,
    wakeUp,
    isTourActive,
    startTour,
    skipTour,
    facing,
    bubblePlacement,
    enabled,
  } = useMascot()

  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()

  // Physics animation reference
  const physicsLoopRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const isPointerDownRef = useRef(false)
  const hasMovedRef = useRef(false)
  const dragStartRef = useRef<{ clientX: number; clientY: number; time: number } | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const recentVelocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 })
  const prevPosRef = useRef<{ x: number; y: number; time: number }>({ x: position.x, y: position.y, time: performance.now() })

  // Quick menu toggle
  const [menuOpen, setMenuOpen] = useState(false)

  // Keep internal ref in sync
  useEffect(() => {
    isDraggingRef.current = isDragging
  }, [isDragging])

  // Clean up physics loop
  const stopPhysics = useCallback(() => {
    if (physicsLoopRef.current !== null) {
      cancelAnimationFrame(physicsLoopRef.current)
      physicsLoopRef.current = null
    }
  }, [])

  // Random blinking loop during idle (CHECK 5)
  useEffect(() => {
    if (state !== 'idle' || isDragging || isFalling || isSleeping || isTourActive) {
      return
    }

    const randomDelay = Math.floor(Math.random() * 2500) + 3200 // 3.2s to 5.7s
    const blinkTimeout = window.setTimeout(() => {
      if (state === 'idle' && !isDraggingRef.current && !isPointerDownRef.current) {
        setMascotState('blink', 280, undefined, 'idle')
      }
    }, randomDelay)

    return () => window.clearTimeout(blinkTimeout)
  }, [state, isDragging, isFalling, isSleeping, isTourActive, setMascotState])

  // Friendly tap/click on companion without dragging (Part 16)
  const handleMascotClick = useCallback(() => {
    wakeUp()
    const petDialogue = MASCOT_DIALOGUE.pet.click
    if (petDialogue.followUpText) {
      saySequence([
        { text: petDialogue.text, duration: 2500, state: petDialogue.state },
        { text: petDialogue.followUpText, duration: 3000, state: petDialogue.state },
      ], petDialogue.priority)
    } else {
      setMascotState(petDialogue.state, petDialogue.duration, petDialogue.text, 'idle', true, petDialogue.priority)
    }
  }, [wakeUp, saySequence, setMascotState])

  // Cycle test states on click for verification (CHECK 4 / Part 32)
  const handleCycleTestState = useCallback(() => {
    wakeUp()
    const currentIndex = TEST_CYCLE_STATES.indexOf(state)
    const nextIndex = (currentIndex + 1) % TEST_CYCLE_STATES.length
    const nextState = TEST_CYCLE_STATES[nextIndex]
    setMascotState(nextState, nextState === 'idle' ? 0 : 3500, undefined, 'idle', true)
  }, [state, wakeUp, setMascotState])

  // Drag start (registers pointer capture, prepares click vs drag discrimination)
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return

    stopPhysics()
    setMenuOpen(false)

    isPointerDownRef.current = true
    hasMovedRef.current = false
    isDraggingRef.current = false

    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }

    const now = performance.now()
    dragStartRef.current = { clientX: e.clientX, clientY: e.clientY, time: now }
    prevPosRef.current = { x: position.x, y: position.y, time: now }
    recentVelocityRef.current = { vx: 0, vy: 0 }

    e.currentTarget.setPointerCapture(e.pointerId)
  }

  // Drag move (only activates drag state once pointer moves beyond 5px threshold)
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !dragStartRef.current) return

    const moveDist = Math.hypot(
      e.clientX - dragStartRef.current.clientX,
      e.clientY - dragStartRef.current.clientY
    )

    if (!hasMovedRef.current && moveDist > 5) {
      hasMovedRef.current = true
      isDraggingRef.current = true
      wakeUp()
      setMascotState('drag', undefined, undefined, undefined, true)
    }

    if (!hasMovedRef.current) return

    const now = performance.now()
    const dt = Math.max((now - prevPosRef.current.time) / 1000, 0.008)

    const rawX = e.clientX - dragOffsetRef.current.x
    const rawY = e.clientY - dragOffsetRef.current.y

    const instVx = (rawX - prevPosRef.current.x) / dt
    const instVy = (rawY - prevPosRef.current.y) / dt

    recentVelocityRef.current = {
      vx: recentVelocityRef.current.vx * 0.4 + instVx * 0.6,
      vy: recentVelocityRef.current.vy * 0.4 + instVy * 0.6,
    }

    prevPosRef.current = { x: rawX, y: rawY, time: now }
    setPosition({ x: rawX, y: rawY })
  }

  // Drag end / Drop with physics simulation (or click cycle if stationary)
  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return
    isPointerDownRef.current = false

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // pointer capture might already be released
    }

    // If pointer didn't move significantly, treat as mascot click/tap (cycle test states)
    if (!hasMovedRef.current) {
      isDraggingRef.current = false
      dragStartRef.current = null
      handleMascotClick()
      return
    }

    hasMovedRef.current = false
    isDraggingRef.current = false

    // If reduced motion is active, skip physics loop and settle immediately
    if (reducedMotion) {
      const bounds = getSafeScreenBounds(isMobile)
      setPosition((prev) => ({ x: prev.x, y: bounds.maxY }), true)
      setMascotState('idle', 0, undefined, undefined, true)
      return
    }

    // Launch gravity & bounce physics loop with force: true
    const config = DEFAULT_PHYSICS_CONFIG
    let vx = Math.max(-config.maxVelocityX, Math.min(config.maxVelocityX, recentVelocityRef.current.vx))
    let vy = Math.max(-config.maxVelocityY, Math.min(config.maxVelocityY, recentVelocityRef.current.vy))

    if (Math.abs(vy) < 80) {
      vy = 120
    }

    setMascotState('fall', undefined, undefined, undefined, true)

    let currentX = position.x
    let currentY = position.y
    let lastTime = performance.now()

    const physicsStep = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      vy += config.gravity * dt
      vx *= Math.pow(config.friction, dt * 60)

      currentX += vx * dt
      currentY += vy * dt

      const bounds = getSafeScreenBounds(isMobile)

      if (currentX <= bounds.minX) {
        currentX = bounds.minX
        vx = -vx * config.bounceDamping
      } else if (currentX >= bounds.maxX) {
        currentX = bounds.maxX
        vx = -vx * config.bounceDamping
      }

      if (currentY >= bounds.maxY) {
        currentY = bounds.maxY

        if (Math.abs(vy) > config.minBounceVelocity) {
          vy = -vy * config.bounceDamping
          setMascotState('land', 180, undefined, undefined, true)
        } else {
          currentY = bounds.maxY
          setPosition({ x: currentX, y: currentY }, true)
          setMascotState('land', 220, undefined, 'idle', true)
          physicsLoopRef.current = null
          return
        }
      }

      setPosition({ x: currentX, y: currentY })
      physicsLoopRef.current = requestAnimationFrame(physicsStep)
    }

    stopPhysics()
    physicsLoopRef.current = requestAnimationFrame(physicsStep)
  }

  // Cancel physics loop on unmount
  useEffect(() => {
    return () => stopPhysics()
  }, [stopPhysics])

  // Asset source according to current state
  const assetSrc = `/assets/mascot/${state}.png`

  // Mascot container classes
  const mascotClasses = [
    'mascot-pet',
    `mascot-pet--${state}`,
    isDragging ? 'mascot-pet--dragging' : '',
    isFalling ? 'mascot-pet--falling' : '',
    isSleeping ? 'mascot-pet--sleeping' : '',
    isRelocating ? 'mascot-pet--relocating' : '',
    state === 'land' ? 'mascot-pet--landing' : '',
    facing === 'left' ? 'mascot-pet--face-left' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (!enabled) return null

  const transformStyle: CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  }

  return (
    <div className="mascot-system-layer" aria-label="Interactive Website Mascot Layer">
      <div
        className={mascotClasses}
        style={transformStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="region"
        aria-label="Cybersentinel Mascot Companion"
      >
        <div className="mascot-pet__sprite-wrapper">
          <img
            key={state}
            src={assetSrc}
            alt={`Cybersentinel mascot in ${state} pose`}
            className="mascot-pet__image"
            draggable={false}
          />
        </div>

        {/* Companion Cyber Badge / Mini Menu Trigger */}
        <button
          type="button"
          className="mascot-pet__badge"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((prev) => !prev)
          }}
          title="Companion controls & help"
          aria-label="Companion controls & help"
        >
          ?
        </button>

        {/* Companion Quick Menu */}
        {menuOpen && (
          <div
            className="mascot-quick-menu"
            role="menu"
            tabIndex={-1}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMenuOpen(false)
            }}
          >
            <button
              type="button"
              role="menuitem"
              className="mascot-quick-menu__btn"
              onClick={() => {
                setMenuOpen(false)
                startTour()
              }}
            >
              <span>◈</span> GUIDE TOUR
            </button>
            <button
              type="button"
              role="menuitem"
              className="mascot-quick-menu__btn"
              onClick={() => {
                setMenuOpen(false)
                handleCycleTestState()
              }}
            >
              <span>◈</span> CYCLE POSE (TEST)
            </button>
            <button
              type="button"
              role="menuitem"
              className="mascot-quick-menu__btn"
              onClick={() => {
                setMenuOpen(false)
                setMascotState('happy', 2500, "I'm Sentinel-01! Ready when you are.")
              }}
            >
              <span>♥</span> GREET PET
            </button>
            <button
              type="button"
              role="menuitem"
              className="mascot-quick-menu__btn"
              onClick={() => {
                setMenuOpen(false)
                resetPosition()
              }}
            >
              <span>⟲</span> RE-CENTER
            </button>
          </div>
        )}

        {/* Speech Bubble */}
        <MascotSpeechBubble
          speech={currentSpeech}
          placement={bubblePlacement}
          position={position}
          isMobile={isMobile}
          onClose={dismissSpeech}
          isTourActive={isTourActive}
          onSkipTour={skipTour}
        />
      </div>
    </div>
  )
}
