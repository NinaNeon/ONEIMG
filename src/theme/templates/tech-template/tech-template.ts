import type { ArticleModuleTemplate } from '@/types'

/**
 * 简约科技风格 (改版)
 *
 * 移除項目:
 *   - hero 底圖 url(/images/them-bg-*.png)
 *   - main title 的 linear-gradient 襯底
 *   - main title 的 ::after "NO." attr(data-index) 標號
 *   - sub title 的 linear-gradient 襯底
 *
 * 新風格:
 *   - 標題純文字 + 左側細色票豎線 (簡潔, 不搶字)
 *   - 字體改為思源宋體
 *   - 內容卡白底, 容器淺色底 (依色票)
 */

const SERIF_STACK = '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "Source Han Serif SC", "PingFang TC", "Songti TC", "Songti SC", "STSong", "SimSun", serif'

export const techTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      'fontFamily': SERIF_STACK,
      'WebkitFontSmoothing': 'antialiased',
      'MozOsxFontSmoothing': 'grayscale',
    },
    title: { fontFamily: SERIF_STACK },
    content: { fontFamily: SERIF_STACK },
  },
  hero: {
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: '24px',
      paddingTop: '40px',
      paddingRight: '24px',
      paddingBottom: '40px',
      textAlign: 'center',
      // 不再有 backgroundImage, 顏色由色票套
    },
    title: {
      position: 'relative',
      zIndex: 1,
      marginTop: '12px',
      marginBottom: '12px',
      fontWeight: 500,
      fontSize: '30px',
      letterSpacing: '0.06em',
      textAlign: 'center',
    },
    content: {
      position: 'relative',
      zIndex: 2,
      fontSize: '17px',
      lineHeight: 1.7,
      letterSpacing: '0.04em',
    },
  },
  main: {
    container: {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '24px',
      paddingBottom: '24px',
    },
    title: {
      // 簡潔風格: 左側細豎線 + 純文字, 沒有襯底色塊
      'position': 'relative',
      'marginBottom': '14px',
      'paddingLeft': '14px',
      'fontSize': '20px',
      'fontWeight': 600,
      'lineHeight': 1.4,
      'letterSpacing': '0.04em',
      'borderLeftWidth': '3px',
      'borderLeftStyle': 'solid',
      'borderLeftColor': 'var(--main-title-accent, #4a5d7a)',
      'p': {
        margin: 0,
      },
    },
    content: {
      'position': 'relative',
      'padding': '16px 20px',
      'borderRadius': '6px',
      'fontSize': '15px',
      'lineHeight': 1.75,
      'letterSpacing': '0.03em',
      // 內容卡用淡白底, 由色票決定
      '& :where(p)': {
        marginTop: '8px',
        marginBottom: '8px',
      },
      '& :where(p:first-child)': { marginTop: 0 },
      '& :where(p:last-child)': { marginBottom: 0 },
      '& :where(img)': {
        marginTop: '8px',
        marginBottom: '8px',
      },
    },
  },
  sub: {
    container: {},
    title: {
      // 簡潔: 不再用膠囊 linear-gradient, 改純色文字 + 細底線
      lineHeight: 1.4,
      fontWeight: 600,
      fontSize: '17px',
      letterSpacing: '0.04em',
      paddingBottom: '6px',
      marginBottom: '10px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'var(--sub-title-foreground, #4a5d7a)',
      display: 'inline-block',
      p: {
        lineHeight: 'inherit',
        margin: 0,
      },
    },
    content: {},
  },
}
