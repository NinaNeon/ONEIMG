import { forwardRef, useContext, useImperativeHandle, useMemo, useRef } from 'react'
import { Card } from './card'
import { PagedCard } from './paged-card'
import type { ContentWithId, PreviewRef } from '@/types'
import { cn } from '@/lib'
import { CustomThemeContext } from '@/contexts/custom-theme-context'

const Preview = forwardRef<PreviewRef, { contents: ContentWithId[]; className?: string }>(({ contents, className }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<{ [key: string | number]: HTMLDivElement }>({})
  const ctx = useContext(CustomThemeContext)
  const isPagedTemplate = ctx.templateName === 'page-style' || ctx.templateName === 'page-frame'

  useImperativeHandle(ref, () => ({
    containerRef,
    itemRefs,
  }))

  const parentContents = useMemo(() => {
    const filteredContents = contents.filter(content => !content.parentId)
    return filteredContents.length > 0 ? filteredContents : contents
  }, [contents])

  const childContentsMap = useMemo(() => {
    const childContents = new Map<number, ContentWithId[]>()
    for (const content of contents) {
      if (content.parentId) {
        if (!childContents.has(content.parentId)) {
          childContents.set(content.parentId, [])
        }
        childContents.get(content.parentId)!.push(content)
      }
    }
    return childContents
  }, [contents])

  // 給 PagedCard 的回呼: 把每一頁註冊到 itemRefs
  const registerPageRef = (key: string, el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current[key] = el
    } else {
      delete itemRefs.current[key]
    }
  }

  return (
    <div className={cn(contents.length === 0 && 'h-full', 'one-container', className)} ref={containerRef}>
      {contents.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          <p>无内容可预览</p>
        </div>
      ) : (
        <div className="one-list">
          {parentContents.map((content, parentIndex) => {
            // 兩種書頁模板下 hero+main 都走 PagedCard (子內容仍用原 Card)
            if (isPagedTemplate && !content.parentId) {
              return (
                <PagedCard
                  key={content.id}
                  index={parentIndex}
                  content={content}
                  registerPageRef={registerPageRef}
                />
              )
            }

            // 主題卡(封面) 和子內容仍用原 Card
            return (
              <Card
                index={parentIndex}
                content={content}
                key={content.id}
                childContentsMap={childContentsMap}
                ref={(el) => {
                  itemRefs.current[content.id] = el!
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
})

Preview.displayName = 'Preview'

export { Preview }
