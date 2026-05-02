import type { ThemeConfig } from '@/types'

/**
 * 書頁排版色票
 *
 * ⚠️ 重要：所有屬性 key 會被 `flattenThemeConfig` 平鋪成 CSS 變數
 *  例如 main.container.borderColor → --main-container-border-color
 *  所以在 page-template.ts 中要使用 var(--main-container-border-color)
 *
 * 設計概念:
 *   - 白底紙張 (#fcfcf9 偏暖白, 模擬紙張)
 *   - 文字使用色票中的深色 (--bg / --bg-soft) 作為墨色
 *   - 邊框顏色從色票中切換
 *
 * 來自使用者提供的色票:
 *   --bg: #0d0e10        (墨色)
 *   --bg-soft: #15171a   (次墨色)
 *   --fg: #d8d5cf        (米白)
 *   --fg-dim: #8a8680    (淡灰)
 *   --accent: #6b7a8f    (青鋼藍灰)
 *   --accent-warm: #a08866 (古銅)
 *   --rule: #2a2c30      (深石灰,線條)
 *   --red: #7a1e22       (殷紅,印泥色)
 *   --purple: #9c8cb8    (紫薇)
 *   --holy: #4a5d7a      (鈷藍)
 */

const PAPER_BG = '#fcfcf9' // 偏暖紙白
const PAPER_BG_SOFT = '#f4f2ec' // code 背景, 引文背景
const INK = '#15171a' // 墨色 (來自 --bg-soft, 比純黑柔和)
const INK_DIM = '#5a5d63' // 淡墨 (引文用)
const RULE = '#d8d5cf' // 紙頁上的淡分隔線

/**
 * 工廠: 給定邊框顏色, 生出一份完整的色票配置
 */
function createPageTheme(borderColor: string): ThemeConfig {
  return {
    hero: {
      container: {
        background: PAPER_BG, // → --hero-container-background
        foreground: INK, // → --hero-container-foreground
        borderColor, // → --hero-container-border-color  ★ 邊框色
      },
      title: {
        background: 'transparent',
        foreground: INK,
        accent: borderColor, // → --hero-title-accent (副標分隔線等)
      },
      content: {
        background: 'transparent',
        foreground: INK_DIM, // 封面副文用淡墨
      },
    },
    main: {
      container: {
        background: PAPER_BG, // → --main-container-background
        backgroundEven: PAPER_BG,
        backgroundOdd: PAPER_BG,
        foreground: INK,
        borderColor, // → --main-container-border-color  ★ 邊框色
      },
      title: {
        background: 'transparent',
        foreground: INK, // 標題墨黑
        accent: borderColor, // → --main-title-accent (標題下方分隔線)
      },
      content: {
        background: 'transparent',
        foreground: INK, // 內文墨黑
        secondaryBackground: PAPER_BG_SOFT, // → --main-content-secondary-background (code 背景)
        rule: RULE, // → --main-content-rule (hr, blockquote 邊線)
        dim: INK_DIM, // → --main-content-dim (引文文字色)
        accent: borderColor, // → --main-content-accent (code 文字色等強調)
      },
    },
    sub: {
      container: {
        background: 'transparent',
      },
      title: {
        foreground: borderColor, // 子標題用邊框色 (章節色)
      },
      content: {
        foreground: INK,
      },
    },
  }
}

// ─────────── 七種邊框色,源自使用者色票 ───────────

/** 墨黑 — 用 --bg-soft, 沉穩, 像線裝書 */
export const pageInk = createPageTheme('#15171a')

/** 石灰 — 用 --rule, 低調冷調 */
export const pageStone = createPageTheme('#2a2c30')

/** 青鋼 — 用 --accent, 文人雅緻 */
export const pageSteel = createPageTheme('#6b7a8f')

/** 古銅 — 用 --accent-warm, 古籍感 */
export const pageBronze = createPageTheme('#a08866')

/** 殷紅 — 用 --red, 書封朱色, 莊重 */
export const pageVermilion = createPageTheme('#7a1e22')

/** 紫薇 — 用 --purple, 文藝 */
export const pageViolet = createPageTheme('#9c8cb8')

/** 鈷藍 — 用 --holy, 神性, 經書感 */
export const pageHoly = createPageTheme('#4a5d7a')
