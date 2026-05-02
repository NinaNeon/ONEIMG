'use client'

import DOMPurify from 'dompurify'
import { forwardRef, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { baseTemplate, themeColorStyles } from './styles'
import type { ContentWithId } from '@/types'
import { cn, createStyleClassMap } from '@/lib'
import { CustomThemeContext } from '@/contexts/custom-theme-context'
import { useThemeStore } from '@/store/use-theme-store'

/**
 * 自動分頁 Card - 給 page-style 與 page-frame 兩種書頁模板使用
 *
 * 兩種模板差別:
 *   - page-style: 邊框貼齊紙張邊緣
 *   - page-frame: 紙張外緣是底色, 內凹後一條細色票邊框, 邊框內側再是底色
 *
 * 內容類型:
 *   - hero (theme_content): 封面/扉頁, 不分頁, 文字置中, padding 較大
 *   - main (normal_content): 內文卡, 自動分頁
 *
 * 字數密度: store.pageDensity (1000 / 2000)
 * 外白邊寬: store.frameMargin (8 / 16 / 32) — 僅 page-frame
 * 外白邊色: store.frameOuterColor ('paper' / 'white') — 僅 page-frame
 *
 * 標題色: 固定 INK, 不跟邊框色換 (使用者指定)
 */

// ──── 共用顏色 ────
const PAPER = '#fcfcf9' // 紙白
const WHITE = '#ffffff' // 純白
const INK = '#15171a' // 墨色 (標題與內文)
const INK_DIM = '#5a5d63'

// ──── 色票色號 ────
const HUE_COLOR: Record<string, string> = {
  ink: '#15171a',
  stone: '#2a2c30',
  steel: '#6b7a8f',
  bronze: '#a08866',
  vermilion: '#7a1e22',
  violet: '#9c8cb8',
  holy: '#4a5d7a',
}

function resolveBorderColor(themeLabel: string | undefined): string {
  if (!themeLabel) return HUE_COLOR.ink
  const hue = themeLabel.replace(/^(page|frame|serif_long|serif_wide)_/, '')
  return HUE_COLOR[hue] || HUE_COLOR.ink
}

// ──── 一頁可容納的內文像素高度 ────
function getPageContentHeight(density: 1000 | 2000): number {
  // 字級 19px × 行高 1.85 = 35.15px / 行
  return density === 2000 ? 2108 : 1054 // 60 行 / 30 行
}

// ──── 測量容器 ────
const PAGE_INNER_WIDTH = 648 // 760 - 56*2

const MEASURE_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: -99999,
  top: 0,
  width: `${PAGE_INNER_WIDTH}px`,
  visibility: 'hidden',
  pointerEvents: 'none',
  fontFamily: '"Noto Serif TC", "Noto Serif SC", "Source Han Serif TC", "PingFang TC", "Songti TC", serif',
  fontSize: '19px',
  lineHeight: 1.85,
  letterSpacing: '0.04em',
  fontFeatureSettings: '"palt" 1',
  wordBreak: 'normal',
  overflowWrap: 'break-word',
}

interface PagedCardProps {
  content: ContentWithId
  index: number
  registerPageRef?: (key: string, el: HTMLDivElement | null) => void
}

