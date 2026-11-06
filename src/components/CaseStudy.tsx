import { Shard } from './Glass'
import { Still } from './Still'
import { PROJECTS, pad } from '../data'
import { scrollToId, scrollToY } from '../lib/motion'

export function CaseStudy({ index }: { index: number }) {
  const p = PROJECTS[index]
  const nextIndex = (index + 1) % PROJECTS.length
  const next = PROJECTS[nextIndex]
  const total = pad(PROJECTS.length)

  return (
    <section id={`case-${p.id}`} aria-labelledby={`case-${p.id}-title`} className="relative z-10 border-t border-[var(--line)] pb-10 pt-28 theme-t md:pt-32">
      <div className="px-5 md:px-10">
        <div className="flex items-start justify-between">
          <button type="button" data-cursor="enter" onClick={() => scrollToY(0)} className="micro group text-left">
            Back to top
            <span className="mt-2 block h-px w-8 bg-[var(--ink)] transition-[width] duration-300 ease-[var(--ease)] group-hover:w-14" />
          </button>
          <p className="idx">
            (CASE STUDY) <span className="text-[var(--ink)]">{pad(index + 1)}</span> / {total}
          </p>
        </div>

        <div className="relative mx-auto mt-14 md:w-4/6">
          <Still index={index} kind="a" className="aspect-[16/10] w-full" />
          <Shard variant={index} className="float-a absolute -left-8 -top-10 h-20 w-20 md:-left-16 md:h-28 md:w-28" />
          <Shard variant={index + 1} className="float-b absolute -bottom-10 -right-6 h-16 w-16 md:-right-14 md:h-24 md:w-24" />
          <Shard variant={index + 2} className="float-a absolute -right-4 top-1/4 hidden h-10 w-10 md:block" />
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden md:mt-20">
        <h2 id={`case-${p.id}-title`} className="display fringe -ml-[0.04em] pl-5 text-[14vw] uppercase text-[var(--ink)] md:pl-10">
          {p.name}
        </h2>
        <button
          type="button"
          data-cursor="open"
          onClick={() => scrollToId(`case-${p.id}-card`, 900)}
          aria-label={`Open ${p.name} details`}
          className="micro absolute left-[58%] top-1/2 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full bg-[#222222] text-white transition-colors duration-300 hover:bg-[var(--action)] active:bg-[var(--action-press)] md:h-28 md:w-28"
        >
          Open
        </button>
      </div>

      <div className="px-5 md:px-10">
        <div
          id={`case-${p.id}-card`}
          className="theme-t mt-12 grid gap-10 border border-[var(--line)] bg-[var(--card)] p-6 md:grid-cols-6 md:p-10"
        >
          <div className="md:col-span-4">
            <p className="micro tracking-[0.18em] text-[var(--ink-2)]">About the project</p>
            <p className="mt-6 max-w-[24ch] text-[clamp(24px,2.8vw,40px)] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">{p.line}</p>
            <p className="idx mt-10">
              LINK <span className="mx-2">—</span> <span className="text-[var(--muted)]">Live link to follow</span>
            </p>
          </div>
          <dl className="space-y-6 md:col-span-2">
            {[
              ['Kind', p.kind],
              ['Year', p.year],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-[var(--line)] pt-3">
                <dt className="micro text-[var(--muted)]">{k}</dt>
                <dd className={`mt-2 text-[16px] leading-[1.5] text-[var(--body)] ${k === 'Year' ? 'font-mono tracking-[0.04em]' : ''}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Still index={index} kind="b" className="mt-6 aspect-[16/8] w-full" />
      </div>

      <button
        type="button"
        data-cursor="view"
        onClick={() => scrollToId(`case-${next.id}`)}
        className="group mt-20 block w-full overflow-hidden text-left"
        aria-label={`Next project: ${next.name}`}
      >
        <div className="flex justify-between px-5 md:px-10">
          <span className="idx">(NEXT PROJECT)</span>
          <span className="idx">
            {pad(nextIndex + 1)} / {total}
          </span>
        </div>
        <span className="display fringe mt-6 block pl-5 text-[14vw] uppercase text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--action)] md:pl-10">
          {next.name}
        </span>
      </button>
    </section>
  )
}
