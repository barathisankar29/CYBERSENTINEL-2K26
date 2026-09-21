import './ScrollIndicator.css'

interface ScrollIndicatorProps {
  /** Master scroll progress (0-1). Indicator fades out once progress > 0.04 */
  progress: number
  /** Whether the intro has completed and the website is revealed */
  visible?: boolean
}

export function ScrollIndicator({ progress, visible = true }: ScrollIndicatorProps) {
  // Fade out as user scrolls past 0.04
  const isScrolledPast = progress > 0.04
  const isShown = visible && !isScrolledPast

  const handleClick = () => {
    // Smooth scroll into the city scene
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className={`scroll-indicator ${isShown ? 'scroll-indicator--visible' : 'scroll-indicator--hidden'}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Scroll to see magic"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
    >
      <div className="scroll-indicator__inner">
        {/* Glowing badge background */}
        <div className="scroll-indicator__glow" />

        {/* Compact Text */}
        <div className="scroll-indicator__content">
          <span className="scroll-indicator__bracket"></span>
          <span className="scroll-indicator__text">SCROLL TO SEE MAGIC</span>
          <span className="scroll-indicator__bracket"></span>
        </div>

        {/* Tiny Cascading neon chevron arrow */}
        <div className="scroll-indicator__chevrons" aria-hidden="true">
          <span className="scroll-indicator__arrow" />
        </div>
      </div>
    </div>
  )
}
