import { useState, useEffect, useCallback, useRef, useMemo, type CSSProperties, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import './StudentInfiniteCarousel.css'

/**
 * The student coordinators' 3D cover-flow carousel, shared by every team
 * carousel on the credentials page: infinite loop (cloned sets, silently
 * re-centred), centre card forward, side cards angled away, one transform
 * transition, auto-advance while on screen, dots + arrows + swipe, click a
 * side card to centre it. Cards are centred on their own size, so each
 * carousel only sets its spacing (`xStep`) and stage height (via its
 * `variant` class in StudentInfiniteCarousel.css).
 */
interface CoverflowCarouselProps<T> {
  items: T[]
  getKey: (item: T) => string
  getLabel: (item: T) => string
  renderItem: (item: T, state: { isActive: boolean; index: number }) => ReactNode
  /** Delay between automatic moves. */
  autoDelayMs?: number
  /** Horizontal spacing between neighbouring cards (px), or a function of the viewport width. */
  xStep?: { desktop: number | ((viewportWidth: number) => number); mobile: number }
  /** Extra class for per-carousel sizing (e.g. 'infinite-carousel--frontend'). */
  variant?: string
  /** Rewind to the first card whenever the carousel scrolls out of view. */
  rewindWhenHidden?: boolean
  /** Dim side cards with brightness (as the students do) or opacity only (cheaper for big cards). */
  dimWith?: 'brightness' | 'opacity'
  labels: { prev: string; next: string; dots: string; dot: (label: string) => string }
  /** Optional callback notified whenever the active centered item changes */
  onActiveChange?: (realIndex: number, item: T) => void
  /** Optional class name generator per item container */
  getItemClassName?: (item: T, state: { isActive: boolean; index: number }) => string
}

const REPEAT_SETS = 5 // 5 cloned sets for uninterrupted infinite traversal
const BASE_SET = 2 // middle set index (0, 1, [2], 3, 4)
const CENTER = 'translate(-50%, -50%) '

export function CoverflowCarousel<T>({
  items,
  getKey,
  getLabel,
  renderItem,
  autoDelayMs = 2000,
  xStep = { desktop: 225, mobile: 88 },
  variant,
  rewindWhenHidden = false,
  dimWith = 'brightness',
  labels,
  onActiveChange,
  getItemClassName,
}: CoverflowCarouselProps<T>) {
  const n = items.length
  const baseIndex = BASE_SET * n

  const [activeIndex, setActiveIndex] = useState(baseIndex)
  const [enableTransition, setEnableTransition] = useState(true)
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth))
  const isMobile = viewportWidth < 768
  const rootRef = useRef<HTMLDivElement>(null)
  // Auto-loop only while on screen (off screen it would restyle every card for nothing).
  const inView = useInView(rootRef)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  const extendedList = useMemo(() => {
    const list: Array<{ item: T; originalIndex: number; globalIndex: number }> = []
    for (let s = 0; s < REPEAT_SETS; s++) {
      for (let i = 0; i < n; i++) list.push({ item: items[i], originalIndex: i, globalIndex: s * n + i })
    }
    return list
  }, [items, n])

  useEffect(() => {
    const checkWidth = () => setViewportWidth(window.innerWidth)
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // Always open on the first card: rewind (without animating) while off screen.
  useEffect(() => {
    if (!rewindWhenHidden || inView) return
    setEnableTransition(false)
    setActiveIndex(baseIndex)
  }, [rewindWhenHidden, inView, baseIndex])

  const handlePrev = useCallback(() => setActiveIndex((prev) => prev - 1), [])
  const handleNext = useCallback(() => setActiveIndex((prev) => prev + 1), [])

  useEffect(() => {
    if (n === 0 || !inView) return
    const timer = setTimeout(() => setActiveIndex((prev) => prev + 1), autoDelayMs)
    return () => clearTimeout(timer)
  }, [activeIndex, n, inView, autoDelayMs])

  useEffect(() => {
    if (n === 0) return
    const currentReal = ((activeIndex % n) + n) % n
    onActiveChange?.(currentReal, items[currentReal])
  }, [activeIndex, n, onActiveChange, items])

  // Silent modulo normalisation back into the middle set.
  useEffect(() => {
    if (n === 0) return
    if (!enableTransition) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true))
      })
      return () => cancelAnimationFrame(frame)
    }
    if (activeIndex >= 3 * n || activeIndex < n) {
      const settleTimer = setTimeout(() => {
        const currentReal = ((activeIndex % n) + n) % n
        setEnableTransition(false)
        setActiveIndex(baseIndex + currentReal)
      }, 760)
      return () => clearTimeout(settleTimer)
    }
  }, [activeIndex, enableTransition, n, baseIndex])

  const handleDotClick = (targetDotIndex: number) => {
    const currentReal = ((activeIndex % n) + n) % n
    let diff = targetDotIndex - currentReal
    if (diff > n / 2) diff -= n
    if (diff < -n / 2) diff += n
    setActiveIndex((prev) => prev + diff)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }
  const handleTouchEnd = () => {
    if (touchStartX.current === null) return
    if (touchDeltaX.current > 45) handlePrev()
    else if (touchDeltaX.current < -45) handleNext()
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  // Cover-flow geometry (the student coordinators' exact values).
  // With only a few cards, show at most as many per side as there are
  // other distinct cards, so nobody appears twice (3 cards: one per side).
  const maxSide = Math.max(1, Math.floor((n - 1) / 2))

  const getCardStyle = (offset: number): CSSProperties => {
    const absOffset = Math.abs(offset)
    const sign = Math.sign(offset)
    if (absOffset > maxSide) {
      return {
        transform: `${CENTER}translateX(${sign * (isMobile ? xStep.mobile : 225) * 2.8}px) scale(0.4)`,
        zIndex: 1,
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      }
    }
    const step = isMobile
      ? xStep.mobile
      : typeof xStep.desktop === 'function'
        ? xStep.desktop(viewportWidth)
        : xStep.desktop
    const zStep = isMobile ? -45 : -75
    const rotY = isMobile ? 26 : 38
    const dim = (brightness: number, opacity: number): CSSProperties =>
      dimWith === 'brightness' ? { opacity, filter: `brightness(${brightness})` } : { opacity: opacity * brightness }

    if (offset === 0) {
      return {
        transform: `${CENTER}translateX(0px) translateZ(85px) rotateY(0deg) scale(1)`,
        zIndex: 30,
        ...dim(1, 1),
        pointerEvents: 'auto',
      }
    }
    if (absOffset === 1) {
      return {
        transform: `${CENTER}translateX(${sign * step}px) translateZ(${zStep}px) rotateY(${-sign * rotY}deg) scale(0.86)`,
        zIndex: 20,
        ...dim(0.82, isMobile ? 0.75 : 0.88),
        pointerEvents: 'auto',
      }
    }
    if (absOffset === 2) {
      return {
        transform: `${CENTER}translateX(${sign * (step * 1.76)}px) translateZ(${zStep * 2}px) rotateY(${-sign * (rotY * 1.25)}deg) scale(0.72)`,
        zIndex: 10,
        ...dim(0.62, isMobile ? 0 : 0.62),
        pointerEvents: 'auto',
      }
    }
    if (absOffset === 3) {
      return {
        transform: `${CENTER}translateX(${sign * (step * 2.35)}px) translateZ(${zStep * 3}px) rotateY(${-sign * 54}deg) scale(0.56)`,
        zIndex: 5,
        ...dim(0.35, 0),
        pointerEvents: 'none',
      }
    }
    return {
      transform: `${CENTER}translateX(${sign * (step * 2.8)}px) translateZ(${zStep * 4}px) scale(0.4)`,
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      visibility: 'hidden',
    }
  }

  if (n === 0) return null
  const currentActiveDot = ((activeIndex % n) + n) % n

  return (
    <div
      ref={rootRef}
      className={`infinite-carousel-container${variant ? ` ${variant}` : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="infinite-carousel-stage">
        {extendedList.map(({ item, originalIndex, globalIndex }) => {
          const offset = globalIndex - activeIndex
          // Render only within the visible range buffer (|offset| <= 3).
          if (Math.abs(offset) > 3) return null
          const isCenter = offset === 0
          return (
            <div
              key={globalIndex}
              className={`infinite-carousel-item ${enableTransition ? 'infinite-carousel-item--animated' : ''} ${
                isCenter ? 'infinite-carousel-item--active' : ''
              }${getItemClassName ? ` ${getItemClassName(item, { isActive: isCenter, index: originalIndex + 1 })}` : ''}`}
              style={getCardStyle(offset)}
              data-active={isCenter}
              onClickCapture={(e) => {
                // A side card click centres it (instead of following its links).
                if (isCenter) return
                e.preventDefault()
                e.stopPropagation()
                setActiveIndex(globalIndex)
              }}
            >
              {renderItem(item, { isActive: isCenter, index: originalIndex + 1 })}
              {!isCenter && (
                <div className="infinite-carousel-click-hint" aria-hidden="true">
                  <span>CLICK TO CENTER</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="infinite-carousel-controls-bar">
        <button
          type="button"
          className="infinite-carousel-arrow-btn infinite-carousel-arrow-btn--prev"
          onClick={handlePrev}
          aria-label={labels.prev}
          title={labels.prev}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="infinite-carousel-dots" role="tablist" aria-label={labels.dots}>
          {items.map((item, idx) => (
            <button
              key={getKey(item)}
              type="button"
              className={`infinite-carousel-dot ${idx === currentActiveDot ? 'infinite-carousel-dot--active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={labels.dot(getLabel(item))}
              role="tab"
              aria-selected={idx === currentActiveDot}
            />
          ))}
        </div>

        <button
          type="button"
          className="infinite-carousel-arrow-btn infinite-carousel-arrow-btn--next"
          onClick={handleNext}
          aria-label={labels.next}
          title={labels.next}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
