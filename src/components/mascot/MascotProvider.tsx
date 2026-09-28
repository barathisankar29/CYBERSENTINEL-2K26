import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  MascotState,
  MascotPosition,
  SavedMascotPosition,
  MascotSpeech,
  MascotTourStep,
  MascotEventType,
  MascotContextType,
  MascotDialoguePriority,
  MascotBubblePlacement,
} from '@/types/mascot'
import { MASCOT_STATE_PRIORITY, ALL_MASCOT_STATES } from '@/types/mascot'
import {
  clampPositionToBounds,
  getDefaultMascotPosition,
  getMascotDimensions,
} from './MascotPhysics'
import { findSafeMascotPosition } from './MascotObstruction'
import { MASCOT_DIALOGUE, type MascotDialogueItem } from './mascotDialogue'
import { useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useIsMobile'
import { isMascotRoute } from './mascotRoutes'
import { MascotContext } from './MascotContext'

const STORAGE_KEY_POSITION = 'cybersentinel_mascot_position'
const STORAGE_KEY_LEGACY_POS = 'cybersentinel_mascot_pos'
const STORAGE_KEY_TOUR = 'cybersentinel_mascot_tour_done'
const INACTIVITY_TIMEOUT_MS = 25000

const DIALOGUE_PRIORITY_WEIGHT: Record<MascotDialoguePriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const TOUR_STEPS: MascotTourStep[] = [
  {
    id: 'welcome',
    title: 'GREETINGS, PLAYER',
    text: "Welcome to Cybersentinel 2K26! I'm your digital companion for the symposium.",
    state: 'wave',
  },
  {
    id: 'navigation',
    title: 'CITY DECK NAVIGATION',
    text: 'The city itself is your navigation system. Explore each building to unlock symposium details.',
    state: 'guide',
  },
  {
    id: 'events',
    title: 'MISSION TERMINAL',
    text: 'Jump into the Events Terminal to explore technical & non-tech competitions for Day 1 and Day 2!',
    state: 'point',
  },
  {
    id: 'register',
    title: 'REGISTRATION & PASSES',
    text: 'Register individually or with your crew to secure your symposium clearance.',
    state: 'happy',
  },
  {
    id: 'pet',
    title: 'INTERACTIVE COMPANION',
    text: 'You can drag me anywhere around your screen, drop me, or tap me whenever you need guidance!',
    state: 'celebrate',
  },
]

export function MascotProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const onMascotRoute = isMascotRoute(useLocation().pathname)
  // Shown only while the buildings section is on screen (MascotCityGuide).
  const [cityVisible, setCityVisible] = useState(false)
  const enabled = onMascotRoute && cityVisible
  const [state, setStateInternal] = useState<MascotState>('idle')
  const stateRef = useRef<MascotState>('idle')
  const currentPriorityRef = useRef<number>(MASCOT_STATE_PRIORITY.idle)
  const currentSpeechRef = useRef<MascotSpeech | null>(null)
  const currentSpeechPriorityRef = useRef<MascotDialoguePriority>('low')
  const [currentSpeech, setCurrentSpeech] = useState<MascotSpeech | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isFalling, setIsFalling] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [isRelocating, setIsRelocating] = useState(false)
  const isRelocatingRef = useRef(false)
  const guideActiveRef = useRef(false)
  const [facing, setFacing] = useState<'left' | 'right'>('right')
  const [bubblePlacement, setBubblePlacement] = useState<MascotBubblePlacement | null>(null)

  // Tour State
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentTourStep, setCurrentTourStep] = useState(0)

  // Tracking manual placement
  const lastManualPlacementRef = useRef<number>(0)
  const isManuallyPlacedRef = useRef<boolean>(false)
  const lastBuildingHoverRef = useRef<{ buildingId: string; time: number } | null>(null)

  // Preload the mascot sprites (so rapid states like blink/land are instant) —
  // once, and only when a page that shows the mascot is first opened.
  const spritesPreloadedRef = useRef(false)
  useEffect(() => {
    if (!enabled || spritesPreloadedRef.current) return
    spritesPreloadedRef.current = true
    ALL_MASCOT_STATES.forEach((s) => {
      const img = new Image()
      img.src = `/assets/mascot/${s}.png`
    })
  }, [enabled])

  // Position state with bounds clamping and localStorage recovery (Part 1, 2 & 3)
  const [position, setPositionInternal] = useState<MascotPosition>(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY_POSITION) || localStorage.getItem(STORAGE_KEY_LEGACY_POS)
      if (stored) {
        const parsed = JSON.parse(stored) as {
          x?: number
          y?: number
          manuallyPlaced?: boolean
        }
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          isManuallyPlacedRef.current = !!parsed.manuallyPlaced
          return clampPositionToBounds({ x: parsed.x, y: parsed.y }, false)
        }
      }
    } catch {
      // ignore storage failure
    }
    return getDefaultMascotPosition(false)
  })

  // References for active timeouts
  const stateTimerRef = useRef<number | null>(null)
  const speechTimerRef = useRef<number | null>(null)
  const sequenceTimersRef = useRef<number[]>([])
  const relocatingTimerRef = useRef<number | null>(null)
  const lastInteractionRef = useRef<number>(Date.now())
  const nextTourStepRef = useRef<() => void>(() => {})

  // Keep screen position valid upon resize
  useEffect(() => {
    const handleResize = () => {
      setPositionInternal((prev) => clampPositionToBounds(prev, isMobile))
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  // Clear timers safely
  const clearStateTimer = useCallback(() => {
    if (stateTimerRef.current !== null) {
      window.clearTimeout(stateTimerRef.current)
      stateTimerRef.current = null
    }
  }, [])

  const clearSpeechTimer = useCallback(() => {
    if (speechTimerRef.current !== null) {
      window.clearTimeout(speechTimerRef.current)
      speechTimerRef.current = null
    }
  }, [])

  const clearSequenceTimers = useCallback(() => {
    sequenceTimersRef.current.forEach((t) => window.clearTimeout(t))
    sequenceTimersRef.current = []
  }, [])

  const dismissSpeech = useCallback(() => {
    clearSpeechTimer()
    clearSequenceTimers()
    currentSpeechRef.current = null
    setCurrentSpeech(null)
    currentSpeechPriorityRef.current = 'low'
  }, [clearSpeechTimer, clearSequenceTimers])

  // Dialogue System with Priority Guard (Part 22)
  const say = useCallback(
    (
      text: string,
      durationMs = 5000,
      action?: { label: string; onClick: () => void },
      priority: MascotDialoguePriority = 'medium'
    ): boolean => {
      // Lower priority speech cannot interrupt higher priority active speech
      if (
        currentSpeechRef.current &&
        DIALOGUE_PRIORITY_WEIGHT[priority] < DIALOGUE_PRIORITY_WEIGHT[currentSpeechPriorityRef.current]
      ) {
        return false
      }

      clearSpeechTimer()
      clearSequenceTimers()
      currentSpeechPriorityRef.current = priority

      const newSpeech: MascotSpeech = {
        id: Math.random().toString(36).substring(2, 9),
        text,
        duration: durationMs,
        priority,
        action,
      }
      currentSpeechRef.current = newSpeech
      setCurrentSpeech(newSpeech)

      if (durationMs > 0) {
        speechTimerRef.current = window.setTimeout(() => {
          currentSpeechRef.current = null
          setCurrentSpeech(null)
          currentSpeechPriorityRef.current = 'low'
          speechTimerRef.current = null
        }, durationMs)
      }

      return true
    },
    [clearSpeechTimer, clearSequenceTimers]
  )

  // Sequential Speech System (Part 1, 9, 10, 14, 15)
  const saySequence = useCallback(
    (
      messages: Array<{ text: string; duration?: number; state?: MascotState }>,
      priority: MascotDialoguePriority = 'high'
    ) => {
      if (messages.length === 0) return
      clearSequenceTimers()

      let cumulativeDelay = 0
      messages.forEach((msg) => {
        const duration = msg.duration ?? 4000
        const timer = window.setTimeout(() => {
          if (msg.state) {
            setMascotState(msg.state, duration, undefined, 'idle', true, priority)
          }
          say(msg.text, duration, undefined, priority)
        }, cumulativeDelay)
        sequenceTimersRef.current.push(timer)
        cumulativeDelay += duration + 350
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [say, clearSequenceTimers]
  )

  const setMascotState = useCallback(
    (
      nextState: MascotState,
      durationMs?: number,
      message?: string,
      onFinishState: MascotState = 'idle',
      force = false,
      priority: MascotDialoguePriority = 'medium'
    ): boolean => {
      const nextPriority = MASCOT_STATE_PRIORITY[nextState]

      // High-priority states temporarily override low-priority states,
      // UNLESS force is true (used for physics transitions, wakeUp, explicit actions).
      if (!force && nextPriority < currentPriorityRef.current) {
        return false
      }

      if (import.meta.env.DEV) {
        console.log(
          `[MASCOT] state changed: ${stateRef.current} → ${nextState}`,
          `[MASCOT] rendering asset: ${nextState}.png`
        )
      }

      clearStateTimer()
      currentPriorityRef.current = nextPriority
      stateRef.current = nextState
      setStateInternal(nextState)

      if (nextState === 'sleep') {
        setIsSleeping(true)
      } else {
        setIsSleeping(false)
      }

      if (nextState === 'drag') {
        setIsDragging(true)
      } else {
        setIsDragging(false)
      }

      if (nextState === 'fall') {
        setIsFalling(true)
      } else {
        setIsFalling(false)
      }

      if (message) {
        say(message, durationMs ? durationMs + 800 : 4000, undefined, priority)
      }

      if (durationMs && durationMs > 0) {
        stateTimerRef.current = window.setTimeout(() => {
          currentPriorityRef.current = MASCOT_STATE_PRIORITY[onFinishState]
          stateRef.current = onFinishState
          setStateInternal(onFinishState)
          setIsSleeping(onFinishState === 'sleep')
          stateTimerRef.current = null
        }, durationMs)
      } else if (nextState === 'idle') {
        // Untimed transition to idle resets priority back to base level
        currentPriorityRef.current = MASCOT_STATE_PRIORITY.idle
      }

      return true
    },
    [clearStateTimer, say]
  )

  // Wake up companion from sleep
  const wakeUp = useCallback(() => {
    lastInteractionRef.current = Date.now()
    if (isSleeping || stateRef.current === 'sleep') {
      setIsSleeping(false)
      setMascotState('idle', 0, undefined, undefined, true)
    }
  }, [isSleeping, setMascotState])

  // Position updates and persistence (Part 2 & 3)
  const setPosition = useCallback(
    (
      newPosOrUpdater: MascotPosition | ((prev: MascotPosition) => MascotPosition),
      isManualDrop = false
    ) => {
      setPositionInternal((prev) => {
        const next =
          typeof newPosOrUpdater === 'function' ? newPosOrUpdater(prev) : newPosOrUpdater
        const clamped = clampPositionToBounds(next, isMobile)
        if (isManualDrop) {
          lastManualPlacementRef.current = Date.now()
          isManuallyPlacedRef.current = true
        }
        try {
          const toSave: SavedMascotPosition = {
            x: clamped.x,
            y: clamped.y,
            manuallyPlaced: isManuallyPlacedRef.current,
          }
          localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(toSave))
        } catch {
          // ignore
        }
        return clamped
      })
    },
    [isMobile]
  )

  const resetPosition = useCallback(() => {
    const defaultPos = getDefaultMascotPosition(isMobile)
    isManuallyPlacedRef.current = false
    setPositionInternal(defaultPos)
    try {
      const toSave: SavedMascotPosition = {
        x: defaultPos.x,
        y: defaultPos.y,
        manuallyPlaced: false,
      }
      localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(toSave))
    } catch {
      // ignore
    }
  }, [isMobile])

  // Smart Obstruction Detection & Auto-Relocation (Part 4, 5, 6, 18, 27)
  const checkObstructionAndRelocate = useCallback((): boolean => {
    // Never auto-move while user is actively dragging, falling, or already relocating (Part 6)
    if (isDragging || isFalling || isRelocatingRef.current) return false

    // A guide (e.g. the city tour) has already placed the mascot clear of content
    if (guideActiveRef.current) return false

    // Never auto-move while user is actively filling out a form or has an input focused
    const activeEl = document.activeElement
    if (
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement ||
      activeEl instanceof HTMLSelectElement
    ) {
      return false
    }

    // Never auto-move while modal window or tour is open
    if (isTourActive || document.querySelector('[role="dialog"]')) {
      return false
    }

    // Do not fight user control: if user dropped the mascot within the last 4 seconds, respect their placement
    if (Date.now() - lastManualPlacementRef.current < 4000) {
      return false
    }

    const safePos = findSafeMascotPosition(position, isMobile)
    if (!safePos) return false

    // Smoothly relocate mascot
    isRelocatingRef.current = true
    setIsRelocating(true)

    const moveDialogue = MASCOT_DIALOGUE.pet.autoMoved
    setMascotState(moveDialogue.state, moveDialogue.duration, moveDialogue.text, 'idle', true, moveDialogue.priority)

    setPositionInternal(safePos)

    if (relocatingTimerRef.current !== null) {
      window.clearTimeout(relocatingTimerRef.current)
    }
    relocatingTimerRef.current = window.setTimeout(() => {
      isRelocatingRef.current = false
      setIsRelocating(false)
      relocatingTimerRef.current = null
    }, 700)

    return true
  }, [isDragging, isFalling, isMobile, isTourActive, position, setMascotState])

  // Debounced check on scroll stop (Part 5, 31)
  useEffect(() => {
    if (!enabled) return
    let scrollTimer: number | null = null
    const handleScroll = () => {
      if (scrollTimer !== null) window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        checkObstructionAndRelocate()
      }, 350)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer !== null) window.clearTimeout(scrollTimer)
    }
  }, [enabled, checkObstructionAndRelocate])

  // Inactivity tracking (25s idle triggers subtle thinking/sleep or relocation) (Part 7 & 8)
  useEffect(() => {
    if (!enabled) return
    const resetInactivity = () => {
      lastInteractionRef.current = Date.now()
      if (isSleeping || stateRef.current === 'sleep') {
        setIsSleeping(false)
        setMascotState('idle', 0, undefined, undefined, true)
      }
    }

    const checkInactivity = () => {
      const activeEl = document.activeElement
      const isInputActive =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement

      if (
        !guideActiveRef.current &&
        !isInputActive &&
        !isDragging &&
        !isFalling &&
        !isTourActive &&
        stateRef.current === 'idle' &&
        Date.now() - lastInteractionRef.current >= INACTIVITY_TIMEOUT_MS
      ) {
        // First check if mascot needs relocation to stay out of the way
        const relocated = checkObstructionAndRelocate()
        if (!relocated) {
          // Subtle idle sleep
          setMascotState('sleep')
        }
      }
    }

    const interval = window.setInterval(checkInactivity, 3000)
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'touchmove', 'scroll', 'click', 'input']
    events.forEach((evt) => window.addEventListener(evt, resetInactivity, { passive: true }))

    return () => {
      window.clearInterval(interval)
      events.forEach((evt) => window.removeEventListener(evt, resetInactivity))
    }
  }, [enabled, isSleeping, isDragging, isFalling, isTourActive, setMascotState, checkObstructionAndRelocate])

  const nextTourStep = useCallback(() => {
    setCurrentTourStep((curr) => {
      const nextIndex = curr + 1
      if (nextIndex >= TOUR_STEPS.length) {
        // Tour completed
        setIsTourActive(false)
        try {
          localStorage.setItem(STORAGE_KEY_TOUR, 'true')
        } catch {
          // ignore
        }
        setMascotState('celebrate', 3000, "You're all set! Enjoy Cybersentinel 2K26!", 'idle', true, 'high')
        return 0
      }

      const step = TOUR_STEPS[nextIndex]
      setMascotState(step.state ?? 'guide', 0, undefined, 'idle', true, 'high')
      say(step.text, 0, {
        label: nextIndex === TOUR_STEPS.length - 1 ? 'FINISH' : 'NEXT >',
        onClick: () => nextTourStepRef.current(),
      }, 'high')
      return nextIndex
    })
  }, [setMascotState, say])

  useEffect(() => {
    nextTourStepRef.current = nextTourStep
  }, [nextTourStep])

  // Tour management
  const startTour = useCallback(() => {
    wakeUp()
    setIsTourActive(true)
    setCurrentTourStep(0)
    const first = TOUR_STEPS[0]
    setMascotState(first.state ?? 'wave', 0, undefined, 'idle', true, 'high')
    say(first.text, 0, {
      label: 'NEXT >',
      onClick: () => nextTourStepRef.current(),
    }, 'high')
  }, [wakeUp, setMascotState, say])

  const skipTour = useCallback(() => {
    setIsTourActive(false)
    dismissSpeech()
    try {
      localStorage.setItem(STORAGE_KEY_TOUR, 'true')
    } catch {
      // ignore
    }
    setMascotState('idle', 0, undefined, undefined, true)
  }, [dismissSpeech, setMascotState])

  // Centralized Application Event Dispatcher (Part 11, 12, 13, 14, 15)
  const dispatchMascotEvent = useCallback(
    (type: MascotEventType, payload?: Record<string, unknown>) => {
      wakeUp()
      switch (type) {
        case 'MASCOT_WELCOME': {
          const item: MascotDialogueItem = MASCOT_DIALOGUE.intro.welcomeInitial
          if (item.followUpText) {
            saySequence([
              { text: item.text, duration: 4000, state: item.state },
              { text: item.followUpText, duration: 4000, state: item.state },
            ], item.priority)
          } else {
            setMascotState(item.state, item.duration ?? 4000, item.text, 'idle', false, item.priority)
          }
          break
        }

        case 'MASCOT_HOVER_BUILDING': {
          const rawId = (payload?.buildingId as string) || 'events'
          const bId = (rawId === 'contacts' ? 'contact' : rawId) as keyof typeof MASCOT_DIALOGUE.buildings
          const item: MascotDialogueItem = MASCOT_DIALOGUE.buildings[bId]?.hover || MASCOT_DIALOGUE.buildings.events.hover

          // Cooldown per building (Part 12)
          const now = Date.now()
          if (
            lastBuildingHoverRef.current?.buildingId === bId &&
            now - lastBuildingHoverRef.current.time < (item.cooldown ?? 4000)
          ) {
            break
          }
          lastBuildingHoverRef.current = { buildingId: bId, time: now }
          setMascotState(item.state, item.duration ?? 3500, item.text, 'idle', false, item.priority)
          break
        }

        case 'MASCOT_CLICK_BUILDING': {
          const rawId = (payload?.buildingId as string) || 'events'
          const bId = (rawId === 'contacts' ? 'contact' : rawId) as keyof typeof MASCOT_DIALOGUE.buildings
          const item: MascotDialogueItem = MASCOT_DIALOGUE.buildings[bId]?.click || MASCOT_DIALOGUE.buildings.events.click

          setMascotState(item.state, item.duration ?? 2500, item.text, 'idle', true, item.priority)
          break
        }

        case 'MASCOT_EVENT_OPEN': {
          const item: MascotDialogueItem = MASCOT_DIALOGUE.events.eventOpen
          if (item.followUpText) {
            saySequence([
              { text: item.text, duration: 2500, state: item.state },
              { text: item.followUpText, duration: 3200, state: item.state },
            ], item.priority)
          } else {
            setMascotState(item.state, item.duration ?? 3500, item.text, 'idle', true, item.priority)
          }
          break
        }

        case 'MASCOT_DAY_SELECTED': {
          const day = payload?.day
          const item: MascotDialogueItem =
            day === 'day1'
              ? MASCOT_DIALOGUE.events.day1
              : day === 'day2'
              ? MASCOT_DIALOGUE.events.day2
              : MASCOT_DIALOGUE.events.all

          if (item.followUpText) {
            saySequence([
              { text: item.text, duration: 2400, state: item.state },
              { text: item.followUpText, duration: 3200, state: item.state },
            ], item.priority)
          } else {
            setMascotState(item.state, item.duration ?? 3000, item.text, 'idle', true, item.priority)
          }
          break
        }

        case 'MASCOT_REGISTRATION_START': {
          const item = MASCOT_DIALOGUE.registration.start
          setMascotState(item.state, item.duration, item.text, 'idle', true, item.priority)
          break
        }

        case 'MASCOT_REGISTRATION_SUCCESS': {
          const regId = payload?.regId as string | undefined
          const item = MASCOT_DIALOGUE.registration.success
          const followUp = regId ? `Your registration ID is ready: ${regId}` : 'Your registration ID is ready.'
          saySequence([
            { text: item.text, duration: 3500, state: item.state },
            { text: followUp, duration: 4000, state: item.state },
          ], item.priority)
          break
        }

        case 'MASCOT_REGISTRATION_ERROR': {
          const customMsg = payload?.message as string | undefined
          const item = MASCOT_DIALOGUE.registration.error
          const firstText = customMsg || item.text
          saySequence([
            { text: firstText, duration: 3200, state: item.state },
            { text: "Let's try that again.", duration: 3000, state: item.state },
          ], item.priority)
          break
        }

        case 'MASCOT_PAGE_CHANGE': {
          // After route navigation, also schedule an obstruction check once DOM mounts
          window.setTimeout(() => {
            checkObstructionAndRelocate()
          }, 450)
          break
        }

        default:
          break
      }
    },
    [wakeUp, setMascotState, saySequence, checkObstructionAndRelocate]
  )

  // Guided placement: same smooth glide as auto-relocation, but not persisted,
  // so the visitor's own saved spot is untouched when the guide hands back.
  const guideTo = useCallback(
    (pos: MascotPosition) => {
      isRelocatingRef.current = true
      setIsRelocating(true)
      // Only keep it on screen: the guide has already chosen a spot clear of
      // content, which may be nearer the top edge than the usual safe bounds.
      const { width, height } = getMascotDimensions(isMobile)
      setPositionInternal({
        x: Math.max(8, Math.min(window.innerWidth - width - 8, pos.x)),
        y: Math.max(8, Math.min(window.innerHeight - height - 8, pos.y)),
      })
      if (relocatingTimerRef.current !== null) {
        window.clearTimeout(relocatingTimerRef.current)
      }
      relocatingTimerRef.current = window.setTimeout(() => {
        isRelocatingRef.current = false
        setIsRelocating(false)
        relocatingTimerRef.current = null
      }, 700)
    },
    [isMobile]
  )

  const setGuideActive = useCallback((active: boolean) => {
    guideActiveRef.current = active
    if (!active) {
      setFacing('right')
      setBubblePlacement(null)
    }
  }, [])

  // Clean up all resources when unmounted
  useEffect(() => {
    return () => {
      clearStateTimer()
      clearSpeechTimer()
      clearSequenceTimers()
      if (relocatingTimerRef.current !== null) {
        window.clearTimeout(relocatingTimerRef.current)
      }
    }
  }, [clearStateTimer, clearSpeechTimer, clearSequenceTimers])

  const contextValue: MascotContextType = {
    enabled,
    setCityVisible,
    state,
    setMascotState,
    say,
    saySequence,
    dismissSpeech,
    currentSpeech,
    position,
    setPosition,
    resetPosition,
    isDragging,
    isFalling,
    isSleeping,
    isRelocating,
    checkObstructionAndRelocate,
    wakeUp,
    isTourActive,
    currentTourStep,
    startTour,
    nextTourStep,
    skipTour,
    tourSteps: TOUR_STEPS,
    dispatchMascotEvent,
    facing,
    setFacing,
    guideTo,
    setGuideActive,
    bubblePlacement,
    setBubblePlacement,
  }

  return <MascotContext.Provider value={contextValue}>{children}</MascotContext.Provider>
}
