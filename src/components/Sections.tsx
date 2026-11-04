import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Still } from './Still'
import { PROJECTS, pad } from '../data'
import { scrollToId, scrollToY } from '../lib/motion'
import { useTheme } from '../theme'

function Head({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="idx">({n})</span>
      <span className="micro tracking-[0.18em] text-[var(--ink)]">{label}</span>
    </div>
  )
}

function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`theme-t relative z-10 border-t border-[var(--line)] px-5 py-24 md:px-10 md:py-36 ${className}`}>
      {children}
    </section>
  )
}

const Arrow = () => (
  <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
)

export function About() {
  return (
    <Section id="about">
      <Head n="01" label="About" />
      <p className="tracked mt-14 text-[clamp(22px,3.6vw,56px)] font-semibold leading-[1.12] tracking-[0.12em] text-[var(--ink)] md:mt-20">
        <span className="block">I design and build websites</span>
        <span className="block">that stay in the mind</span>
        <span className="block">
          like a{' '}
          <em className="font-serif text-[1.15em] font-normal normal-case tracking-[0] text-[var(--action)]">memory</em>, where web,
        </span>
        <span className="block">3D, motion and interaction</span>
        <span className="block">become one experience.</span>
      </p>
      <div className="mt-16 grid md:grid-cols-6">
        <p className="body-copy md:col-span-3 md:col-start-4">
          Francis Emmanuel M. Cariño works across web design, UI/UX, 3D, interaction, and motion. The aim is a site that is clear to use and hard to
          forget.
        </p>
      </div>
    </Section>
  )
}

const DISCIPLINES = [
  ['Web design', 'Pages with a point of view.'],
  ['UI / UX', 'A path you can feel.'],
  ['3D', 'Light, glass, and weight.'],
  ['Interaction', 'A page that answers.'],
  ['Motion', 'Time, used with care.'],
  ['Logo and graphic', 'A mark that can hold a site.'],
]

