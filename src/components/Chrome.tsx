import { useEffect, useRef, useState } from 'react'
import { scrollToId, scrollToY } from '../lib/motion'
import { setRoomTone } from '../lib/sound'
import { useTheme } from '../theme'

export function Frame() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 px-5 md:px-10">
        <div className="grid h-full grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`theme-t h-full border-l border-[var(--line)] ${i >= 4 ? 'hidden md:block' : ''} ${i === 3 ? 'border-r md:border-r-0' : ''} ${i === 5 ? 'border-r' : ''}`}
            />
          ))}
        </div>
      </div>
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.06]" />
    </>
  )
}

export function Nav() {
  const [sound, setSound] = useState(false)
  const toggle = () => {
    const next = !sound
    setSound(next)
    setRoomTone(next)
  }
  return (
    <header className="micro fixed inset-x-0 top-0 z-50 flex before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-[150%] before:bg-gradient-to-b before:from-[var(--page)] before:from-40% before:to-transparent before:transition-colors before:duration-[400ms] items-center justify-between px-5 py-5 text-[var(--ink)] md:px-10 md:py-6">
      <nav aria-label="Primary" className="flex items-center gap-6 md:gap-10">
        <a href="#top" data-cursor="enter" onClick={(e) => (e.preventDefault(), scrollToY(0))} className="hover:text-[var(--action)]">
          Francis
        </a>
        <a href="#works" data-cursor="view" onClick={(e) => (e.preventDefault(), scrollToId('works'))} className="hover:text-[var(--action)]">
          Work
        </a>
        <a href="#about" data-cursor="view" onClick={(e) => (e.preventDefault(), scrollToId('about'))} className="hover:text-[var(--action)]">
          About
        </a>
      </nav>
      <div className="flex items-center gap-6 md:gap-10">
        <button type="button" onClick={toggle} aria-pressed={sound} data-cursor="open" className="micro flex items-center gap-2 hover:text-[var(--action)]">
          <span
            aria-hidden
            className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${sound ? 'bg-[var(--live)] shadow-[0_0_0_3px_var(--live-bg)]' : 'bg-[var(--muted)]'}`}
          />
          {sound ? 'Sound on' : 'Sound off'}
        </button>
        <a href="#contact" data-cursor="enter" onClick={(e) => (e.preventDefault(), scrollToId('contact'))} className="hover:text-[var(--action)]">
          Contact
        </a>
      </div>
    </header>
  )
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const set = () => setEnabled(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      const el = (e.target as Element | null)?.closest?.('[data-cursor], a, button')
      setLabel(el ? (el.getAttribute('data-cursor') || 'open').toUpperCase() : null)
    }
    const tick = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    const leave = () => setLabel(null)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  const big = label !== null
  return (
    <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]">
      <div
        className="flex items-center justify-center rounded-full bg-[var(--action)] font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-[width,height] duration-300 ease-[var(--ease)]"
        style={{ width: big ? 28 : 6, height: big ? 28 : 6 }}
      >
        <span className={`scale-[0.62] transition-opacity duration-200 ${big ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      </div>
    </div>
  )
}

export function Loader({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(reduced)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    if (reduced) {
      done.current()
      return
    }
    document.documentElement.style.overflow = 'hidden'
    const start = performance.now()
    let raf = 0
    let t1 = 0,
      t2 = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        t1 = window.setTimeout(() => {
          setLeaving(true)
          document.documentElement.style.overflow = ''
          done.current()
        }, 120)
        t2 = window.setTimeout(() => setGone(true), 900)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
      document.documentElement.style.overflow = ''
    }
  }, [reduced])

  if (gone) return null
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[95] bg-[#222222]"
      style={{
        transform: leaving ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        className="absolute bottom-6 right-5 font-mono text-[clamp(48px,9vw,128px)] leading-none tracking-[0.04em] text-white tabular-nums md:bottom-10 md:right-10"
        style={{ opacity: leaving ? 0 : 1, transition: 'opacity 500ms ease-out' }}
      >
        {String(count).padStart(3, '0')}
      </div>
    </div>
  )
}

export function ThemePill() {
  const { theme, setTheme } = useTheme()
  const opt = (t: 'day' | 'dream', label: string) => {
    const on = theme === t
    return (
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setTheme(t)}
        data-cursor="enter"
        className={`micro rounded-full px-4 py-2 transition-colors duration-[400ms] ${
          on ? (t === 'day' ? 'bg-[#222222] text-white' : 'bg-[var(--action)] text-white') : 'text-[#626262] hover:text-[var(--ink)]'
        }`}
      >
        {label}
      </button>
    )
  }
  return (
    <div
      role="group"
      aria-label="Viewing mode"
      className="theme-t fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-[var(--line)] bg-[var(--card)] p-1 backdrop-blur-md md:bottom-6"
    >
      {opt('day', 'Day')}
      {opt('dream', 'Dream')}
    </div>
  )
}
