/**
 * Cybersentinel 2K26 Mascot System Types and Configurations
 */

export type MascotState =
  | 'idle'
  | 'blink'
  | 'wave'
  | 'happy'
  | 'point'
  | 'guide'
  | 'thinking'
  | 'working'
  | 'celebrate'
  | 'error'
  | 'sleep'
  | 'peek'
  | 'surprised'
  | 'drag'
  | 'fall'
  | 'land'
  | 'talk'
  | 'listening'

export const ALL_MASCOT_STATES: MascotState[] = [
  'idle',
  'blink',
  'wave',
  'happy',
  'point',
  'guide',
  'thinking',
  'working',
  'celebrate',
  'error',
  'sleep',
  'peek',
  'surprised',
  'drag',
  'fall',
  'land',
  'talk',
  'listening',
]

/**
 * State Priority table: Higher numbers override lower numbers.
 * Active physics and dragging states have highest priority.
 */
export const MASCOT_STATE_PRIORITY: Record<MascotState, number> = {
  drag: 100,
  fall: 95,
  land: 90,
  celebrate: 85,
  error: 80,
  working: 75,
  thinking: 70,
  talk: 65,
  listening: 60,
  surprised: 55,
  happy: 50,
  guide: 45,
  point: 40,
  wave: 35,
  sleep: 30,
  peek: 25,
  blink: 20,
  idle: 10,
}

export type MascotDialoguePriority = 'critical' | 'high' | 'medium' | 'low'

export interface MascotPosition {
  x: number
  y: number
}

export interface SavedMascotPosition {
  x: number
  y: number
  manuallyPlaced: boolean
}

/** Where the speech bubble sits relative to the mascot. */
export interface MascotBubblePlacement {
  side: 'left' | 'right'
  vertical: 'above' | 'below'
}

export interface MascotSpeech {
  id: string
  text: string
  duration?: number
  priority?: MascotDialoguePriority
  action?: {
    label: string
    onClick: () => void
  }
}

export interface MascotTourStep {
  id: string
  title: string
  text: string
  state?: MascotState
  targetRoute?: string
}

export type MascotEventType =
  | 'MASCOT_WELCOME'
  | 'MASCOT_NAVIGATION'
  | 'MASCOT_EVENT_OPEN'
  | 'MASCOT_DAY_SELECTED'
  | 'MASCOT_REGISTRATION_START'
  | 'MASCOT_REGISTRATION_SUCCESS'
  | 'MASCOT_REGISTRATION_ERROR'
  | 'MASCOT_USER_INACTIVE'
  | 'MASCOT_USER_INTERACTION'
  | 'MASCOT_DRAG_START'
  | 'MASCOT_DRAG_END'
  | 'MASCOT_PAGE_CHANGE'
  | 'MASCOT_HOVER_BUILDING'
  | 'MASCOT_CLICK_BUILDING'

export interface MascotContextType {
  state: MascotState
  setMascotState: (
    nextState: MascotState,
    durationMs?: number,
    message?: string,
    onFinishState?: MascotState,
    force?: boolean,
    priority?: MascotDialoguePriority
  ) => boolean
  say: (
    text: string,
    durationMs?: number,
    action?: { label: string; onClick: () => void },
    priority?: MascotDialoguePriority
  ) => boolean
  saySequence: (
    messages: Array<{ text: string; duration?: number; state?: MascotState }>,
    priority?: MascotDialoguePriority
  ) => void
  dismissSpeech: () => void
  currentSpeech: MascotSpeech | null
  position: MascotPosition
  setPosition: (
    pos: MascotPosition | ((prev: MascotPosition) => MascotPosition),
    isManualDrop?: boolean
  ) => void
  resetPosition: () => void
  isDragging: boolean
  isFalling: boolean
  isSleeping: boolean
  isRelocating: boolean
  checkObstructionAndRelocate: () => boolean
  wakeUp: () => void
  isTourActive: boolean
  currentTourStep: number
  startTour: () => void
  nextTourStep: () => void
  skipTour: () => void
  tourSteps: MascotTourStep[]
  dispatchMascotEvent: (type: MascotEventType, payload?: Record<string, unknown>) => void
  /** Which way the sprite faces; the pointing poses point right by default. */
  facing: 'left' | 'right'
  setFacing: (facing: 'left' | 'right') => void
  /** Smoothly fly to a spot chosen by a guide, without saving it as the visitor's own spot. */
  guideTo: (pos: MascotPosition) => void
  /** While a guide is steering the mascot, pause auto-relocation and idle sleep. */
  setGuideActive: (active: boolean) => void
  /** Guide-chosen bubble side (so it stays off buildings); null = automatic. */
  bubblePlacement: MascotBubblePlacement | null
  setBubblePlacement: (placement: MascotBubblePlacement | null) => void
}
