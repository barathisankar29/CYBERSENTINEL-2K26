/**
 * Train sound for the Timeline page: a real recording of train wheels
 * knocking over rail joints, looped, that follows the on-screen train. While
 * the train moves it plays at full level and normal speed; as the train
 * slows into a station it fades down and its clacks slow down with it.
 *
 * Source: "Стук колёс поезда" ("Knocking wheels of train", recorded in a
 * wagon), Wikimedia Commons, CC0 — no attribution required:
 * https://commons.wikimedia.org/wiki/File:Стук_колёс_поезда.ogg
 * Trimmed to a 14.6 s loop that starts and ends on a clack group, with the
 * seam crossfaded. The file carries LOOP_MARGIN_S of wrapped-around audio on
 * each side so the loop stays seamless even if a browser's MP3 decoder adds
 * a few milliseconds of padding.
 *
 * The 125 KB file is fetched when the page opens (`preload`) and decoded on
 * the Start Journey click — the user gesture browsers require before audio
 * can play. After that the browser's native audio graph does the work; the
 * only JS is a 100 ms timer that turns the train's position into speed.
 */

const TRAIN_SRC = '/audio/timeline-train.mp3'
const LOOP_MARGIN_S = 0.5
const LOOP_LENGTH_S = 14.589977

const MASTER_VOLUME = 0.75
const FADE_IN_S = 1.5
const FADE_OUT_S = 0.5
const TICK_MS = 100
/** Journey progress per second that counts as "full speed" (see TRAVEL_MS_PER_UNIT). */
const FULL_SPEED = 0.09
/** Level while parked at a station, relative to full speed. */
const IDLE_LEVEL = 0.18

export class TrainAmbience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private motion: GainNode | null = null
  private source: AudioBufferSourceNode | null = null
  private bytes: Promise<ArrayBuffer | null> | null = null
  private timer: number | null = null
  private muted = false

  // Train position as last reported by the journey, and the speed derived from it.
  private position = 0
  private lastPosition = 0
  private speed = 0

  private onVisibility = () => {
    const ctx = this.ctx
    if (!ctx || ctx.state === 'closed') return
    if (document.hidden) void ctx.suspend()
    else if (!this.muted) void ctx.resume()
  }

  /** Start downloading the recording (no audio is created yet). */
  preload() {
    this.bytes ??= fetch(TRAIN_SRC)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null)
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
    // Created synchronously inside the click so the browser lets it play.
    const ctx = new AudioCtx()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)
    this.master = master

    const motion = ctx.createGain()
    motion.gain.value = IDLE_LEVEL
    motion.connect(master)
    this.motion = motion

    this.lastPosition = this.position
    this.timer = window.setInterval(this.tick, TICK_MS)
    document.addEventListener('visibilitychange', this.onVisibility)
    this.applyMute()

    this.preload()
    void this.bytes!.then(async (data) => {
      if (!data || this.ctx !== ctx) return
      try {
        // decodeAudioData detaches its input, so give it a copy.
        const buffer = await ctx.decodeAudioData(data.slice(0))
        if (this.ctx !== ctx) return
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true
        source.loopStart = LOOP_MARGIN_S
        source.loopEnd = Math.min(buffer.duration, LOOP_MARGIN_S + LOOP_LENGTH_S)
        source.connect(motion)
        source.start(0, LOOP_MARGIN_S)
        this.source = source
      } catch {
        // Undecodable audio: the journey simply stays silent.
      }
    })
  }

  private tick = () => {
    const { ctx, motion, source } = this
    if (!ctx || !motion || ctx.state !== 'running') {
      this.lastPosition = this.position
      return
    }
    const velocity = Math.abs(this.position - this.lastPosition) / (TICK_MS / 1000)
    this.lastPosition = this.position
    const target = Math.min(1, velocity / FULL_SPEED)
    // Quick to pick up, gentler to fade, like a train coasting into a station.
    this.speed += (target - this.speed) * (target > this.speed ? 0.35 : 0.15)

    const now = ctx.currentTime
    motion.gain.setTargetAtTime(IDLE_LEVEL + (1 - IDLE_LEVEL) * this.speed, now, 0.15)
    // Slower train -> slower clacks.
    source?.playbackRate.setTargetAtTime(0.78 + 0.22 * this.speed, now, 0.25)
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
    this.motion = null
    this.source = null
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
