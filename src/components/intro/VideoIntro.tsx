import { useState, useRef, useEffect, useCallback } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import './VideoIntro.css'

const DESKTOP_INTRO_SRC = '/assets/intro/desktop_intro.mp4'
const MOBILE_INTRO_SRC = '/assets/intro/mobile_intro.mp4'

interface VideoIntroProps {
  onFinish: () => void
  videoSrc?: string
  desktopSrc?: string
  mobileSrc?: string
}

export function VideoIntro({
  onFinish,
  videoSrc,
  desktopSrc = DESKTOP_INTRO_SRC,
  mobileSrc = MOBILE_INTRO_SRC,
}: VideoIntroProps) {
  const isMobile = useIsMobile()
  const activeVideoSrc = videoSrc ?? (isMobile ? mobileSrc : desktopSrc)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const hasTriggeredFinish = useRef(false)
  const lastTimeRef = useRef(0)

  const handleFinish = useCallback(() => {
    if (hasTriggeredFinish.current) return
    hasTriggeredFinish.current = true
    const video = videoRef.current
    if (video) {
      // Release the decoder and buffered media right away (skip or natural
      // end) — detaching `src` + `load()` is what actually frees them;
      // pausing alone keeps the decoder and network connection alive.
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
    onFinish()
  }, [onFinish])

  // Normal muted video playback on initial website load
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    setIsMuted(true)

    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        // Autoplay fallback
      }

    }

    tryPlay()
  }, [activeVideoSrc])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return

    lastTimeRef.current = video.currentTime

    // Trigger when video nears completion
    if (video.duration && video.currentTime >= video.duration - 0.1 && !hasTriggeredFinish.current) {
      handleFinish()
      return
    }

  }

  const handleLoadedMetadata = () => {
    setIsLoaded(true)
    const video = videoRef.current
    if (video && lastTimeRef.current > 0 && lastTimeRef.current < (video.duration || 10) - 0.2) {
      video.currentTime = lastTimeRef.current
    }
  }

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
    if (!nextMuted) {
      video.play().catch(() => {})
    }
  }, [])

  // Keyboard navigation: ESC to skip, M to mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish()
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFinish, toggleMute])

  return (
    <div
      className="video-intro"
      data-loaded={isLoaded}
      role="region"
      aria-label="Symposium Cinematic Intro Screen"
    >
      {/* Main cinematic video canvas (uninterrupted playback, no click-to-pause) */}
      <div className="video-intro__stage">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className="video-intro__video"
          src={activeVideoSrc}
          preload="auto"
          playsInline
          autoPlay
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleFinish}
        />
      </div>

      {/* Subtle cinematic scanline & vignette textures */}
      <div className="video-intro__vignette" />
      <div className="video-intro__scanlines" />

      {/* Modern, stylish icon-only HUD controls */}
      <div className="video-intro__hud">
        {/* Top Header: System Tag (Left) & Futuristic Audio Control HUD (Right) */}
        <div className="video-intro__top-row">
          <div className="video-intro__system-tag">
            <span className="video-intro__live-dot" />
            <span className="video-intro__system-title">CYBERSENTINEL 2K26</span>
          </div>

          {/* Futuristic Audio Control HUD (Exact Match to Design) */}
          <button
            type="button"
            className={`intro-audio-ctrl ${!isMuted ? 'intro-audio-ctrl--on' : 'intro-audio-ctrl--off'}`}
            onClick={toggleMute}
            aria-label={isMuted ? 'Audio Off - Click to Play Audio' : 'Audio On - Click to Turn Off'}
            title={isMuted ? 'Turn Audio On' : 'Turn Audio Off'}
          >
            <div className="intro-audio-ctrl__box">
              {/* Status Indicator LED (Green when ON, Red when OFF) */}
              <span className="intro-audio-ctrl__led" />

              {/* 3x3 HUD Reticle Grid */}
              <svg className="intro-audio-ctrl__grid" viewBox="0 0 48 48" aria-hidden="true">
                <line x1="16" y1="0" x2="16" y2="48" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
                <line x1="32" y1="0" x2="32" y2="48" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
                <line x1="0" y1="16" x2="48" y2="16" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
                <line x1="0" y1="32" x2="48" y2="32" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
              </svg>

              {/* Center Glowing Cyan Speaker Icon */}
              <span className="intro-audio-ctrl__icon">
                {isMuted ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="intro-audio-ctrl__svg">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
                    <line x1="21" y1="9" x2="16" y2="15" strokeWidth="2.4" />
                    <line x1="16" y1="9" x2="21" y2="15" strokeWidth="2.4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="intro-audio-ctrl__svg">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeWidth="2.4" />
                    <path d="M19 5.5a9.5 9.5 0 0 1 0 13" strokeWidth="2.4" />
                  </svg>
                )}
              </span>
            </div>

            {/* Bottom Status Pill Badge */}
            <div className="intro-audio-ctrl__badge">
              <span className="intro-audio-ctrl__text">
                {isMuted ? 'AUDIO OFF' : 'AUDIO ON'}
              </span>
            </div>
          </button>
        </div>

        {/* Bottom Right: Futuristic Cyber Skip Control HUD (Matching Audio Button Design) */}
        <button
          type="button"
          className="intro-skip-ctrl"
          onClick={(e) => {
            e.stopPropagation()
            handleFinish()
          }}
          aria-label="Skip Intro"
          title="Skip Intro [ESC]"
        >
          <div className="intro-skip-ctrl__box">
            {/* Corner Beacon LED Dot */}
            <span className="intro-skip-ctrl__led" />

            {/* 3x3 HUD Reticle Grid */}
            <svg className="intro-skip-ctrl__grid" viewBox="0 0 48 48" aria-hidden="true">
              <line x1="16" y1="0" x2="16" y2="48" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
              <line x1="32" y1="0" x2="32" y2="48" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
              <line x1="0" y1="16" x2="48" y2="16" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
              <line x1="0" y1="32" x2="48" y2="32" stroke="rgba(0, 240, 255, 0.28)" strokeWidth="1" />
            </svg>

            {/* Center Glowing Fast-Forward Skip Icon */}
            <span className="intro-skip-ctrl__icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="intro-skip-ctrl__svg">
                <polygon points="5 4 15 12 5 20 5 4" fill="none" />
                <line x1="19" y1="5" x2="19" y2="19" strokeWidth="2.4" />
              </svg>
            </span>
          </div>

          {/* Bottom Status Pill Badge */}
          <div className="intro-skip-ctrl__badge">
            <span className="intro-skip-ctrl__text">SKIP INTRO</span>
          </div>
        </button>
      </div>

      {/* High-tech corner frame marks */}
      <div className="video-intro__corner video-intro__corner--tl" />
      <div className="video-intro__corner video-intro__corner--tr" />
      <div className="video-intro__corner video-intro__corner--bl" />
      <div className="video-intro__corner video-intro__corner--br" />
    </div>
  )
}
