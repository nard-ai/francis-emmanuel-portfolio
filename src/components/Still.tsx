import { GlassStone } from './Glass'
import { PROJECTS, pad } from '../data'

type Props = { index: number; kind?: 'a' | 'b'; dark?: boolean; className?: string }

/** Original flat-color stills: color fields, one large letter or a glass shape. */
export function Still({ index, kind = 'a', dark = false, className = '' }: Props) {
  const p = PROJECTS[index]
  const key = `${index}${kind}`
  const base: Record<string, { bg: string; fg: string; glass?: boolean; frame?: boolean }> = {
    '0a': { bg: '#222222', fg: '#F7F7F7', glass: true },
    '0b': { bg: '#E1E1E1', fg: '#222222' },
    '1a': { bg: '#E1E1E1', fg: '#222222' },
    '1b': { bg: '#222222', fg: '#F7F7F7', frame: true },
    '2a': { bg: '#FFEFE6', fg: '#C65D21' },
    '2b': { bg: '#FFEFE6', fg: '#222222', frame: true },
  }
  const s = dark ? { ...base[key], bg: '#222222', fg: '#626262' } : base[key]
  return (
    <div
      className={`relative overflow-hidden ${dark ? 'border border-[#626262]' : ''} ${className}`}
      style={{ background: s.bg, color: s.fg }}
      role="img"
      aria-label={`${p.name} still`}
    >
      {s.glass ? (
        <>
          <div
            className="absolute left-1/2 top-[64%] h-[18%] w-[56%] -translate-x-1/2 rounded-[50%]"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.35), rgba(255,255,255,0) 70%)', opacity: dark ? 0.3 : 1 }}
          />
          <GlassStone className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2" open={0} />
        </>
      ) : s.frame ? (
        <>
          <div className="absolute inset-[14%] border" style={{ borderColor: s.fg, opacity: 0.35 }} />
          <div
            className="absolute left-1/2 top-[14%] h-[60%] w-[34%] -translate-x-1/2"
            style={{
              background: `radial-gradient(ellipse at top, ${dark ? 'rgba(158,158,158,0.25)' : 'rgba(255,255,255,0.55)'}, rgba(255,255,255,0) 70%)`,
            }}
          />
          <span className="display absolute bottom-[18%] left-1/2 -translate-x-1/2 text-[clamp(40px,8vw,120px)]">{p.letter}</span>
        </>
      ) : (
        <span className="display absolute -bottom-[0.12em] left-[6%] text-[clamp(160px,34vw,520px)]">{kind === 'a' ? p.letter : p.letter.toLowerCase()}</span>
      )}
      <span className="idx absolute left-4 top-4" style={{ color: s.fg, opacity: 0.7 }}>
        ({pad(index + 1)}) {p.name.toUpperCase()}
      </span>
      <span className="idx absolute bottom-4 right-4" style={{ color: s.fg, opacity: 0.7 }}>
        {kind === 'a' ? 'FIG. A' : 'FIG. B'}
      </span>
    </div>
  )
}
