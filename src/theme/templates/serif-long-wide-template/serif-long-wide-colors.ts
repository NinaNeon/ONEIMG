import type { ThemeConfig } from '@/types'

const PAPER = '#fcfcf9'
const PAPER_SOFT = '#f4f2ec'
const INK = '#15171a'
const INK_DIM = '#5a5d63'
const RULE = '#d8d5cf'

function createWideTheme(accentColor: string): ThemeConfig {
  return {
    hero: {
      container: { background: PAPER, foreground: INK },
      title: { background: 'transparent', foreground: accentColor },
      content: { background: 'transparent', foreground: INK_DIM },
    },
    main: {
      container: {
        background: PAPER,
        backgroundEven: PAPER,
        backgroundOdd: PAPER,
        foreground: INK,
      },
      title: { background: 'transparent', foreground: accentColor },
      content: {
        background: 'transparent',
        foreground: INK,
        secondaryBackground: PAPER_SOFT,
        rule: RULE,
        dim: INK_DIM,
        accent: accentColor,
      },
    },
    sub: {
      container: { background: 'transparent' },
      title: { foreground: accentColor },
      content: { foreground: INK },
    },
  }
}

export const serifWideInk = createWideTheme('#15171a')
export const serifWideStone = createWideTheme('#2a2c30')
export const serifWideSteel = createWideTheme('#6b7a8f')
export const serifWideBronze = createWideTheme('#a08866')
export const serifWideVermilion = createWideTheme('#7a1e22')
export const serifWideViolet = createWideTheme('#9c8cb8')
export const serifWideHoly = createWideTheme('#4a5d7a')
