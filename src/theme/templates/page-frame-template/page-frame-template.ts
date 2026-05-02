import type { ArticleModuleTemplate } from '@/types'

/**
 * 書頁排版（內凹邊框） 模板
 *
 * 視覺結構 (從外到內):
 *   ┌─────────────────────────────┐  ← 紙張外緣 (底色)
 *   │   ←32px外白邊→               │
 *   │   ┌─────────────────────┐   │  ← 細色票邊框 (1px)
 *   │   │   ←40px內邊距→       │   │
 *   │   │     文字內容        │   │
 *   │   └─────────────────────┘   │
 *   │                             │
 *   └─────────────────────────────┘
 *
 * 跟「書頁排版（思源宋體）」的差別:
 *   - 邊框內凹 (而非貼齊紙張邊緣)
 *   - 邊框前後都是底色, 視覺更優雅
 *   - 字數可切換 1000 / 2000 (透過 store 的 pageDensity)
 *   - 邊框色從 PagedCard 用 inline style 注入, 確保色票切換立刻生效
 *
 * ⚠️ 注意: 因為內凹邊框需要兩層 div 結構, 實際上這個模板的樣式
 *    主要由 PagedCard 元件以 inline style 渲染。
 *    這個檔案定義的是內層內容區的字級/行高/段落格式。
 */

const SERIF_STACK = '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "Source Han Serif SC", "PingFang TC", "Songti TC", "Songti SC", "STSong", "SimSun", serif'

export const pageFrameTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      'fontFamily': SERIF_STACK,
      'fontFeatureSettings': '"palt" 1',
      'WebkitFontSmoothing': 'antialiased',
      'MozOsxFontSmoothing': 'grayscale',
    },
    title: { fontFamily: SERIF_STACK },
    content: {
      'fontFamily': SERIF_STACK,
      '& :where(p)': {
        marginTop: 0,
        marginBottom: '0.6em',
        lineHeight: 1.85,
        textIndent: '2em',
      },
      '& :where(p:first-child)': { marginTop: 0 },
      '& :where(p:last-child)': { marginBottom: 0 },
      '& :where(blockquote p)': { textIndent: 0 },
      '& :where(li p)': { textIndent: 0, marginBottom: '0.3em' },
      '& :where(blockquote)': {
        margin: '1.2em 0',
        paddingLeft: '1em',
        borderLeft: '2px solid var(--main-content-rule, #d8d5cf)',
        color: 'var(--main-content-dim, #5a5d63)',
      },
      '& :where(hr)': {
        border: 'none',
        borderTop: '1px solid var(--main-content-rule, #d8d5cf)',
        margin: '1.5em auto',
        width: '40%',
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

  // hero/main/sub 的容器樣式由 PagedCard 自行 inline 渲染
  // 這邊只放字級/標題等與內容相關的設定
  hero: {
    container: {},
    title: {
      fontSize: '36px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      marginBottom: '20px',
      textAlign: 'center',
    },
    content: {
      fontSize: '17px',
      lineHeight: 1.9,
      letterSpacing: '0.06em',
    },
  },

  main: {
    container: {},
    title: {
      fontSize: '26px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      marginTop: 0,
      marginBottom: '28px',
      paddingBottom: '16px',
      textAlign: 'center',
    },
    content: {
      fontSize: '19px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },

  sub: {
    container: {
      marginTop: '20px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '21px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      marginTop: '20px',
      marginBottom: '14px',
    },
    content: {
      fontSize: '19px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },
}
