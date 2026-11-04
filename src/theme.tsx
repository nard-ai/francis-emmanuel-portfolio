import { createContext, useContext } from 'react'

export type Theme = 'day' | 'dream'
export const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'day',
  setTheme: () => {},
})
export const useTheme = () => useContext(ThemeCtx)
