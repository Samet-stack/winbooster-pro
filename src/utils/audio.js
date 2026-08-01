// Futuristic Web Audio Synthesizer Engine for WinBooster
let audioCtx = null

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const playHoverSound = () => {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04)
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch (e) {}
}

export const playClickSound = () => {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08)
    
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } catch (e) {}
}

export const playOverdriveSound = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    
    // Sub-bass sweep
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(80, now)
    osc1.frequency.exponentialRampToValueAtTime(450, now + 0.3)
    osc1.frequency.exponentialRampToValueAtTime(120, now + 0.6)
    
    gain1.gain.setValueAtTime(0.08, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    
    osc1.start(now)
    osc1.stop(now + 0.6)
    
    // High cyber laser chime
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1200, now + 0.15)
    osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.45)
    
    gain2.gain.setValueAtTime(0.04, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)
    
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    
    osc2.start(now + 0.15)
    osc2.stop(now + 0.55)
  } catch (e) {}
}

export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + (index * 0.05)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      
      gain.gain.setValueAtTime(0.03, start)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(start)
      osc.stop(start + 0.2)
    })
  } catch (e) {}
}

export const playWarningSound = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.setValueAtTime(350, now + 0.1)
    
    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.25)
  } catch (e) {}
}
