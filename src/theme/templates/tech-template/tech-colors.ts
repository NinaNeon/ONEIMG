import type { ThemeConfig } from '@/types'

/**
 * 简约科技风格 色票 (改版)
 *
 * 移除:
 *   - hero backgroundImage (底圖)
 *   - main title backgroundImage (linear-gradient 襯底)
 *   - sub title backgroundImage
 *
 * 改用使用者色票:
 *   - tech_blue (色塊維持藍以保持向後相容) → 鈷藍 holy #4a5d7a
 *   - vibrant_orange → 古銅 bronze #a08866
 *   - rose_red → 殷紅 vermilion #7a1e22
 *
 * 風格: 容器淡色底 + 內容卡紙白底 + 標題純色 (不再有色塊)
 */

const PAPER = '#fcfcf9'
const PAPER_SOFT = '#f4f2ec'
const INK = '#15171a'

interface TechThemeArgs {
  containerBg: string // 整張卡的淡色底
  accent: string // 色票主色 (標題豎線 / 主色)
  contentBg: string // 內容卡的底 (通常紙白)
}

function createTechThemeColor({ containerBg, accent, contentBg }: TechThemeArgs): ThemeConfig {
  return {
    hero: {
      container: {
        background: containerBg, // 純色, 沒有 image
        foreground: INK,
      },
      title: {
        foreground: accent, // 標題用色票主色
        background: 'transparent',
      },
      content: {
        foreground: INK,
        background: 'transparent',
      },
    },
    main: {
      container: {
        background: containerBg,
        backgroundEven: containerBg,
        backgroundOdd: containerBg,
        foreground: INK,
      },
      title: {
        foreground: INK,
        accent, // → --main-title-accent (template 拿來畫左側豎線)
        background: 'transparent', // 不再有襯底色塊
      },
      content: {
        foreground: INK,
        background: PAPER, // 內容卡紙白底
        secondaryBackground: PAPER_SOFT,
      },
    },
    sub: {
      container: {},
      title: {
        foreground: accent, // sub 標題用主色
        background: 'transparent', // 不再有色塊
      },
      content: {
        foreground: INK,
      },
    },
  }
}

// 三個色票 — label 維持向後相容,色號改成使用者色票
export const techBlue: ThemeConfig = createTechThemeColor({
  containerBg: '#e8edf2', // 淺鈷藍灰
  accent: '#4a5d7a', // 鈷藍
  contentBg: PAPER,
})

export const techVibrantOrange: ThemeConfig = createTechThemeColor({
  containerBg: '#f3eee7', // 淺古銅米
  accent: '#a08866', // 古銅
  contentBg: PAPER,
})

export const techRoseRed: ThemeConfig = createTechThemeColor({
  containerBg: '#f5e8e8', // 淺玫粉
  accent: '#7a1e22', // 殷紅
  contentBg: PAPER,
})
