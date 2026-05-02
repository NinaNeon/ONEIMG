import type { ThemeConfig } from '@/types'

const PAPER = '#fcfcf9'
const PAPER_SOFT = '#f4f2ec'
const INK = '#15171a'
const INK_DIM = '#5a5d63'
const RULE = '#d8d5cf'

function createSerifLongTheme(accentColor: string): ThemeConfig {
  return {
    hero: {
      container: {
        background: PAPER,
        foreground: INK,
      },
      title: {
        background: 'transparent',
        foreground: accentColor, // 標題用色票色
      },
      content: {
        background: 'transparent',
        foreground: INK_DIM,
      },
    },
    main: {
      container: {
        background: PAPER,
        backgroundEven: PAPER,
        backgroundOdd: PAPER,
        foreground: INK,
      },
      title: {
        background: 'transparent',
        foreground: accentColor, // 章節標題也用色票色
      },
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

export const serifLongInk = createSerifLongTheme('#15171a')
export const serifLongStone = createSerifLongTheme('#2a2c30')
export const serifLongSteel = createSerifLongTheme('#6b7a8f')
export const serifLongBronze = createSerifLongTheme('#a08866')
export const serifLongVermilion = createSerifLongTheme('#7a1e22')
export const serifLongViolet = createSerifLongTheme('#9c8cb8')
export const serifLongHoly = createSerifLongTheme('#4a5d7a')
