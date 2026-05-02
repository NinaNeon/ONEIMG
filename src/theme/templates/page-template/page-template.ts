import type { ArticleModuleTemplate } from '@/types'

/**
 * 書頁排版模板
 *
 * 規格:
 *   - 頁面寬度: 760px (max-width: 100% 在小螢幕上自動縮)
 *   - 上下天地: 64px
 *   - 左右版心: 56px (有效行寬 648px)
 *   - 字級: 19px
 *   - 行高: 1.85
 *   - 字間距: 0.04em
 *   - 一行約 33 字, 一頁約 30 行 = 約 1000 字
 *   - 字體: 思源宋體 (Noto Serif TC / Source Han Serif)
 *   - 樣式: 白底細外框, 外框顏色由色票決定
 *
 * ⚠️ 顏色相關 CSS 變數由 page-colors.ts 透過 flattenThemeConfig 自動生成,
 *    格式為 --{section}-{element}-{property},
 *    例如 main.container.borderColor → --main-container-border-color
 */

const SERIF_STACK = '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "Source Han Serif SC", "PingFang TC", "Songti TC", "Songti SC", "STSong", "SimSun", serif'

export const pageTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      'width': '760px',
      'maxWidth': '100%',
      'margin': '0 auto',
      'fontFamily': SERIF_STACK,
      'fontFeatureSettings': '"palt" 1',
      'wordBreak': 'normal',
      'overflowWrap': 'break-word',
      'lineBreak': 'strict',
      'WebkitFontSmoothing': 'antialiased',
      'MozOsxFontSmoothing': 'grayscale',
    },
    title: {
      fontFamily: SERIF_STACK,
    },
    content: {
      'fontFamily': SERIF_STACK,
      // 段落格式: 書本式排版
      '& :where(p)': {
        marginTop: '0',
        marginBottom: '0.6em',
        lineHeight: 1.85,
        textIndent: '2em', // 中文書頁首行縮排兩字
      },
      '& :where(p:first-child)': {
        marginTop: 0,
      },
      '& :where(p:last-child)': {
        marginBottom: 0,
      },
      '& :where(blockquote p)': {
        textIndent: 0,
      },
      '& :where(li p)': {
        textIndent: 0,
        marginBottom: '0.3em',
      },
      '& :where(blockquote)': {
        margin: '1.2em 0',
        paddingLeft: '1em',
        borderLeft: '2px solid var(--main-content-rule, #d8d5cf)',
        color: 'var(--main-content-dim, #5a5d63)',
        fontStyle: 'normal',
      },
      '& :where(hr)': {
        border: 'none',
        borderTop: '1px solid var(--main-content-rule, #d8d5cf)',
        margin: '1.5em auto',
        width: '40%',
      },
      '& :where(strong, b)': {
        fontWeight: 700,
      },
      '& :where(em, i)': {
        fontStyle: 'italic',
      },
      '& :where(code):not(pre code)': {
        fontFamily: '"JetBrains Mono", "Source Code Pro", monospace',
        fontSize: '0.9em',
        padding: '0.1em 0.35em',
        backgroundColor: 'var(--main-content-secondary-background, #f4f2ec)',
        color: 'var(--main-content-accent, #15171a)',
        borderRadius: '2px',
      },
    },
  },

  // hero: 第一張卡(主題卡), 作為書本封面/扉頁
  hero: {
    container: {
      position: 'relative',
      padding: '120px 56px',
      // ★ 細外框 — 用會被 flattenThemeConfig 自動產生的變數名
      border: '1px solid var(--hero-container-border-color, #15171a)',
      textAlign: 'center',
      minHeight: 'auto',
    },
    title: {
      fontSize: '38px',
      fontWeight: 500, // 宋體標題不需要太粗
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      marginBottom: '24px',
    },
    content: {
      'fontSize': '17px',
      'lineHeight': 1.9,
      'letterSpacing': '0.06em',
      '& :where(p)': {
        textIndent: 0, // 封面不縮排
        marginBottom: '0.5em',
      },
    },
  },

  // main: 普通內文卡, 一張卡 = 一頁書
  main: {
    container: {
      'position': 'relative',
      'padding': '64px 56px',
      // ★ 細外框
      'border': '1px solid var(--main-container-border-color, #15171a)',
      // 第一張卡之後每張都有上邊距, 視覺上像書頁分開
      '&:not(:first-child)': {
        marginTop: '40px',
      },
    },
    title: {
      fontSize: '26px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      marginBottom: '32px',
      paddingBottom: '16px',
      borderBottom: '1px solid var(--main-title-accent, #15171a)',
      textAlign: 'center',
    },
    content: {
      fontSize: '19px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },

  // sub: 子內容(章節下的小節)
  sub: {
    container: {
      marginTop: '24px',
      marginBottom: '24px',
    },
    title: {
      fontSize: '21px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      marginBottom: '16px',
      marginTop: '24px',
      // 子標題顏色由 themeColorStyles 注入 (--sub-title-foreground)
    },
    content: {
      fontSize: '19px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },
}
