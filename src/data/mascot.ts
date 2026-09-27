export type MascotExpression =
  | 'idle'
  | 'float'
  | 'wave'
  | 'dash1'
  | 'dash2'
  | 'fly'
  | 'cheer'
  | 'curious'
  | 'surprised'
  | 'shy'
  | 'smug'
  | 'happy'
  | 'sleep'

export interface MascotSpriteInfo {
  id: MascotExpression
  src: string
  label: string
  mood: string
}

export const MASCOT_SPRITES: Record<MascotExpression, MascotSpriteInfo> = {
  idle: {
    id: 'idle',
    src: '/assets/mascot/mascot_idle.png',
    label: 'Front Idle',
    mood: 'Online & Monitoring',
  },
  float: {
    id: 'float',
    src: '/assets/mascot/mascot_float.png',
    label: 'Hovering Float',
    mood: 'Cruising Cyberspace',
  },
  wave: {
    id: 'wave',
    src: '/assets/mascot/mascot_wave.png',
    label: 'Friendly Wave',
    mood: 'Greeting Operative',
  },
  dash1: {
    id: 'dash1',
    src: '/assets/mascot/mascot_dash_1.png',
    label: 'Thrust Dash',
    mood: 'Engaging Propulsion',
  },
  dash2: {
    id: 'dash2',
    src: '/assets/mascot/mascot_dash_2.png',
    label: 'Full Overdrive',
    mood: 'Pushing Payload!',
  },
  fly: {
    id: 'fly',
    src: '/assets/mascot/mascot_fly.png',
    label: 'Supersonic Fly',
    mood: 'Warp Speed Activated',
  },
  cheer: {
    id: 'cheer',
    src: '/assets/mascot/mascot_cheer.png',
    label: 'Celebration Cheer',
    mood: 'Mission Success!',
  },
  curious: {
    id: 'curious',
    src: '/assets/mascot/mascot_curious.png',
    label: 'Curious Scan',
    mood: 'Querying Matrix...',
  },
  surprised: {
    id: 'surprised',
    src: '/assets/mascot/mascot_surprised.png',
    label: 'Surprised Alert',
    mood: 'Signal Detected!',
  },
  shy: {
    id: 'shy',
    src: '/assets/mascot/mascot_shy.png',
    label: 'Bashful Shy',
    mood: 'Buffer Overflow :3',
  },
  smug: {
    id: 'smug',
    src: '/assets/mascot/mascot_smug.png',
    label: 'Cool Smug',
    mood: 'Flawless Execution',
  },
  happy: {
    id: 'happy',
    src: '/assets/mascot/mascot_happy.png',
    label: 'Ecstatic Joy',
    mood: 'Max Sync Rate!',
  },
  sleep: {
    id: 'sleep',
    src: '/assets/mascot/mascot_sleep.png',
    label: 'Audio Recharge',
    mood: 'Vibing with Beats zZz',
  },
}

export const MASCOT_QUOTES = [
  'SYSTEM ONLINE // READY TO ASSIST!',
  'HEADPHONES AT MAX VOLUME ⚡',
  'BEAT THE CYBER MATRIX!',
  'EXPLORE EVENTS DOWN BELOW ↓',
  'CYBERSENTINEL 2K26 IS READY!',
  'TAP ME FOR A CUTE GLITCH ✨',
]

/**
 * Procedural retro 8-bit synthetic audio chimes for mascot interactions
 * using Web Audio API (no external asset dependencies, zero bandwidth lag).
 */
class MascotSoundEngine {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  /** Cute chirp when clicking or hovering mascot */
  playChirp(pitch = 1.0) {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const now = ctx.currentTime
      osc.frequency.setValueAtTime(587.33 * pitch, now) // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66 * pitch, now + 0.12) // D6

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.16)
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  /** Energetic thruster whoosh sound when mascot pushes cards */
  playPushWhoosh() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      const now = ctx.currentTime

      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25)

      gain.gain.setValueAtTime(0.09, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.29)
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  /** Cheerful victory blip when new card lands */
  playSuccessBlip() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const now = ctx.currentTime
      ;[659.25, 880, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const time = now + i * 0.04
        osc.frequency.setValueAtTime(freq, time)
        gain.gain.setValueAtTime(0.05, time)
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(time)
        osc.stop(time + 0.1)
      })
    } catch {
      // Audio autoplay policy handled silently
    }
  }
}

export const mascotAudio = new MascotSoundEngine()
