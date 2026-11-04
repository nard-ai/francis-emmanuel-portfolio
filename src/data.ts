export type Project = {
  id: string
  name: string
  kind: string
  role: string
  year: string
  built: string
  line: string
  letter: string
}

export const PROJECTS: Project[] = [
  {
    id: 'glass-archive',
    name: 'Glass Archive',
    kind: 'Portfolio site',
    role: 'Web design, 3D, motion, interaction',
    year: '2026',
    built: 'Layout, motion, and a glass scene',
    line: 'A personal archive held inside a piece of glass.',
    letter: 'G',
  },
  {
    id: 'quiet-room',
    name: 'Quiet Room',
    kind: 'Gallery site',
    role: 'Web design, identity, image, 3D',
    year: '2025',
    built: 'Layout and a dark gallery',
    line: 'A quiet room for pictures, with one light and a lot of space.',
    letter: 'Q',
  },
  {
    id: 'first-frame',
    name: 'First Frame',
    kind: 'First portfolio',
    role: 'Web design, identity, development',
    year: '2025',
    built: 'Type and a single scrolling page',
    line: 'The first frame of this practice, kept simple on purpose.',
    letter: 'F',
  },
]

export const pad = (n: number) => String(n).padStart(2, '0')
