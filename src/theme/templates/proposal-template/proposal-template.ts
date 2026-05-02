import type { ArticleModuleTemplate } from '@/types'

/**
 * 企劃書風格模板 (v6.1)
 *
 * 動態化:
 *   - padding 用 CSS var --proposal-padding-x (預設 56px), 由 store 切換
 *   - 獎盃 SVG 用 mask-image, 顏色由 var --hero-container-trophy-color 決定
 *     深底色票: 跟文字同色 (米白 / 金色, store 切換)
 *     淺底色票: 用色票主色
 *
 * 標題: 左側細色票豎線 + 純文字, 沒有襯底, 沒有 NO.1
 */

const SERIF_STACK = '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "Source Han Serif SC", "PingFang TC", "Songti TC", "Songti SC", "STSong", "SimSun", serif'

// 獎盃 SVG (黑色 stroke, 顏色會被 mask-image 覆蓋, 實際顏色靠 background-color)
// 注意: mask-image 模式下 SVG 顏色不重要, 只要不透明區塊正確
const TROPHY_SVG_MASK = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M20 12 L44 12 L42 32 Q32 38 22 32 Z'/><path d='M20 16 Q12 16 12 24 Q12 30 20 30'/><path d='M44 16 Q52 16 52 24 Q52 30 44 30'/><path d='M28 38 L28 46 M36 38 L36 46'/><path d='M22 46 L42 46 L42 50 L22 50 Z'/></svg>`
const TROPHY_MASK_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(TROPHY_SVG_MASK)}")`

export const proposalTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      'width': '580px',
      'maxWidth': '100%',
      'margin': '0 auto',
      'fontFamily': SERIF_STACK,
      'fontFeatureSettings': '"palt" 1',
      'WebkitFontSmoothing': 'antialiased',
      'MozOsxFontSmoothing': 'grayscale',
    },
    title: { fontFamily: SERIF_STACK },
    content: { fontFamily: SERIF_STACK },
  },
  hero: {
    container: {
      'position': 'relative',
      'paddingLeft': 'var(--proposal-padding-x, 56px)',
      'paddingRight': 'var(--proposal-padding-x, 56px)',
      'paddingTop': '160px', // 預留獎盃 SVG 空間 (top 40, height 80, gap 40)
      'paddingBottom': '56px',
      'textAlign': 'center',
      // 獎盃: ::before 偽元素 + mask-image
      // 顏色用 --hero-container-trophy-color (從 colors 注入)
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '40px',
        left: '50%',
        width: '80px',
        height: '80px',
        marginLeft: '-40px',
        backgroundColor: 'var(--hero-container-trophy-color, #f0eee8)',
        WebkitMaskImage: TROPHY_MASK_URL,
        maskImage: TROPHY_MASK_URL,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        pointerEvents: 'none',
      },
    },
    title: {
      position: 'relative',
      marginTop: 0,
      marginBottom: '16px',
      fontWeight: 500,
      fontSize: '32px',
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      textAlign: 'center',
    },
    content: {
      'position': 'relative',
      'fontSize': '17px',
      'lineHeight': 1.85,
      'letterSpacing': '0.06em',
      '& :where(p)': {
        marginTop: '8px',
        marginBottom: '8px',
        textIndent: 0,
      },
      '& :where(p:first-child)': { marginTop: 0 },
      '& :where(p:last-child)': { marginBottom: 0 },
    },
  },
  main: {
    container: {
      paddingLeft: 'var(--proposal-padding-x, 56px)',
      paddingRight: 'var(--proposal-padding-x, 56px)',
      paddingTop: '40px',
      paddingBottom: '40px',
    },
    title: {
      'position': 'relative',
      'marginTop': 0,
      'marginBottom': '20px',
      'paddingLeft': '14px',
      'fontSize': '21px',
      'fontWeight': 600,
      'lineHeight': 1.4,
      'letterSpacing': '0.05em',
      'borderLeftWidth': '3px',
      'borderLeftStyle': 'solid',
      'borderLeftColor': 'var(--main-title-accent, #4a5d7a)',
      'p': { margin: 0 },
    },
    content: {
      'position': 'relative',
      'padding': '24px',
      'borderRadius': '4px',
      'fontSize': '18px',
      'lineHeight': 1.85,
      'letterSpacing': '0.04em',
      '& :where(p)': {
        marginTop: '0',
        marginBottom: '0.7em',
        textIndent: '2em', // 中文書面式縮排
      },
      '& :where(p:first-child)': { marginTop: 0 },
      '& :where(p:last-child)': { marginBottom: 0 },
      '& :where(blockquote p)': { textIndent: 0 },
      '& :where(li p)': { textIndent: 0 },
      '& :where(blockquote)': {
        margin: '1em 0',
        paddingLeft: '1em',
        borderLeftWidth: '2px',
        borderLeftStyle: 'solid',
        borderLeftColor: 'var(--main-content-rule, #d8d5cf)',
      },
      '& :where(hr)': {
        border: 'none',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--main-content-rule, #d8d5cf)',
        margin: '1.5em auto',
        width: '40%',
      },
    },
  },
  sub: {
    container: {
      marginTop: '16px',
    },
    title: {
      lineHeight: 1.4,
      fontWeight: 600,
      fontSize: '18px',
      letterSpacing: '0.04em',
      paddingBottom: '6px',
      marginBottom: '12px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'var(--sub-title-foreground, #4a5d7a)',
      display: 'inline-block',
      p: {
        lineHeight: 'inherit',
        margin: 0,
      },
    },
    content: {
      fontSize: '17px',
      lineHeight: 1.85,
      letterSpacing: '0.04em',
    },
  },
}
