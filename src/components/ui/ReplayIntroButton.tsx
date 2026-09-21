import './ReplayIntroButton.css'

interface ReplayIntroButtonProps {
  onReplay: () => void
  visible?: boolean
}

export function ReplayIntroButton({ onReplay, visible = true }: ReplayIntroButtonProps) {
  if (!visible) return null

  return (
    <button
      type="button"
      className="replay-intro-btn"
      onClick={onReplay}
      aria-label="Replay 2K Video Intro"
      title="Replay 2K Video Intro"
    >
      <span className="replay-intro-btn__icon">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      </span>
      <span className="replay-intro-btn__label">REPLAY INTRO</span>
    </button>
  )
}
