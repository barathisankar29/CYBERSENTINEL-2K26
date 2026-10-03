/**
 * Background rain for the Timeline page, synthesised with Web Audio — no
 * audio file to download. Two looping noise buffers are generated once
 * (pink noise for the hiss of the rain, brown noise for its low body) and
 * a very slow LFO swells the volume so the loop never sounds static. After
 * setup everything runs inside the browser's native audio graph, so it
 * costs no main-thread work while the journey animates.
 *
 * Browsers only allow audio after a user gesture, so `start()` must be
 * called from one (the "Start Journey" click).
 */

const RAIN_VOLUME = 0.32
const FADE_IN_S = 2.5
const FADE_OUT_S = 0.6
const LOOP_SECONDS = 5

function pinkNoise(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * LOOP_SECONDS)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  // Paul Kellet's economy pink-noise filter.
  let b0 = 0
  let b1 = 0
  let b2 = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99765 * b0 + white * 0.099046
    b1 = 0.963 * b1 + white * 0.2965164
    b2 = 0.57 * b2 + white * 1.0526913
    data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2
  }
  return buffer
}

function brownNoise(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * LOOP_SECONDS)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  // Remove the drift between the first and last sample so the loop point
  // doesn't click.
  const drift = data[length - 1] - data[0]
  for (let i = 0; i < length; i++) data[i] -= (drift * i) / length
  return buffer
}

export class RainAmbience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private muted = false

  private onVisibility = () => {
    const ctx = this.ctx
    if (!ctx || ctx.state === 'closed') return
    if (document.hidden) void ctx.suspend()
    else if (!this.muted) void ctx.resume()
  }

  /** Call from a user gesture. Safe to call more than once. */
  start(muted: boolean) {
    this.muted = muted
    if (this.ctx) {
      this.applyMute()
      return
    }
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)
    this.master = master

    // Hiss: the drops themselves.
    const hiss = ctx.createBufferSource()
    hiss.buffer = pinkNoise(ctx)
    hiss.loop = true
    const hissHigh = ctx.createBiquadFilter()
    hissHigh.type = 'highpass'
    hissHigh.frequency.value = 500
    const hissLow = ctx.createBiquadFilter()
    hissLow.type = 'lowpass'
    hissLow.frequency.value = 7000
    const hissGain = ctx.createGain()
    hissGain.gain.value = 0.75
    hiss.connect(hissHigh).connect(hissLow).connect(hissGain).connect(master)

    // Body: distant, heavier rainfall.
    const body = ctx.createBufferSource()
    body.buffer = brownNoise(ctx)
    body.loop = true
    const bodyLow = ctx.createBiquadFilter()
    bodyLow.type = 'lowpass'
    bodyLow.frequency.value = 420
    const bodyGain = ctx.createGain()
    bodyGain.gain.value = 0.5
    body.connect(bodyLow).connect(bodyGain).connect(master)

    // Slow swell in intensity (~14 s cycle).
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = 0.18
    lfo.connect(lfoDepth).connect(hissGain.gain)

    const now = ctx.currentTime
    hiss.start(now)
    body.start(now + Math.random())
    lfo.start(now)

    document.addEventListener('visibilitychange', this.onVisibility)
    this.applyMute()
  }

  setMuted(muted: boolean) {
    this.muted = muted
    this.applyMute()
  }

  private applyMute() {
    const { ctx, master } = this
    if (!ctx || !master || ctx.state === 'closed') return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
    if (this.muted) {
      master.gain.exponentialRampToValueAtTime(0.0001, now + FADE_OUT_S)
      // Suspend once faded: a muted, suspended context uses no CPU.
      window.setTimeout(() => {
        if (this.muted && this.ctx === ctx && ctx.state === 'running') void ctx.suspend()
      }, FADE_OUT_S * 1000 + 50)
    } else {
      if (!document.hidden) void ctx.resume()
      master.gain.exponentialRampToValueAtTime(RAIN_VOLUME, now + FADE_IN_S)
    }
  }

  /** Fade out and release the audio context (leaving the page). */
  stop() {
    const { ctx, master } = this
    this.ctx = null
    this.master = null
    document.removeEventListener('visibilitychange', this.onVisibility)
    if (!ctx || ctx.state === 'closed') return
    if (master && ctx.state === 'running') {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
      window.setTimeout(() => void ctx.close(), 350)
    } else {
      void ctx.close()
    }
  }
}
