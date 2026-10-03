import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Volume2, VolumeX } from 'lucide-react'
import './BackgroundMusicHUD.css'

const BG_MUSIC_SRC = '/audio/bg-music.mp3'
const MILD_MUSIC_VOLUME = 0.18 // Mild ambient volume so thunder sound from RainEffect is clearly audible

// Excluded routes: timeline, registration form, checking page, team creation page
const EXCLUDED_PREFIXES = ['/timeline', '/register', '/checkstatus']

// Shared audio instance to preserve state across page navigation
let sharedAudio: HTMLAudioElement | null = null

function getOrCreateAudio(): HTMLAudioElement {
  if (!sharedAudio && typeof window !== 'undefined') {
    sharedAudio = new Audio(BG_MUSIC_SRC)
    sharedAudio.loop = true
    sharedAudio.volume = MILD_MUSIC_VOLUME
    sharedAudio.preload = 'none' // Don't download 3.2MB on initial page load (reduces load)
  }
  return sharedAudio!
}

interface BackgroundMusicHUDProps {
  visible?: boolean
}

export function BackgroundMusicHUD({ visible = true }: BackgroundMusicHUDProps = {}) {
  const location = useLocation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isIntroActive, setIsIntroActive] = useState(() => !visible || !!document.querySelector('.video-intro'))
  const userWantsPlayRef = useRef(false)

  // Route exclusion check (case-insensitive)
  const pathname = location.pathname.toLowerCase()
  const isExcluded = EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))

  // Listen to Audio element state changes
  useEffect(() => {
    const audio = getOrCreateAudio()
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    setIsPlaying(!audio.paused)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Detect full-screen VideoIntro on home page to avoid audio clash
  useEffect(() => {
    const checkIntro = () => {
      const active = !!document.querySelector('.video-intro')
      setIsIntroActive(active)
      if (active && sharedAudio && !sharedAudio.paused) {
        sharedAudio.pause()
      }
    }

    checkIntro()
    const observer = new MutationObserver(checkIntro)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  // Automatically pause when navigating into excluded pages (timeline, register, check status, team creation)
  // and resume if the user had it playing when returning to an allowed page
  useEffect(() => {
    const audio = sharedAudio
    if (!audio) return

    if (isExcluded || isIntroActive) {
      if (!audio.paused) {
        audio.pause()
      }
    } else if (userWantsPlayRef.current && audio.paused) {
      audio
        .play()
        .catch((err) => console.warn('Audio resume prevented by browser policy:', err))
    }
  }, [isExcluded, isIntroActive])

  const toggleAudio = useCallback(() => {
    const audio = getOrCreateAudio()
    if (!audio) return

    if (isPlaying) {
      userWantsPlayRef.current = false
      audio.pause()
      setIsPlaying(false)
    } else {
      userWantsPlayRef.current = true
      audio.volume = MILD_MUSIC_VOLUME
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
  }, [isPlaying])

  const isHidden = !visible || isExcluded || isIntroActive

  return (
    <aside
      className={`site-bg-music-hud ${isHidden ? 'site-bg-music-hud--hidden' : ''}`}
      aria-label="Background Music Control"
    >
      <button
        type="button"
        className={`site-audio-btn ${isPlaying ? 'site-audio-btn--on' : 'site-audio-btn--off'}`}
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute Background Cyberpunk Music' : 'Play Background Cyberpunk Music'}
        title={isPlaying ? 'Mute Cyberpunk Audio' : 'Play Cyberpunk Audio (Mild with Thunder)'}
      >
        {isPlaying ? (
          <span className="site-audio-btn__icon site-audio-btn__icon--on">
            <Volume2 size={17} strokeWidth={2.2} />
            <span className="site-audio-pulse-ring" aria-hidden="true" />
          </span>
        ) : (
          <span className="site-audio-btn__icon site-audio-btn__icon--off">
            <VolumeX size={17} strokeWidth={2.2} />
          </span>
        )}
      </button>
    </aside>
  )
}
