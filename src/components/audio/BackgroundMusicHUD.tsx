import { useState, useRef, useEffect, useCallback } from 'react'
import './BackgroundMusicHUD.css'

const BG_MUSIC_SRC = '/audio/bg-music.mp3'

interface BackgroundMusicHUDProps {
  visible?: boolean
}

export function BackgroundMusicHUD({ visible = true }: BackgroundMusicHUDProps = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  // HomePage passes visible={false} while the full-screen intro is showing,
  // so no DOM watching is needed to know about the intro.
  const isIntroActive = !visible

  // Never play over the intro.
  useEffect(() => {
    if (!visible && audioRef.current && !audioRef.current.paused) audioRef.current.pause()
  }, [visible])

  // The 3 MB track is only fetched once someone actually presses play —
  // never on page load, where it would compete with the hero images.
  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(BG_MUSIC_SRC)
    audio.loop = true
    audio.volume = 0.55
    audio.preload = 'auto'
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('ended', () => setIsPlaying(false))
    audioRef.current = audio
    return audio
  }, [])

  useEffect(
    () => () => {
      const audio = audioRef.current
      if (!audio) return
      audio.pause()
      audio.src = ''
    },
    []
  )

  const toggleAudio = useCallback(() => {
    const audio = getAudio()

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = 0.55
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.warn('Audio playback was prevented by browser policy:', err)
          setIsPlaying(false)
        })
    }
  }, [isPlaying, getAudio])

  // Only appear from starting to the hero section (disappear in buildings section & footer)
  const [isInHero, setIsInHero] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#buildings') {
      return false
    }
    return true
  })

  // IntersectionObserver instead of a scroll listener: no layout reads on
  // every scroll frame. In view while the hero's bottom is more than 80px
  // below the top of the viewport (same rule as before).
  useEffect(() => {
    const heroEl = document.querySelector('.city-scene')
    if (!heroEl) {
      setIsInHero(false)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setIsInHero(entry.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px',
    })
    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [visible])

  const isHidden = !visible || isIntroActive || !isInHero

  return (
    <aside
      className={`site-bg-music-hud ${isHidden ? 'site-bg-music-hud--hidden' : ''}`}
      aria-label="Background Music Control HUD"
    >
      <button
        type="button"
        className={`site-audio-ctrl ${isPlaying ? 'site-audio-ctrl--on' : 'site-audio-ctrl--off'}`}
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Audio On - Click to Turn Off' : 'Audio Off - Click to Play Audio'}
        title={isPlaying ? 'Mute Background Music' : 'Play Background Cyberpunk Music'}
      >
        <div className="site-audio-ctrl__box">
          {/* Status Indicator LED (Green when ON, Red when OFF) */}
          <span className="site-audio-ctrl__led" />

          {/* 3x3 HUD Reticle Grid */}
          <svg className="site-audio-ctrl__grid" viewBox="0 0 48 48" aria-hidden="true">
            <line x1="16" y1="0" x2="16" y2="48" stroke="rgba(167, 139, 250, 0.24)" strokeWidth="1" />
            <line x1="32" y1="0" x2="32" y2="48" stroke="rgba(167, 139, 250, 0.24)" strokeWidth="1" />
            <line x1="0" y1="16" x2="48" y2="16" stroke="rgba(167, 139, 250, 0.24)" strokeWidth="1" />
            <line x1="0" y1="32" x2="48" y2="32" stroke="rgba(167, 139, 250, 0.24)" strokeWidth="1" />
          </svg>

          {/* Center Glowing Cyan Speaker Icon */}
          <span className="site-audio-ctrl__icon">
            {isPlaying ? (
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="site-audio-ctrl__svg"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeWidth="2.4" className="site-audio-ctrl__wave-1" />
                <path d="M19 5.5a9.5 9.5 0 0 1 0 13" strokeWidth="2.4" className="site-audio-ctrl__wave-2" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="site-audio-ctrl__svg"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
                <line x1="21" y1="9" x2="16" y2="15" strokeWidth="2.4" stroke="var(--city-magenta, #d926c9)" />
                <line x1="16" y1="9" x2="21" y2="15" strokeWidth="2.4" stroke="var(--city-magenta, #d926c9)" />
              </svg>
            )}
          </span>
        </div>

        {/* Bottom Status Pill Badge */}
        <div className="site-audio-ctrl__badge">
          <span className="site-audio-ctrl__text">
            {isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}
          </span>
        </div>
      </button>
    </aside>
  )
}