export function Disciplines() {
  return (
    <Section id="disciplines">
      <Head n="02" label="Disciplines" />
      <ul className="mt-14 border-b border-[var(--line)] md:mt-20">
        {DISCIPLINES.map(([name, tag], i) => (
          <li key={name} tabIndex={0} className="row theme-t relative grid grid-cols-[3rem_1fr] items-baseline gap-y-2 border-t border-[var(--line)] py-6 outline-none md:grid-cols-6 md:py-8">
            <span aria-hidden className="row-line absolute left-0 top-[-1px] h-px w-full bg-[var(--action)]" />
            <span className="idx">({pad(i + 1)})</span>
            <span className="row-name tracked text-[clamp(18px,2.2vw,32px)] font-semibold leading-none text-[var(--ink)] md:col-span-3">{name}</span>
            <span className="col-start-2 text-[15px] text-[var(--ink-2)] md:col-span-2 md:col-start-5">{tag}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Works() {
  const [current, setCurrent] = useState(0)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rows.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <Section id="works">
      <div className="flex items-baseline justify-between">
        <Head n="03" label="Selected works" />
        <p className="idx" aria-live="polite">
          <span className="text-[var(--ink)]">{pad(current + 1)}</span> / {pad(PROJECTS.length)}
        </p>
      </div>
      <ul className="mt-14 border-b border-[var(--line)] md:mt-20">
        {PROJECTS.map((p, i) => (
          <li key={p.id} data-i={i} ref={(el) => void (rows.current[i] = el)} className="work-row theme-t relative border-t border-[var(--line)]">
            <button
              type="button"
              data-cursor="view"
              onClick={() => scrollToId(`case-${p.id}`)}
              className="row grid w-full grid-cols-[2.5rem_1fr] items-center gap-y-4 py-10 text-left md:grid-cols-6 md:py-14"
            >
              <span aria-hidden className="row-line absolute left-0 top-[-1px] h-px w-full bg-[var(--action)]" />
              <span className="idx">{pad(i + 1)}</span>
              <span className="row-name tracked text-[clamp(26px,4.4vw,68px)] font-semibold leading-none tracking-[0.12em] text-[var(--ink)] md:col-span-3">
                {p.name}
              </span>
              <span className="col-start-2 font-mono text-[12px] uppercase leading-[1.6] tracking-[0.04em] text-[var(--ink-2)] md:col-span-1 md:col-start-5">
                {p.role}
                <br />
                {p.year}
              </span>
              <span className="micro col-start-2 flex items-center gap-2 text-[var(--action)] md:col-start-6 md:justify-end">
                Open the memory <Arrow />
              </span>
            </button>
            <div aria-hidden className="reveal-still pointer-events-none absolute right-[18%] top-1/2 z-20 hidden w-[22vw] max-w-[320px] -translate-y-1/2 lg:block">
              <Still index={i} kind="a" className="aspect-[4/3] w-full shadow-[0_24px_60px_rgba(34,34,34,0.18)]" />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function DreamMode() {
  const { theme, setTheme } = useTheme()
  const dream = theme === 'dream'
  return (
    <Section id="dream">
      <Head n="04" label="Dream mode" />
      <p className="tracked mt-14 text-[clamp(22px,3.6vw,56px)] font-semibold leading-[1.12] tracking-[0.12em] text-[var(--ink)] md:mt-20">
        <span className="block">There is another way</span>
        <span className="block">to see this archive.</span>
      </p>
      <button
        type="button"
        data-cursor="enter"
        onClick={() => setTheme('dream')}
        aria-pressed={dream}
        className="micro mt-10 inline-flex items-center gap-2 text-[var(--link)] hover:text-[var(--link-hover)]"
      >
        Enter the dream <Arrow />
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[var(--ease)]"
        style={{ gridTemplateRows: dream ? '1fr' : '0fr', opacity: dream ? 1 : 0 }}
        aria-hidden={!dream}
      >
        <div className="overflow-hidden">
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <li key={p.id}>
                <button type="button" tabIndex={dream ? 0 : -1} data-cursor="view" onClick={() => scrollToId(`case-${p.id}`)} className="group block w-full text-left">
                  <Still index={i} kind="a" dark className="aspect-[4/5] w-full transition-opacity duration-300 group-hover:opacity-80" />
                  <span className="mt-4 flex items-baseline justify-between">
                    <span className="tracked text-[13px] font-semibold text-[var(--ink)]">{p.name}</span>
                    <span className="idx">{pad(i + 1)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 pb-1">
            <p className="micro tracking-[0.18em] text-[var(--ink-2)]">Three projects sit in the dark. Bring them back.</p>
            <button
              type="button"
              tabIndex={dream ? 0 : -1}
              data-cursor="enter"
              aria-label="Enter: return to day"
              onClick={() => setTheme('day')}
              className="micro rounded-full bg-[var(--action)] px-6 py-3 text-white transition-colors hover:bg-[var(--action-hover)] active:bg-[var(--action-press)]"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Recognition() {
  return (
    <Section id="recognition">
      <Head n="05" label="Recognition" />
      <div className="mt-10 grid gap-10 md:grid-cols-6">
        <p className="display -ml-[0.05em] text-[clamp(160px,26vw,420px)] text-[var(--ink)] md:col-span-6" aria-label="Zero awards on file">
          00
        </p>
        <div className="md:col-span-4 md:col-start-3">
          <div className="idx grid grid-cols-[4rem_1fr_1fr_1fr] gap-4 border-b border-[var(--line)] pb-3 uppercase">
            <span>Year</span>
            <span>Project</span>
            <span>Venue</span>
            <span>Title</span>
          </div>
          <div className="idx grid grid-cols-[4rem_1fr_1fr_1fr] gap-4 border-b border-[var(--line)] py-4 text-[var(--muted)]" aria-hidden>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
          </div>
          <p className="body-copy mt-6">Awards will be listed here.</p>
        </div>
      </div>
    </Section>
  )
}

export function Contact() {
  const { setTheme } = useTheme()
  return (
    <section id="contact" className="theme-t relative z-10 border-t border-[var(--line)] pt-24 md:pt-36">
      <div className="px-5 md:px-10">
        <Head n="06" label="Contact" />
      </div>
      <h2 className="display mt-12 overflow-hidden pl-5 text-[34vw] uppercase text-[var(--ink)] md:pl-10">
        <span className="block">Say</span>
        <span className="block">Hello.</span>
      </h2>
      <div className="mt-14 grid gap-12 px-5 md:grid-cols-6 md:px-10">
        <div className="md:col-span-3">
          <a
            role="link"
            aria-disabled="true"
            data-cursor="open"
            className="inline-flex items-center gap-3 text-[clamp(22px,2.4vw,34px)] font-medium tracking-[-0.02em] text-[var(--link)] underline decoration-1 underline-offset-[6px]"
          >
            Send a note
          </a>
          <p className="idx mt-3">NO ADDRESS ON FILE YET</p>
        </div>
        <div className="md:col-span-2 md:col-start-5">
          <p className="micro tracking-[0.18em] text-[var(--ink)]">Elsewhere</p>
          <p className="idx mt-3 text-[var(--muted)]">—</p>
        </div>
      </div>
      <div className="mt-24 px-5 md:px-10">
        <button type="button" data-cursor="enter" onClick={() => setTheme('dream')} className="micro tracking-[0.18em] text-[var(--ink)] hover:text-[var(--action)]">
          Still awake? <span className="text-[var(--action)]">Enter the dream</span>
        </button>
      </div>
      <footer className="mt-16 flex items-center justify-between border-t border-[var(--line)] px-5 pb-24 pt-6 md:px-10 md:pb-24">
        <p className="micro text-[var(--ink-2)]">© 2026 Francis Emmanuel M. Cariño</p>
        <button type="button" data-cursor="enter" onClick={() => scrollToY(0, 800)} className="micro hover:text-[var(--action)]">
          Back to top
        </button>
      </footer>
    </section>
  )
}
