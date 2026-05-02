import type { ThemeConfig } from '@/types'

const PAPER = '#fcfcf9'
const PAPER_SOFT = '#f4f2ec'
const INK = '#15171a'
const INK_DIM = '#5a5d63'
const RULE = '#d8d5cf'

/**
 * 與 page-style 同樣 7 色, 但 label 加 frame_ 前綴
 * 邊框實際上是由 PagedCard 用 inline style 套, 從 themeStore.theme 拿到 label
 * 然後查 PAGE_BORDER_COLOR_BY_HUE 對應到色號
 */
function createFrameTheme(accent: string): ThemeConfig {
  return {
    hero: {
      container: {
        background: PAPER,
        foreground: INK,
        borderColor: accent,
      },
      title: { background: 'transparent', foreground: INK, accent },
      content: { background: 'transparent', foreground: INK_DIM },
    },
    main: {
      container: {
        background: PAPER,
        backgroundEven: PAPER,
        backgroundOdd: PAPER,
        foreground: INK,
        borderColor: accent,
      },
      title: { background: 'transparent', foreground: INK, accent },
      content: {
        background: 'transparent',
        foreground: INK,
        secondaryBackground: PAPER_SOFT,
        rule: RULE,
        dim: INK_DIM,
        accent,
      },
    },
    sub: {
      container: { background: 'transparent' },
      title: { foreground: accent },
      content: { foreground: INK },
    },
  }
}

export const frameInk = createFrameTheme('#15171a')
export const frameStone = createFrameTheme('#2a2c30')
export const frameSteel = createFrameTheme('#6b7a8f')
export const frameBronze = createFrameTheme('#a08866')
export const frameVermilion = createFrameTheme('#7a1e22')
export const frameViolet = createFrameTheme('#9c8cb8')
export const frameHoly = createFrameTheme('#4a5d7a')
