import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GlassStone, STONE_CLIP } from './Glass'
import { PROJECTS } from '../data'
import { clamp, range, scrollToId } from '../lib/motion'
import { useTheme } from '../theme'

const LINES = ['Sites you remember.', 'Worlds you enter.']
// Story length in viewports beyond the first.
const STORY = 3.2

function useHeadlineSize() {
  const probe = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState('18vw')
  useLayoutEffect(() => {
    const measure = () => {
      const el = probe.current
      if (!el) return
      // Width of the shorter line at 100px; size it so that line is ~6% wider than the viewport.
      const w = el.getBoundingClientRect().width
      if (!w) return
      const vw = window.innerWidth
      const px = Math.min(vw * 0.18, ((vw * 1.06) / w) * 100)
      setSize(`${px}px`)
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return { probe, size }
}

function HoldRing() {
  const { theme, setTheme } = useTheme()
  const [p, setP] = useState(0)
  const holding = useRef(false)
  const raf = useRef(0)
  const val = useRef(0)

  const run = () => {
    cancelAnimationFrame(raf.current)
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (holding.current) val.current = Math.min(1, val.current + dt / 900)
      else val.current = Math.max(0, val.current - dt / 450)
      setP(val.current)
      if (holding.current && val.current >= 1) {
        holding.current = false
        setTheme(theme === 'dream' ? 'day' : 'dream')
      }
      if (holding.current || val.current > 0) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  const start = () => {
    holding.current = true
    run()
  }
  const stop = () => {
    if (!holding.current) return
    holding.current = false
    run()
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const C = 2 * Math.PI * 25
  return (
    <button
      type="button"
      data-cursor="enter"
      aria-label="Hold to dream: press and hold to switch viewing mode"
      onPointerDown={(e) => (e.preventDefault(), start())}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault()
          start()
        }
      }}
      onKeyUp={stop}
      onContextMenu={(e) => e.preventDefault()}
      className="group flex touch-none select-none items-center gap-3 text-right"
    >
      <span className="micro leading-[1.35]">
        Hold
        <br />
        to dream
      </span>
      <svg viewBox="0 0 56 56" className="h-12 w-12 -rotate-90">
        <circle cx="28" cy="28" r="25" fill="none" stroke="var(--line)" strokeWidth="1" className="theme-t" />
        <circle
          cx="28"
          cy="28"
          r="25"
          fill="none"
          stroke="var(--action)"
          strokeWidth="2"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
          strokeLinecap="round"
        />
        <circle cx="28" cy="28" r={3 + p * 6} fill="var(--action)" opacity={0.15 + p * 0.85} />
      </svg>
    </button>
  )
}

export function Hero({ opened, reduced }: { opened: boolean; reduced: boolean }) {
  const section = useRef<HTMLElement>(null)
  const { probe, size } = useHeadlineSize()
  const [f, setF] = useState({ s: 0, t: 0, px: 0, py: 0 })
  const ptr = useRef({ x: 0, y: 0, sx: 0, sy: 0 })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ptr.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move)
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const vh = window.innerHeight
      const s = window.scrollY / vh
      const pr = ptr.current
      pr.sx += (pr.x - pr.sx) * 0.06
      pr.sy += (pr.y - pr.sy) * 0.06
      if (s < STORY + 1.2) setF({ s, t: (now - start) / 1000, px: pr.sx, py: pr.sy })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  const { s, t, px, py } = f
  const story = !reduced
  const fade = story ? range(s, 0, 1) : 0
  const dip = (c: number) => Math.max(0, 1 - Math.abs(s - c) / 0.24) * 0.78
  const open = story ? clamp(range(s, 0.35, 0.95) - dip(1.6) - dip(2.4)) : 0
  const seg = (k: number) => {
    const a = 0.8 + k * 0.8
    const b = a + 0.8
    const inn = range(s, a + 0.05, a + 0.3)
    const out = k === 2 ? 1 : 1 - range(s, b - 0.22, b - 0.02)
    return story ? clamp(Math.min(inn, out)) : 0
  }

  return (
    <section id="top" ref={section} className="relative" style={{ height: story ? `${(STORY + 1) * 100}vh` : '100vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* probe for headline sizing */}
        <span ref={probe} aria-hidden className="display pointer-events-none invisible absolute left-0 top-0 text-[100px]">
          {LINES[1]}
        </span>

        {/* Headline */}
        <h1
          className={`display absolute left-1/2 top-1/2 z-10 text-[var(--ink)] ${opened ? 'is-open' : ''}`}
          style={{
            fontSize: size,
            transform: `translate(-50%, calc(-54% - ${fade * 30}vh))`,
            opacity: 1 - fade,
          }}
        >
          {LINES.map((l, i) => (
            <span key={l} className="mask-line text-center">
              <span style={{ transitionDelay: `${i * 90}ms` }}>{l}</span>
            </span>
          ))}
        </h1>

        {/* Glow, light pool, stone, orbit */}
        <div
          className="absolute left-1/2 top-1/2 z-20"
          style={{
            width: 'min(46vh, 64vw)',
            height: 'min(46vh, 64vw)',
            transform: `translate(-50%, -50%) translate(${px * 8}px, ${py * 8}px)`,
            opacity: opened ? 1 : 0,
            transition: 'opacity 900ms var(--ease) 200ms',
          }}
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${22 + open * 26}%`,
              height: `${22 + open * 26}%`,
              background: 'radial-gradient(circle, rgba(155,123,242,0.55) 0%, rgba(155,123,242,0.18) 45%, rgba(155,123,242,0) 70%)',
              opacity: 0.25 + open * 0.75,
              filter: 'blur(8px)',
            }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[88%] h-[22%] w-[130%] -translate-x-1/2 rounded-[50%]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0) 70%)',
              opacity: 1 - open * 0.5,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ clipPath: STONE_CLIP, backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', opacity: clamp(1 - open * 4) }}
          />
          <GlassStone open={open} t={t} px={px} py={py} className="relative h-full w-full drop-shadow-[0_24px_40px_rgba(34,34,34,0.12)]" />
          <svg
            aria-hidden
            viewBox="-200 -200 400 400"
            className={`pointer-events-none absolute inset-[-24%] h-[148%] w-[148%] ${reduced ? '' : 'orbit'}`}
            style={{ opacity: 1 - open }}
          >
            <defs>
              <path id="orbit-path" d="M 0,-180 a 180,180 0 1,1 0,360 a 180,180 0 1,1 0,-360" />
            </defs>
            <text fill="var(--meta)" style={{ fontFamily: 'var(--font-mono)', fontSize: 7.6, letterSpacing: '0.3em' }}>
              <textPath href="#orbit-path">{'FRANCIS EMMANUEL M. CARIÑO · 2026 · '.repeat(4)}</textPath>
            </text>
          </svg>
        </div>

        {/* Project names over the shards */}
        {story &&
          PROJECTS.map((p, k) => {
            const o = seg(k)
            if (o <= 0.001) return null
            return (
              <div
                key={p.id}
                className="absolute inset-x-5 top-1/2 z-30 flex items-center justify-center gap-6 md:inset-x-10"
                style={{ opacity: o, transform: `translateY(calc(-50% + ${(1 - o) * 18}px))` }}
              >
                <div className="text-center">
                  <p className="idx mb-3">({String(k + 1).padStart(2, '0')})</p>
                  <h2 className="tracked text-[clamp(28px,6vw,96px)] font-semibold leading-none tracking-[0.14em] text-[var(--ink)]">{p.name}</h2>
                  <p className="mt-4 text-[15px] text-[var(--ink-2)]">{p.kind}</p>
                </div>
                <button
                  type="button"
                  data-cursor="view"
                  onClick={() => scrollToId(`case-${p.id}`)}
                  className="micro hidden shrink-0 rounded-full bg-[var(--action)] px-5 py-3 text-white transition-colors hover:bg-[var(--action-hover)] active:bg-[var(--action-press)] sm:block"
                  style={{ pointerEvents: o > 0.5 ? 'auto' : 'none' }}
                >
                  View project
                </button>
              </div>
            )
          })}

        {/* Lower labels */}
        <div
          className="absolute inset-x-5 bottom-20 z-40 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-10"
          style={{ opacity: opened ? 1 - fade * 1.4 : 0, transition: 'opacity 700ms var(--ease)', pointerEvents: fade > 0.6 ? 'none' : 'auto' }}
        >
          <div className="micro space-y-4 tracking-[0.18em] text-[var(--ink)]">
            <p>Web and interactive designer</p>
            <p className="text-[var(--ink-2)]">
              Web · Motion
              <br />
              Interaction · 3D · UI/UX
            </p>
          </div>
          <div className="flex flex-col items-end gap-5">
            <HoldRing />
            <p className="micro flex items-center gap-2 text-[var(--ink-2)]">
              <span aria-hidden className="breathe inline-block h-1.5 w-1.5 rounded-full bg-[var(--action)]" />
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
