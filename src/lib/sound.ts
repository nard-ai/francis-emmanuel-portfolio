/** A very quiet room tone: filtered brown noise. Created only on user action. */
let ctx: AudioContext | null = null
let gain: GainNode | null = null

export function setRoomTone(on: boolean) {
  if (on) {
    if (!ctx) {
      ctx = new AudioContext()
      const len = ctx.sampleRate * 4
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const d = buf.getChannelData(0)
      let last = 0
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1
        last = (last + 0.02 * w) / 1.02
        d[i] = last * 3.5
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.loop = true
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 420
      gain = ctx.createGain()
      gain.gain.value = 0
      src.connect(lp).connect(gain).connect(ctx.destination)
      src.start()
    }
    ctx.resume()
    gain!.gain.setTargetAtTime(0.05, ctx.currentTime, 0.6)
  } else if (ctx && gain) {
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
  }
}
