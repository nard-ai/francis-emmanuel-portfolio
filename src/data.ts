export type Project = {
  id: string
  name: string
  kind: string
  year: string
  line: string
  letter: string
}

export const PROJECTS: Project[] = [
  {
    id: 'glass-archive',
    name: 'Glass Archive',
    kind: 'Portfolio site',
    year: '2026',
    line: 'A personal archive held inside a piece of glass.',
    letter: 'G',
  },
  {
    id: 'quiet-room',
    name: 'Quiet Room',
    kind: 'Gallery site',
    year: '2025',
    line: 'A quiet room for pictures, with one light and a lot of space.',
    letter: 'Q',
  },
  {
    id: 'first-frame',
    name: 'First Frame',
    kind: 'First portfolio',
    year: '2025',
    line: 'The first frame of this practice, kept simple on purpose.',
    letter: 'F',
  },
]

export const pad = (n: number) => String(n).padStart(2, '0')
