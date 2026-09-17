import './BootOverlay.css'

interface BootOverlayProps {
  /** True while the boot screen should still be covering the scene. */
  active: boolean
  reducedMotion: boolean
}

/**
 * Stage 1: a completely black screen with a minimal, non-generic
 * initialization indicator (no spinner). Fades out once the sky begins
 * establishing. Under reduced motion this simply never becomes visible
 * for long, since the caller resolves `skyVisible` immediately.
 */
export function BootOverlay({ active, reducedMotion }: BootOverlayProps) {
  return (
    <div
      className="boot-overlay"
      style={{
        opacity: active ? 1 : 0,
        transitionDuration: reducedMotion ? '0s' : undefined,
        pointerEvents: active ? 'auto' : 'none',
      }}
      aria-hidden={!active}
    >
      <div className="boot-overlay__status">
        <span className="boot-overlay__label">
          INITIALIZING SYSTEM
          <span className="boot-overlay__cursor">_</span>
        </span>
        <span className="boot-overlay__bar" />
      </div>
    </div>
  )
}
