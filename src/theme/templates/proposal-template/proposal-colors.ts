import type { ThemeConfig } from '@/types'

/**
 * 企劃書風格色票 (v6.1)
 *
 * 深底白字組 (4 色): ink / stone / vermilion / holy
 *   - 整片用色票主色作底
 *   - 文字用 CSS var --proposal-heavy-text (預設米白 #f0eee8, 切換成金色 #b89c75)
 *   - 獎盃也用同色 (透過 trophyColor 平鋪到 --hero-container-trophy-color)
 *
 * 色底淺底組 (3 色): steel / bronze / violet
 *   - 容器用淡色底, 內容卡用紙白
 *   - 標題用色票主色, 內文用墨色
 *   - 獎盃用色票主色 (固定)
 *
 * 字色變化只影響「深底」, 淺底色票保持原色。
 */

const PAPER = '#fcfcf9'
const PAPER_SOFT = '#f4f2ec'
const INK = '#15171a'
const INK_DIM = '#5a5d63'
const RULE = '#d8d5cf'

// CSS var 引用: 深底文字色由 store 注入到 root, fallback 米白
const HEAVY_TEXT = 'var(--proposal-heavy-text, #f0eee8)'
const HEAVY_TEXT_DIM = 'var(--proposal-heavy-text-dim, rgba(240, 238, 232, 0.7))'

// ──── 深底白字版 (heavy) ────
function createHeavyTheme(bgColor: string): ThemeConfig {
  return {
    hero: {
      container: {
        background: bgColor,
        foreground: HEAVY_TEXT,
        // 自訂 key, flattenThemeConfig 會生成 --hero-container-trophy-color
        // template 中 ::before 用這個 var 來著色獎盃
        trophyColor: HEAVY_TEXT,
      },
      title: {
        background: 'transparent',
        foreground: HEAVY_TEXT,
      },
      content: {
        background: 'transparent',
        foreground: HEAVY_TEXT_DIM,
      },
    },
    main: {
      container: {
        background: bgColor,
        backgroundEven: bgColor,
        backgroundOdd: bgColor,
        foreground: HEAVY_TEXT,
      },
      title: {
        background: 'transparent',
        foreground: HEAVY_TEXT,
        accent: HEAVY_TEXT, // 左側豎線同色
      },
      content: {
        background: 'rgba(255, 255, 255, 0.06)',
        foreground: HEAVY_TEXT,
        secondaryBackground: 'rgba(255, 255, 255, 0.10)',
        rule: 'rgba(240, 238, 232, 0.25)',
        dim: HEAVY_TEXT_DIM,
      },
    },
    sub: {
      container: { background: 'transparent' },
      title: {
        background: 'transparent',
        foreground: HEAVY_TEXT,
      },
      content: { foreground: HEAVY_TEXT },
    },
  }
}

// ──── 色底淺底版 (light) ────
function createLightTheme(containerBg: string, accent: string): ThemeConfig {
  return {
    hero: {
      container: {
        background: containerBg,
        foreground: INK,
        trophyColor: accent, // 獎盃用色票主色 (固定)
      },
      title: {
        background: 'transparent',
        foreground: accent,
      },
      content: {
        background: 'transparent',
        foreground: INK_DIM,
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
        background: 'transparent',
        foreground: INK,
        accent,
      },
      content: {
        background: PAPER,
        foreground: INK,
        secondaryBackground: PAPER_SOFT,
        rule: RULE,
        dim: INK_DIM,
      },
    },
    sub: {
      container: { background: 'transparent' },
      title: {
        background: 'transparent',
        foreground: accent,
      },
      content: { foreground: INK },
    },
  }
}

// ──── 7 個色票 ────
// 深底白字: ink, stone, vermilion, holy, midnight
export const proposalInk = createHeavyTheme('#15171a')
export const proposalStone = createHeavyTheme('#2a2c30')
export const proposalMidnight = createHeavyTheme('#1c2540') // ★ v7.2 深普魯士藍 (比 holy 深, 跟 stone 同級)
export const proposalVermilion = createHeavyTheme('#7a1e22')
export const proposalHoly = createHeavyTheme('#4a5d7a') // ★ v6.1 改成深底

// 色底淺底: steel, bronze, violet
export const proposalSteel = createLightTheme('#eef0f3', '#6b7a8f')
export const proposalBronze = createLightTheme('#f3eee7', '#a08866')
export const proposalViolet = createLightTheme('#efe9f2', '#9c8cb8')
