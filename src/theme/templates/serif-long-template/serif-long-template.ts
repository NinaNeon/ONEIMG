import type { ArticleModuleTemplate } from '@/types'

/**
 * 思源宋體長圖 模板
 *
 * 一張連貫的長圖, 適合社群媒體 (小紅書 / IG / 微信公眾號)
 * 跟「書頁排版」最大的差別:
 *   - 不分頁 (整張長圖)
 *   - 不需邊框
 *   - 結構與 simpleTemplate 接近, 但字距/行高為宋體調校過
 *   - 標題不縮排, 內文段落首行縮排兩字 (中文書面感)
 */

const SERIF_STACK = '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "Source Han Serif SC", "PingFang TC", "Songti TC", "Songti SC", "STSong", "SimSun", serif'

export const serifLongTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      'fontFamily': SERIF_STACK,
      'fontFeatureSettings': '"palt" 1',
      'WebkitFontSmoothing': 'antialiased',
      'MozOsxFontSmoothing': 'grayscale',
    },
    title: {
      fontFamily: SERIF_STACK,
    },
    content: {
      'fontFamily': SERIF_STACK,
      '& :where(p)': {
        marginTop: '0',
        marginBottom: '0.5em',
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
      padding: '80px 48px',
      textAlign: 'center',
      minHeight: 'auto',
    },
    title: {
      fontSize: '34px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.08em',
      marginBottom: '20px',
    },
    content: {
      'fontSize': '16px',
      'lineHeight': 1.85,
      'letterSpacing': '0.05em',
      '& :where(p)': {
        textIndent: 0, // 封面副標題不縮排
        marginBottom: '0.5em',
      },
    },
  },

  main: {
    container: {
      padding: '40px 48px',
      // 主題色淡化分隔
      borderTop: '1px solid var(--main-content-rule, #d8d5cf)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      marginTop: 0,
      marginBottom: '20px',
    },
    content: {
      fontSize: '17px',
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
      fontSize: '19px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.04em',
      marginTop: '20px',
      marginBottom: '12px',
    },
    content: {
      fontSize: '17px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },
}