const PagedCard = forwardRef<HTMLDivElement, PagedCardProps>(({ content, index, registerPageRef }, ref) => {
  const ctx = useContext(CustomThemeContext)
  const themeLabel = useThemeStore(s => s.theme)
  const pageDensity = useThemeStore(s => s.pageDensity)
  const frameMargin = useThemeStore(s => s.frameMargin)
  const frameOuterColor = useThemeStore(s => s.frameOuterColor)

  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<string[]>(() => [DOMPurify.sanitize(content.content || '')])

  const isHero = content.type === 'theme_content'
  const isFrameStyle = ctx.templateName === 'page-frame'
  const borderColor = resolveBorderColor(themeLabel)
  const pageContentHeight = useMemo(() => getPageContentHeight(pageDensity), [pageDensity])
  const outerBg = frameOuterColor === 'white' ? WHITE : PAPER

  // 測量並切分 (hero 不分頁)
  useLayoutEffect(() => {
    if (isHero) {
      setPages([DOMPurify.sanitize(content.content || '')])
      return
    }
    const measureEl = measureRef.current
    if (!measureEl) return

    const cleanHtml = DOMPurify.sanitize(content.content || '')
    if (!cleanHtml.trim()) {
      setPages([''])
      return
    }
    const tmp = document.createElement('div')
    tmp.innerHTML = cleanHtml
    const blocks = Array.from(tmp.children) as HTMLElement[]
    if (blocks.length === 0) {
      setPages([cleanHtml])
      return
    }
    const chunks: string[] = ['']
    for (const block of blocks) {
      const blockHtml = block.outerHTML
      const currentChunk = chunks[chunks.length - 1]
      measureEl.innerHTML = currentChunk + blockHtml
      const trialHeight = measureEl.scrollHeight
      if (trialHeight <= pageContentHeight || currentChunk === '') {
        chunks[chunks.length - 1] = currentChunk + blockHtml
      } else {
        chunks.push(blockHtml)
      }
    }
    measureEl.innerHTML = ''
    setPages(chunks)
  }, [content.content, pageContentHeight, isHero])

  const templateClassNameMap = createStyleClassMap(ctx.template, 'template', baseTemplate)
  const themeClassNameMap = createStyleClassMap(themeColorStyles, 'theme')
  const heroTitleClass = cn(templateClassNameMap.hero.title, themeClassNameMap.hero.title)
  const heroContentClass = cn(
    templateClassNameMap.common.content,
    templateClassNameMap.hero.content,
    themeClassNameMap.hero.content,
  )
  const mainTitleClass = cn(templateClassNameMap.main.title, themeClassNameMap.main.title)
  const mainContentClass = cn(
    templateClassNameMap.common.content,
    templateClassNameMap.main.content,
    themeClassNameMap.main.content,
  )

  // ──── 容器樣式 ────
  // page-style: 單層, 邊框貼緣
  function pageStyleContainerStyle(isFirstOverall: boolean, heroMode: boolean): React.CSSProperties {
    return {
      position: 'relative',
      width: '760px',
      maxWidth: '100%',
      margin: isFirstOverall ? '0 auto' : '40px auto 0',
      padding: heroMode ? '120px 56px' : '64px 56px',
      backgroundColor: PAPER,
      color: INK,
      border: `1px solid ${borderColor}`,
      boxSizing: 'border-box',
      textAlign: heroMode ? 'center' : 'left',
      minHeight: heroMode ? 'auto' : pageContentHeight + 128,
    }
  }

  // page-frame: 雙層, 內凹邊框
  function frameOuterStyle(isFirstOverall: boolean): React.CSSProperties {
    return {
      position: 'relative',
      width: '760px',
      maxWidth: '100%',
      margin: isFirstOverall ? '0 auto' : '40px auto 0',
      padding: `${frameMargin}px`, // 外白邊 (可切換 8/16/32)
      backgroundColor: outerBg, // 紙白 / 純白
      boxSizing: 'border-box',
    }
  }

  function frameInnerStyle(heroMode: boolean): React.CSSProperties {
    return {
      position: 'relative',
      border: `1px solid ${borderColor}`,
      padding: heroMode ? '120px 48px' : '40px 48px',
      backgroundColor: PAPER, // 內層永遠紙白
      color: INK,
      minHeight: heroMode ? 320 : pageContentHeight + 80,
      boxSizing: 'border-box',
      textAlign: heroMode ? 'center' : 'left',
    }
  }

  // ──── 渲染標題 (色固定 INK, 不跟邊框換) ────
  // hero 標題: 大字 + 置中 + 不要分隔線
  // main 標題: 中字 + 下方有色票分隔線(這條跟邊框色一致, 屬於設計細節, 不算"標題本身"換色)
  function renderHeroTitle() {
    if (!content.title) return null
    return (
      <div
        className={heroTitleClass}
        data-index={index}
        style={{ color: INK, textAlign: 'center' }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.title) }}
      />
    )
  }

  function renderMainTitle() {
    if (!content.title) return null
    return (
      <div
        className={mainTitleClass}
        data-index={index}
        style={{
          color: INK,
          borderBottom: `1px solid ${borderColor}`,
          paddingBottom: 16,
          marginBottom: 32,
          textAlign: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.title) }}
      />
    )
  }

  function renderPageNumber(pageIdx: number, total: number) {
    if (total <= 1) return null
    return (
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 13,
        letterSpacing: '0.1em',
        color: INK_DIM,
        pointerEvents: 'none',
      }}>
        {pageIdx + 1} / {total}
      </div>
    )
  }

  return (
    <>
      {/* 離畫面測量容器 */}
      <div ref={measureRef} style={MEASURE_STYLE} aria-hidden="true" />

      {pages.map((pageHtml, pageIdx) => {
        const pageKey = `${content.id}__page${pageIdx}`
        const isFirstPage = pageIdx === 0
        const isFirstOverall = index === 0 && isFirstPage
        const totalPages = pages.length
        const titleNode = isHero ? renderHeroTitle() : (isFirstPage ? renderMainTitle() : null)
        const contentNode = (
          <div
            className={isHero ? heroContentClass : mainContentClass}
            dangerouslySetInnerHTML={{ __html: pageHtml }}
          />
        )

        const cardElement = isFrameStyle ? (
          <div style={frameOuterStyle(isFirstOverall)}>
            <div style={frameInnerStyle(isHero)}>
              {titleNode}
              {contentNode}
              {!isHero && renderPageNumber(pageIdx, totalPages)}
            </div>
          </div>
        ) : (
          <div style={pageStyleContainerStyle(isFirstOverall, isHero)}>
            {titleNode}
            {contentNode}
            {!isHero && renderPageNumber(pageIdx, totalPages)}
          </div>
        )

        return (
          <div
            key={pageKey}
            id={pageKey}
            data-page-index={pageIdx}
            data-total-pages={totalPages}
            ref={(el) => {
              if (isFirstPage && typeof ref === 'function') ref(el)
              else if (isFirstPage && ref && 'current' in ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
              registerPageRef?.(pageKey, el)
            }}
          >
            {cardElement}
          </div>
        )
      })}
    </>
  )
})
PagedCard.displayName = 'PagedCard'

export { PagedCard }
