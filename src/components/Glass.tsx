import { useId } from 'react'

type P = [number, number]

// Irregular outline of an original stone, in a -200..200 box.
const OUT: P[] = [
  [-24, -156],
  [74, -134],
  [144, -62],
  [160, 26],
  [116, 116],
  [22, 154],
  [-76, 138],
  [-146, 66],
  [-160, -26],
  [-112, -116],
]
const C: P = [6, -6]
const K = [0.48, 0.55, 0.44, 0.52, 0.58, 0.46, 0.53, 0.42, 0.5, 0.56]
const IN: P[] = OUT.map(([x, y], i) => [C[0] + (x - C[0]) * K[i], C[1] + (y - C[1]) * K[i]])

function rand(seed: number) {
  const x = Math.sin(seed * 9301.17 + 49297.3) * 233280
  return x - Math.floor(x)
}

type Shard = {
  pts: P[]
  g: P
  dir: P
  dist: number
  rot: number
  depth: number
  ph: number
  sp: number
}

const SHARDS: Shard[] = (() => {
  const list: P[][] = []
  for (let i = 0; i < OUT.length; i++) {
    const j = (i + 1) % OUT.length
    list.push([C, IN[i], IN[j]])
    list.push([IN[i], OUT[i], OUT[j], IN[j]])
  }
  return list.map((pts, k) => {
    const g: P = [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length]
    const dx = g[0] - C[0],
      dy = g[1] - C[1]
    const len = Math.hypot(dx, dy) || 1
    const outer = pts.length === 4
    return {
      pts,
      g,
      dir: [dx / len, dy / len],
      dist: (outer ? 120 : 64) + rand(k + 1) * 80,
      rot: (rand(k + 7) - 0.5) * 80,
      depth: 0.4 + rand(k + 3),
      ph: rand(k + 11) * Math.PI * 2,
      sp: 0.35 + rand(k + 5) * 0.5,
    }
  })
})()

const ptsStr = (pts: P[]) => pts.map((p) => p.join(',')).join(' ')

/** CSS clip-path polygon matching the whole stone, for a frosted backdrop. */
export const STONE_CLIP = `polygon(${OUT.map(([x, y]) => `${(x + 200) / 4}% ${(y + 200) / 4}%`).join(', ')})`

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-fill`} cx="38%" cy="30%" r="75%">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
        <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="0.8" stopColor="#e1e1e1" stopOpacity="0.38" />
        <stop offset="1" stopColor="#9e9e9e" stopOpacity="0.32" />
      </radialGradient>
      <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.46" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.75" />
        <stop offset="0.56" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e1e1e1" />
      </linearGradient>
      <linearGradient id={`${id}-rainbow`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff5470" />
        <stop offset="0.3" stopColor="#ffd166" />
        <stop offset="0.6" stopColor="#6fe3f5" />
        <stop offset="1" stopColor="#9b7bf2" />
      </linearGradient>
    </defs>
  )
}

function Inner({ id }: { id: string }) {
  return (
    <>
      <rect x="-200" y="-200" width="400" height="400" fill={`url(#${id}-fill)`} />
      {/* folded white shape held inside */}
      <g transform="rotate(-8)">
        <polygon points="-64,-28 6,-60 22,8 -42,30" fill="#ffffff" />
        <polygon points="6,-60 66,-10 42,52 22,8" fill={`url(#${id}-fold)`} />
        <polygon points="-42,30 22,8 42,52 -16,68" fill="#f7f7f7" opacity="0.92" />
        <polyline points="6,-60 22,8 42,52" fill="none" stroke="#e1e1e1" strokeWidth="1" />
      </g>
      <rect x="-200" y="-200" width="400" height="400" fill={`url(#${id}-sheen)`} opacity="0.8" />
      <path d="M-120,-60 Q-40,-120 60,-118" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
}

type Props = {
  open?: number
  t?: number
  px?: number
  py?: number
  className?: string
}

/** The original glass stone. `open` 0..1 cracks it into drifting shards. */
export function GlassStone({ open = 0, t = 0, px = 0, py = 0, className }: Props) {
  const id = useId().replace(/:/g, '')
  const crack = Math.min(1, open * 4)
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <Defs id={id} />
      {/* Whole stone under the shards hides clip seams while closed */}
      {crack < 1 && (
        <g opacity={1 - crack}>
          <clipPath id={`${id}-whole`}>
            <polygon points={ptsStr(OUT)} />
          </clipPath>
          <g clipPath={`url(#${id}-whole)`}>
            <Inner id={id} />
          </g>
        </g>
      )}
      {SHARDS.map((s, k) => {
        const o = open
        const dx = s.dir[0] * s.dist * o + Math.sin(t * s.sp + s.ph) * 10 * o + px * s.depth * 16 * o
        const dy = s.dir[1] * s.dist * o + Math.cos(t * s.sp * 0.8 + s.ph) * 8 * o + py * s.depth * 16 * o
        const r = s.rot * o + Math.sin(t * s.sp * 0.5 + s.ph) * 14 * o
        const glint = o * (0.5 + 0.5 * Math.sin(t * 0.9 + s.ph + r * 0.06)) * 0.55
        const poly = ptsStr(s.pts)
        return (
          <g key={k} opacity={crack > 0 ? 1 : 0} transform={`translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${r.toFixed(2)} ${s.g[0]} ${s.g[1]})`}>
            <clipPath id={`${id}-c${k}`}>
              <polygon points={poly} />
            </clipPath>
            <g clipPath={`url(#${id}-c${k})`}>
              <Inner id={id} />
              {glint > 0.01 && <polygon points={poly} fill="#ffffff" opacity={glint} />}
            </g>
            {crack > 0 && (
              <>
                <polygon points={poly} fill="none" stroke="#ffffff" strokeOpacity={0.9 * crack} strokeWidth="1" />
                <polygon
                  points={poly}
                  fill="none"
                  stroke={`url(#${id}-rainbow)`}
                  strokeOpacity={0.7 * crack}
                  strokeWidth="1"
                  transform="translate(0.8 0.4)"
                />
              </>
            )}
          </g>
        )
      })}
      {crack < 1 && (
        <g opacity={1 - crack}>
          <polygon points={ptsStr(OUT)} fill="none" stroke={`url(#${id}-rainbow)`} strokeWidth="1.5" transform="translate(1.2 0.6)" />
          <polygon points={ptsStr(OUT)} fill="none" stroke="#ffffff" strokeOpacity="0.95" strokeWidth="1.2" />
        </g>
      )}
    </svg>
  )
}

/** A single small shard used around stills. */
export function Shard({ className, variant = 0 }: { className?: string; variant?: number }) {
  const id = useId().replace(/:/g, '')
  const shapes = ['-60,-70 70,-40 30,80 -50,40', '-40,-80 60,-20 10,70 -70,10', '-70,-30 20,-80 70,30 -10,70']
  const poly = shapes[variant % shapes.length]
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <Defs id={id} />
      <clipPath id={`${id}-c`}>
        <polygon points={poly} />
      </clipPath>
      <g clipPath={`url(#${id}-c)`}>
        <rect x="-100" y="-100" width="200" height="200" fill={`url(#${id}-fill)`} />
        <rect x="-100" y="-100" width="200" height="200" fill={`url(#${id}-sheen)`} />
      </g>
      <polygon points={poly} fill="none" stroke={`url(#${id}-rainbow)`} strokeWidth="1.2" transform="translate(1 0.5)" />
      <polygon points={poly} fill="none" stroke="#ffffff" strokeWidth="1" />
    </svg>
  )
}
