/**
 * Subtle train sound for the Timeline page, synthesised with Web Audio — no
 * audio file to download. It follows the on-screen train: while the train
 * moves you hear a soft wheel rumble and the "clack-clack" of the wheels
 * crossing rail joints, paced by its speed; while it waits at a station it
 * settles to a faint electric hum.
 *
 * The noise is generated once; after that the sound runs in the browser's
 * native audio graph. The only JS work is a 60 ms timer that reads the
 * train's latest position (`reportPosition`) and schedules the next clacks.
 *
 * Browsers only allow audio after a user gesture, so `start()` must be
 * called from one (the "Start Journey" click).
 */

const MASTER_VOLUME = 0.5
const FADE_IN_S = 1.5
const FADE_OUT_S = 0.5
const NOISE_SECONDS = 4
const TICK_MS = 60
/** Journey progress per second that counts as "full speed" (see TRAVEL_MS_PER_UNIT). */
const FULL_SPEED = 0.15
/** Gap between the two clacks of one bogie crossing a rail joint. */
const PAIR_GAP_S = 0.12

function brownNoise(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * NOISE_SECONDS)
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

function clickNoise(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 0.05)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3
  return buffer
}

export class TrainAmbience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private rumble: GainNode | null = null
  private hum: GainNode | null = null
  private click: AudioBuffer | null = null
  private timer: number | null = null
  private muted = false

  // Train position as last reported by the journey, and the speed derived from it.
  private position = 0
  private lastPosition = 0
  private speed = 0
  private nextClackAt = 0

  private onVisibility = () => {
    const ctx = this.ctx
    if (!ctx || ctx.state === 'closed') return
    if (document.hidden) void ctx.suspend()
    else if (!this.muted) void ctx.resume()
  }

  /** Latest journey progress (0-1). Cheap: just stores the number. */
  reportPosition(progress: number) {
    this.position = progress
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

    // Wheel rumble: low brown noise, swelled by speed.
    const rumbleSrc = ctx.createBufferSource()
    rumbleSrc.buffer = brownNoise(ctx)
    rumbleSrc.loop = true
    const rumbleLow = ctx.createBiquadFilter()
    rumbleLow.type = 'lowpass'
    rumbleLow.frequency.value = 220
    const rumble = ctx.createGain()
    rumble.gain.value = 0.04
    rumbleSrc.connect(rumbleLow).connect(rumble).connect(master)
    this.rumble = rumble

    // Faint electric hum of the train's motors, always present.
    const hum = ctx.createGain()
    hum.gain.value = 0.012
    const humLow = ctx.createBiquadFilter()
    humLow.type = 'lowpass'
    humLow.frequency.value = 400
    for (const [freq, level] of [
      [98, 1],
      [196, 0.35],
    ] as const) {
      const osc = ctx.createOscillator()
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = level
      osc.connect(g).connect(humLow)
      osc.start()
    }
    humLow.connect(hum).connect(master)
    this.hum = hum

    this.click = clickNoise(ctx)
    rumbleSrc.start()

    this.lastPosition = this.position
    this.timer = window.setInterval(this.tick, TICK_MS)
    document.addEventListener('visibilitychange', this.onVisibility)
    this.applyMute()
  }

  private tick = () => {
    const { ctx, rumble, hum } = this
    if (!ctx || !rumble || !hum || ctx.state !== 'running') {
      this.lastPosition = this.position
      return
    }
    const velocity = Math.abs(this.position - this.lastPosition) / (TICK_MS / 1000)
    this.lastPosition = this.position
    const target = Math.min(1, velocity / FULL_SPEED)
    // Quick to pick up, slow to fade, so short station stops don't cut the sound dead.
    this.speed += (target - this.speed) * (target > this.speed ? 0.3 : 0.08)

    const now = ctx.currentTime
    rumble.gain.setTargetAtTime(0.04 + this.speed * 0.32, now, 0.12)
    hum.gain.setTargetAtTime(0.012 + this.speed * 0.012, now, 0.2)

    if (this.speed < 0.12) {
      this.nextClackAt = now + 0.15
      return
    }
    // Faster train -> rail joints come by more often.
    const interval = 1.25 - this.speed * 0.7
    while (this.nextClackAt < now + 0.2) {
      if (this.nextClackAt < now) this.nextClackAt = now + 0.02
      const level = 0.12 + this.speed * 0.2
      this.clack(this.nextClackAt, level)
      this.clack(this.nextClackAt + PAIR_GAP_S, level * 0.8)
      this.nextClackAt += interval
    }
  }

  /** One wheel over a rail joint: a dull thump plus a short metallic tick. */
  private clack(at: number, level: number) {
    const { ctx, master, click } = this
    if (!ctx || !master || !click) return

    const thump = ctx.createOscillator()
    thump.frequency.setValueAtTime(85, at)
    thump.frequency.exponentialRampToValueAtTime(45, at + 0.09)
    const thumpGain = ctx.createGain()
    thumpGain.gain.setValueAtTime(0.0001, at)
    thumpGain.gain.exponentialRampToValueAtTime(level, at + 0.005)
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.11)
    thump.connect(thumpGain).connect(master)
    thump.start(at)
    thump.stop(at + 0.12)

    const tick = ctx.createBufferSource()
    tick.buffer = click
    tick.playbackRate.value = 0.9 + Math.random() * 0.2
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1700
    band.Q.value = 1.4
    const tickGain = ctx.createGain()
    tickGain.gain.value = level * 0.55
    tick.connect(band).connect(tickGain).connect(master)
    tick.start(at)
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
      master.gain.exponentialRampToValueAtTime(MASTER_VOLUME, now + FADE_IN_S)
    }
  }

  /** Fade out and release the audio context (leaving the page). */
  stop() {
    const { ctx, master } = this
    this.ctx = null
    this.master = null
    this.rumble = null
    this.hum = null
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
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
