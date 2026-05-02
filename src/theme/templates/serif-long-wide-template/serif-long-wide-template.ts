import type { ArticleModuleTemplate } from '@/types'

/**
 * 思源宋體 長圖 (寬版)
 *
 * 設計計算:
 *   - 容器寬度: 800px
 *   - 左右 padding: 84px → 行寬 = 800 - 168 = 632px
 *   - 字級: 19px, 字距 0.04em → 字寬 ≈ 19.76px
 *   - 一行字數 = 632 / 19.76 ≈ 32 字 ✓
 *
 * 跟「思源宋體 長圖」(窄版) 的差別:
 *   - 容器寬: 800 vs 約 375 (手機寬)
 *   - 一行字數: 32 vs 約 17
 *   - 適合桌面端閱讀, 或想要每行字數較多的書籍式長圖
 */

const SERIF_STACK = '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "Source Han Serif SC", "PingFang TC", "Songti TC", "Songti SC", "STSong", "SimSun", serif'

export const serifLongWideTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      'width': '800px',
      'maxWidth': '100%',
      'margin': '0 auto',
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
        margin: '2em auto',
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

  hero: {
    container: {
      position: 'relative',
      padding: '100px 84px',
      textAlign: 'center',
      minHeight: 'auto',
    },
    title: {
      fontSize: '38px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      marginBottom: '24px',
    },
    content: {
      'fontSize': '18px',
      'lineHeight': 1.85,
      'letterSpacing': '0.06em',
      '& :where(p)': {
        textIndent: 0,
        marginBottom: '0.5em',
      },
    },
  },

  main: {
    container: {
      padding: '56px 84px',
      borderTop: '1px solid var(--main-content-rule, #d8d5cf)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      marginTop: 0,
      marginBottom: '24px',
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
      marginTop: '24px',
      marginBottom: '24px',
    },
    title: {
      fontSize: '22px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.04em',
      marginTop: '24px',
      marginBottom: '14px',
    },
    content: {
      fontSize: '19px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },
}
