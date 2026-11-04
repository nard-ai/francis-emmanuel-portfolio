import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Solver for cubic-bezier(x1, y1, x2, y2) timing curves. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t
  const sy = (t: number) => ((ay * t + by) * t + cy) * t
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x
      const d = dx(t)
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break
      t -= e / d
    }
    return sy(Math.min(1, Math.max(0, t)))
  }
}

export const easeExpo = bezier(0.16, 1, 0.3, 1)

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a))

/* ---------- Smoothed scroll (wheel only, native for touch/keys) ---------- */

let target = 0
let current = 0
let raf = 0
let animating = false
let tween: { from: number; to: number; start: number; dur: number } | null = null

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

function loop(now: number) {
  if (tween) {
    const p = clamp((now - tween.start) / tween.dur)
    current = tween.from + (tween.to - tween.from) * easeExpo(p)
    window.scrollTo(0, current)
    if (p >= 1) {
      tween = null
      target = current
    }
  } else {
    current += (target - current) * 0.11
    if (Math.abs(target - current) < 0.4) current = target
    window.scrollTo(0, current)
  }
  if (tween || current !== target) raf = requestAnimationFrame(loop)
  else animating = false
}

function kick() {
  if (!animating) {
    animating = true
    raf = requestAnimationFrame(loop)
  }
}

export function initSmoothScroll() {
  target = current = window.scrollY
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    tween = null
    if (!animating) current = window.scrollY
    const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY
    target = clamp(target + delta, 0, maxScroll())
    kick()
  }
  const onScroll = () => {
    if (!animating) target = current = window.scrollY
  }
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
    animating = false
  }
}

/** Eased scroll to a y position, using the site curve. */
export function scrollToY(y: number, dur = 800) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const to = clamp(y, 0, maxScroll())
  if (reduced) {
    window.scrollTo(0, to)
    target = current = to
    return
  }
  current = window.scrollY
  tween = { from: current, to, start: performance.now(), dur }
  target = to
  kick()
}

export function scrollToId(id: string, dur = 1100) {
  const el = document.getElementById(id)
  if (!el) return
  scrollToY(el.getBoundingClientRect().top + window.scrollY, dur)
}
