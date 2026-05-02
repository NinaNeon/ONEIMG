'use client'
import { useEffect, useRef, useState } from 'react'
import { GlobalStyles } from 'tss-react'
import {
  CACHE_KEY_TEMPLATE,
  CACHE_KEY_THEME,
  addContent,
  cn,
  deleteContent,
  generateThemeVariables,
  getContents,
  updateContent,
} from '@/lib'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Workspace } from '@/components/workspace/workspace'
import { Header } from '@/components/header/header'
import { Preview } from '@/components/preview/preview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { Content, ContentWithId, PreviewRef, ThemeContent } from '@/types'
import { DEFAULT_TEMPLATE, DEFAULT_THEME } from '@/theme'
import { CustomThemeContext } from '@/contexts/custom-theme-context'
import { useThemeStore } from '@/store/use-theme-store'

export default function Home() {
  const [contents, setContents] = useState<ContentWithId[]>([])
  const { templateName, setTemplateName, theme, setTheme, templateMap, themeMap } = useThemeStore()
  const proposalPadding = useThemeStore(s => s.proposalPadding)
  const proposalHeavyTextColor = useThemeStore(s => s.proposalHeavyTextColor)

  // 企劃書深底文字色 (米白 / 金色) -- 切「金色」時, 比原色票金色 #a08866 微淺
  // holy (深藍 #4a5d7a) 對比較弱, 額外加亮一階, 用 #cdb38a (淡金)
  const goldHex = theme === 'proposal_holy' ? '#cdb38a' : '#b89c75'
  const goldDimRgba = theme === 'proposal_holy'
    ? 'rgba(205, 179, 138, 0.78)'
    : 'rgba(184, 156, 117, 0.75)'
  const heavyTextHex = proposalHeavyTextColor === 'gold' ? goldHex : '#f0eee8'
  const heavyTextDimHex = proposalHeavyTextColor === 'gold'
    ? goldDimRgba
    : 'rgba(240, 238, 232, 0.7)'

  const proposalCssVars = templateName === 'proposal'
    ? {
        '--proposal-padding-x': `${proposalPadding}px`,
        '--proposal-heavy-text': heavyTextHex,
        '--proposal-heavy-text-dim': heavyTextDimHex,
      } as React.CSSProperties
    : undefined
  const [cssVariables, setCssVariables] = useState({})
  const [tabValue, setTabValue] = useState('workspace')
  const { toast } = useToast()
  const previewRef = useRef<PreviewRef>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentTemplate = (localStorage.getItem(CACHE_KEY_TEMPLATE) || DEFAULT_TEMPLATE)
      setTemplateName(currentTemplate)

      const currentTheme = localStorage.getItem(CACHE_KEY_THEME) || DEFAULT_THEME.label
      setTheme(currentTheme)
    }
  }, [setTemplateName, setTheme])

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getContents()
        setContents(data)
      } catch (error) {
        toast({
          title: '加载失败',
          description: '请刷新后重试',
          duration: 1000,
        })
      }
    }

    fetchContents()
  }, [toast])

  useEffect(() => {
    const templateConfig = themeMap[templateName].find(item => item.label === theme)

    if (templateConfig) {
      const cssVariables = generateThemeVariables(templateConfig.theme!) as Record<string, string>

      // ★ 把 proposal 動態設定也注入 :root, 跟其他 css var 同層,
      //   避免 var 巢狀解析跨層失敗
      if (templateName === 'proposal') {
        cssVariables['--proposal-heavy-text'] = heavyTextHex
        cssVariables['--proposal-heavy-text-dim'] = heavyTextDimHex
        cssVariables['--proposal-padding-x'] = `${proposalPadding}px`
      }

      setCssVariables(cssVariables)
    }
  }, [theme, templateName, themeMap, heavyTextHex, heavyTextDimHex, proposalPadding])

  async function handleThemeContentSubmit(themeContent: ThemeContent) {
    try {
      if ('id' in themeContent) {
        const updatedContent = {
          ...themeContent,
          type: 'theme_content',
        } as ContentWithId
        await updateContent(updatedContent)
        setContents(contents.map(item => (item.id === updatedContent.id ? updatedContent : item)))
      } else {
        const newContent = {
          ...themeContent,
          type: 'theme_content',
        } as Content
        const id = await addContent(newContent)
        setContents(prevContents => [...prevContents, { ...newContent, id }])
        setTemplateName(themeContent.template)
        setTheme(themeContent.theme)
        window.localStorage.setItem('currentTemplate', themeContent.template)
      }
    } catch (error) {
      toast({
        title: '添加失败',
        description: '请重试',
      })
    }
  }

  async function handleContentSubmit(content: Content) {
    try {
      if ('id' in content) {
        await updateContent(content as ContentWithId)
        setContents(contents.map(item => (item.id === content.id ? content as ContentWithId : item)))
      } else {
        const newContent = {
          ...content,
          type: 'normal_content',
        } as Content
        const id = await addContent(newContent)
        setContents(prevContents => [...prevContents, { ...newContent, id }])
      }
    } catch (error) {
      toast({
        title: '添加失败',
        description: '请重试',
      })
    }
  }

  async function handleContentDelete(content: ContentWithId) {
    try {
      const allDeletedContents = contents.filter(item => item.parentId === content.id)
      allDeletedContents.push(content)
      const allDeletedContentIds = allDeletedContents.map(item => item.id)
      setContents(contents.filter(item => !allDeletedContentIds.includes(item.id)))

      // Iterate through all deleted contents and delete each one
      for (const content of allDeletedContents) {
        await deleteContent(content.id)
      }

      toast({
        title: '内容已删除',
        description: '',
        duration: 5000,
        action: <ToastAction altText="undo" onClick={() => handeleContentsUndo(allDeletedContents)}>撤销</ToastAction>,
      })
    } catch (error) {
      toast({
        title: '删除失败',
        description: '请重试',
      })
    }
  }

  async function handeleContentsUndo(deletedContents: Content[]) {
    try {
      for (const content of deletedContents) {
        await addContent(content)
      }
      setContents(contents)
    } catch (error) {
      toast({
        title: '撤销失败',
        description: '',
      })
    }
  }

  return (
    <CustomThemeContext.Provider value={{ theme, template: templateMap[templateName], templateName }}>
      <GlobalStyles styles={{ ':root': cssVariables }} />
      <div className="flex flex-col h-full">
        <Header
          contents={contents}
          setContents={setContents}
          previewRef={previewRef}
          templateName={templateName}
          setTemplateName={setTemplateName}
          theme={theme}
          setTheme={setTheme}
          setTableValue={setTabValue}
        />
        <main className="h-[calc(100%-58px)]">
          <Tabs
            defaultValue="workspace"
            activationMode="manual"
            value={tabValue}
            onValueChange={setTabValue}
            className="h-full flex flex-col sm:flex-row"
          >
            <TabsList className="grid w-full grid-cols-2 sm:hidden">
              <TabsTrigger value="workspace">编辑器</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" forceMount className="data-[state=inactive]:hidden sm:!block flex-grow sm:flex-grow-0 flex-shrink sm:flex-shrink-0 overflow-y-auto mt-0">
              <div
                style={proposalCssVars}
                className={
                  cn(
                    'one scroll-smooth h-full mx-auto',
                    (templateName === 'page-style' || templateName === 'page-frame' || templateName === 'serif-long-wide')
                      ? 'w-[800px] max-w-full px-4 py-6'
                      : templateName === 'proposal'
                        ? 'w-[600px] max-w-full px-4 py-6'
                        : 'w-[375px]',
                  )
                }>
                <Preview ref={previewRef} contents={contents} className="w-full flex flex-col m-auto" />
              </div>
            </TabsContent>
            <TabsContent value="workspace" forceMount className="data-[state=inactive]:hidden sm:flex-grow sm:!block overflow-auto">
              <div className="h-full flex-grow flex justify-center items-start bg-card text-card-foreground">
                <Workspace
                  contents={contents}
                  setContents={setContents}
                  onContentSubmit={handleContentSubmit}
                  onContentDelete={handleContentDelete}
                  onThemeContentSubmit={handleThemeContentSubmit}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </CustomThemeContext.Provider>
  )
}
