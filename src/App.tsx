import { useCallback, useEffect, useState } from 'react'
import { CaseStudy } from './components/CaseStudy'
import { Cursor, Frame, Loader, Nav, ThemePill } from './components/Chrome'
import { Hero } from './components/Hero'
import { About, Contact, Disciplines, DreamMode, Recognition, Works } from './components/Sections'
import { PROJECTS } from './data'
import { initSmoothScroll, useReducedMotion } from './lib/motion'
import { ThemeCtx, type Theme } from './theme'

export default function App() {
  const reduced = useReducedMotion()
  const [opened, setOpened] = useState(false)
  const [theme, setTheme] = useState<Theme>('day')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return initSmoothScroll()
  }, [])

  const onLoaded = useCallback(() => setOpened(true), [])

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      <Frame />
      <Loader reduced={reduced} onDone={onLoaded} />
      <Nav />
      <Cursor />
      <main className="relative">
        <Hero opened={opened || reduced} reduced={reduced} />
        {PROJECTS.map((p, i) => (
          <CaseStudy key={p.id} index={i} />
        ))}
        <About />
        <Disciplines />
        <Works />
        <DreamMode />
        <Recognition />
        <Contact />
      </main>
      <ThemePill />
    </ThemeCtx.Provider>
  )
}
