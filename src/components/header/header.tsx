'use client'

import { BookOpen, ChevronDown, Download, Folder, ImageDown, LinkIcon, MessageSquareMore, Trash2, TriangleAlert } from 'lucide-react'
// import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { ExportImageDialog } from './export-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import type { Content, ContentWithId, PreviewRef } from '@/types'
import type { ExportContent, ExportJSON } from '@/components/header/types'
import {
  CACHE_KEY_TEMPLATE, CACHE_KEY_THEME,
  addAllContents,
  cn,
  removeAllContents,
  removeHtmlTags,
} from '@/lib'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  // MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DEFAULT_TEMPLATE,
  DEFAULT_TEMPLATES,
  DEFAULT_THEME,
  DEFAULT_THEME_COLOR_MAP,
} from '@/theme'
import { usePlatform } from '@/hooks/use-platform'
import { useThemeStore } from '@/store/use-theme-store'

interface HeaderProps {
  contents: Content[];
  setContents: (contents: ContentWithId[]) => void;
  previewRef: React.RefObject<PreviewRef>;
  templateName: string;
  theme: string;
  setTemplateName: (template: string) => void;
  setTheme: (color: string) => void
  setTableValue?: (tab: string) => void
}

type DialogType = 'save_file' | 'open_file' | 'reset_data' | 'user_guide'

export function Header(props: HeaderProps) {
  const [isOpenFile, setIsOpenFile] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<DialogType>('save_file')
  const [isExporting, setIsExporting] = useState(true)
  const [scale, setScale] = useState('1')
  const platform = usePlatform()
  const { contents, setContents, previewRef, templateName, theme, setTemplateName, setTheme, setTableValue } = props
  const pageDensity = useThemeStore(s => s.pageDensity)
  const setPageDensity = useThemeStore(s => s.setPageDensity)
  const frameMargin = useThemeStore(s => s.frameMargin)
  const setFrameMargin = useThemeStore(s => s.setFrameMargin)
  const frameOuterColor = useThemeStore(s => s.frameOuterColor)
  const setFrameOuterColor = useThemeStore(s => s.setFrameOuterColor)
  const proposalPadding = useThemeStore(s => s.proposalPadding)
  const setProposalPadding = useThemeStore(s => s.setProposalPadding)
  const proposalHeavyTextColor = useThemeStore(s => s.proposalHeavyTextColor)
  const setProposalHeavyTextColor = useThemeStore(s => s.setProposalHeavyTextColor)
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Regenerate images when the contents are updated
    setIsExporting(true)
  }, [contents])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'o' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (!contents.length) {
          handleOpenfileBtnClick()
        } else {
          handleDialogOpen('open_file')
        }
      }

      if (e.key === 'e' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setImageDialogOpen(true)
        setIsExporting(true)
        setScale('1')
        // open preview
        setTableValue && setTableValue('preview')
      }

      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleDialogOpen('save_file')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [contents.length, setTableValue])

  // open different dialog by type
  function handleDialogOpen(type: DialogType) {
    setIsOpenFile(true)
    setDialogType(type)
  }

  function handleOpenfileBtnClick() {
    if (fileRef.current) {
      fileRef.current.click()
      setIsOpenFile(false)
    }
  }

  // open from file
  function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      // Check if it's a JSON file
      const reader = new FileReader()
      reader.onload = async (e) => {
        const json = e.target?.result as string
        try {
          const importData = JSON.parse(json) as ExportJSON
          if (typeof importData !== 'object' || importData === null) {
            toast({
              title: 'Empty JSON file',
              description: 'Please upload a valid oneimg file.',
            })
            return
          }

          if (!(importData.type && importData.type === 'oneimg')) {
            toast({
              title: 'Invalid file format',
              description: 'Please upload a valid oneimg file.',
            })
            return
          }

          if (importData.data && typeof importData.data === 'object') {
            const exportContents = importData.data
            const contents: ContentWithId[] = exportContents.map(item => item)

            // remove previous all data
            await removeAllContents()
            // cache import data
            await addAllContents(contents)
            setContents(contents)

            const templateName = (importData.theme ?? DEFAULT_TEMPLATE)
            const theme = importData.themeColor ?? DEFAULT_THEME.label
            setTemplateName(templateName)
            setTheme(theme)
            localStorage.setItem(CACHE_KEY_TEMPLATE, templateName)
            localStorage.setItem(CACHE_KEY_THEME, theme)

            // 允许前后两次选择相同文件
            event.target.value = ''
          }
        } catch (error) {
          toast({
            title: 'Invalid file format',
            description: 'Please upload a valid oneimg file.',
          })
        }
      }
      reader.readAsText(file)
    }
  }

  // save as file
  async function handleFileSave() {
    const exportContents = await Promise.all(
      contents.map((item) => {
        return {
          id: item.id,
          title: item.title,
          type: item.type,
          content: item.content,
          parentId: item.parentId,
          uploadFiles: item.uploadFiles,
        } as ExportContent
      }),
    )

    const exportData: ExportJSON = {
      type: 'oneimg',
      version: 1,
      source: 'https://github.com/NinaNeon/ONEIMG',
      theme: templateName ?? DEFAULT_TEMPLATE,
      themeColor: theme ?? DEFAULT_THEME.label,
      data: exportContents,
    }

    // get theme content
    const title = exportContents.find(item => item.type === 'theme_content')?.title
    const date = new Date()
    const fullDateString = `${date.toLocaleDateString().replace(/\//g, '-')}_${date.toLocaleTimeString().replaceAll(':', '')}`
    const fileName = `${removeHtmlTags(title) || '未命名'}-${fullDateString}.oneimg`

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    try {
      // open the system file save dialog
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'OneImg File',
            accept: { 'application/json': ['.oneimg'] },
          }],
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        toast({
          title: '文件已保存',
          duration: 1000,
        })
      } else {
        // eslint-disable-next-line no-alert
        const suggestedName = prompt('文件名称', fileName) || fileName
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = suggestedName
        a.click()
        URL.revokeObjectURL(a.href)
      }
    } catch (error) {
      console.log('File save failed', error)
    }
  }

  async function handleDataClear() {
    await removeAllContents()
    localStorage.clear()
    setContents([])
    setIsOpenFile(false)
    setTemplateName(DEFAULT_TEMPLATE)
    setTheme(DEFAULT_THEME.label)
  }

  // open the dialog of saving as image
  async function handleImageExportDialogOpen() {
    setImageDialogOpen(true)
    setIsExporting(true)
    setScale('1')
    // open preview
    setTableValue && setTableValue('preview')
  }

  return (
    <TooltipProvider>
      <header className="h-[58px] flex gap-4 items-center px-4 border-b border-b-gray-200">
        {/* <Link href="/"> */}
        {/*   <Logo type="full" /> */}
        {/* </Link> */}
        <Input onChange={handleFileImport} type="file" accept=".oneimg" className="hidden" ref={fileRef} />
        <Menubar className="p-0 cursor-pointer border-none bg-white hover:bg-accent">
          <MenubarMenu>
            <MenubarTrigger>
              <Logo type="full" />
              <ChevronDown className="ml-2 h-4 w-4" />
            </MenubarTrigger>
            <MenubarContent className="max-h-[calc(100vh-150px)] overflow-y-auto">
              <MenubarItem onClick={() => {
                if (!contents.length) {
                  handleOpenfileBtnClick()
                } else {
                  handleDialogOpen('open_file')
                }
              }}>
                <Folder className="w-4 h-4 mr-2" />
                <span>打开文件</span>
                {platform === 'mac' && <MenubarShortcut>⌘+O</MenubarShortcut>}
                {platform === 'windows' && <MenubarShortcut>Ctrl+O</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem onClick={() => handleDialogOpen('save_file')}>
                <Download className="w-4 h-4 mr-2" />
                <span>保存到...</span>
                {platform === 'mac' && <MenubarShortcut>⌘+S</MenubarShortcut>}
                {platform === 'windows' && <MenubarShortcut>Ctrl+S</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem onClick={() => handleDialogOpen('reset_data')}>
                <Trash2 className="w-4 h-4 mr-2" />
                <span>重置项目</span>
              </MenubarItem>
              <MenubarItem onClick={handleImageExportDialogOpen}>
                <ImageDown className="w-4 h-4 mr-2" />
                <span>导出图片</span>
                {platform === 'mac' && <MenubarShortcut>⌘+Shift+E</MenubarShortcut>}
                {platform === 'windows' && <MenubarShortcut>Ctrl+Shift+E</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem onClick={() => handleDialogOpen('user_guide')} >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>指南</span>
              </MenubarItem>
              <MenubarItem asChild>
                <a href="https://github.com/NinaNeon/ONEIMG" target="_blank" rel="noreferrer">
                  <Image src="/images/github.svg" alt="github icon" className="w-4 h-4 mr-2" width={24} height={24} />
                  <span>Github</span>
                </a>
              </MenubarItem>
              <MenubarSeparator />
              <div className="px-1.5 py-2 text-sm">
                <div className="mb-2">模板</div>
                <Select value={templateName} onValueChange={(value: string) => {
                  const themeColor = DEFAULT_THEME_COLOR_MAP[value][0].label
                  setTemplateName(value)
                  setTheme(themeColor)
                  localStorage.setItem(CACHE_KEY_TEMPLATE, value)
                  localStorage.setItem(CACHE_KEY_THEME, themeColor)
                }}>
                  <SelectTrigger className="h-8">
                    <SelectValue className="text-muted-foreground" placeholder="请选择一个主题模版" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        DEFAULT_TEMPLATES.map(template => (
                          <SelectItem key={template.value} value={template.value} disabled={template.disabled}>
                            {template.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent >
                </Select >
              </div >
              <div className="px-1.5 py-2 text-sm">
                <div className="mb-2">模版色</div>
                <div>
                  {DEFAULT_THEME_COLOR_MAP[templateName].map(color => (
                    <Button
                      key={color.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTheme(color.label)
                        localStorage.setItem(CACHE_KEY_THEME, color.label)
                      }}
                      className={cn({ 'bg-accent': theme === color.label })}>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                    </Button>
                  ))}
                </div>
              </div>
              {templateName === 'page-frame' && (
                <div className="px-1.5 py-2 text-sm border-t mt-1">
                  <div className="mb-2">每頁字數</div>
                  <div className="flex gap-1">
                    <Button
                      variant={pageDensity === 1000 ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPageDensity(1000)}
                      className="h-7 px-3 text-xs"
                    >
                      約 1000 字
                    </Button>
                    <Button
                      variant={pageDensity === 2000 ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPageDensity(2000)}
                      className="h-7 px-3 text-xs"
                    >
                      約 2000 字
                    </Button>
                  </div>
                </div>
              )}
              {templateName === 'page-frame' && (
                <div className="px-1.5 py-2 text-sm border-t mt-1">
                  <div className="mb-2">外白邊寬度</div>
                  <div className="flex gap-1">
                    {([8, 16, 32] as const).map(m => (
                      <Button
                        key={m}
                        variant={frameMargin === m ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFrameMargin(m)}
                        className="h-7 px-3 text-xs"
                      >
                        {m}px
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {templateName === 'page-frame' && (
                <div className="px-1.5 py-2 text-sm border-t mt-1">
                  <div className="mb-2">外白邊色</div>
                  <div className="flex gap-1">
                    <Button
                      variant={frameOuterColor === 'paper' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFrameOuterColor('paper')}
                      className="h-7 px-3 text-xs"
                    >
                      紙白
                    </Button>
                    <Button
                      variant={frameOuterColor === 'white' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFrameOuterColor('white')}
                      className="h-7 px-3 text-xs"
                    >
                      純白
                    </Button>
                  </div>
                </div>
              )}
              {templateName === 'proposal' && (
                <div className="px-1.5 py-2 text-sm border-t mt-1">
                  <div className="mb-2">左右留白</div>
                  <div className="flex gap-1">
                    {([56, 36, 20] as const).map(p => (
                      <Button
                        key={p}
                        variant={proposalPadding === p ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setProposalPadding(p)}
                        className="h-7 px-3 text-xs"
                      >
                        {p}px
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {templateName === 'proposal' && ['proposal_ink', 'proposal_stone', 'proposal_midnight', 'proposal_vermilion', 'proposal_holy'].includes(theme) && (
                <div className="px-1.5 py-2 text-sm border-t mt-1">
                  <div className="mb-2">深底字色</div>
                  <div className="flex gap-1">
                    <Button
                      variant={proposalHeavyTextColor === 'cream' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setProposalHeavyTextColor('cream')}
                      className="h-7 px-3 text-xs"
                    >
                      米白
                    </Button>
                    <Button
                      variant={proposalHeavyTextColor === 'gold' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setProposalHeavyTextColor('gold')}
                      className="h-7 px-3 text-xs"
                    >
                      金色
                    </Button>
                  </div>
                </div>
              )}
            </MenubarContent >
          </MenubarMenu >
        </Menubar >
        <div className="flex flex-wrap gap-2 ml-auto">
          <Button size="sm" asChild variant="ghost" className="py-2 px-2">
            <a href="https://github.com/NinaNeon/ONEIMG" target="_blank" rel="noreferrer">
              <Image src="/images/github.svg" alt="github icon" className="w-6 h-6" width={24} height={24} />
            </a>
          </Button>
          <Button size="sm" onClick={handleImageExportDialogOpen}>
            <ImageDown className="w-4 h-4 mr-2" />
            <span>导出图片</span>
          </Button>
        </div>
        <Dialog open={isOpenFile} onOpenChange={setIsOpenFile}>
          {dialogType === 'open_file' && <DialogContent className="max-w-full sm:max-w-[900px] px-10 py-8 h-full overflow-y-auto sm:h-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-4">从文件加载</DialogTitle>
              <DialogDescription className="hidden">
                open file
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 p-8 bg-gray-300 rounded-lg">
                <div className="flex flex-grow-0 flex-shrink-0 items-center justify-center bg-yellow-400 w-[56px] h-[56px] rounded-full">
                  <TriangleAlert className="w-6 h-6" />
                </div>
                <div>
                  <p>从文件加载将<strong>替换您现有的内容</strong>。</p>
                  <p>您可以先使用下列方式备份您的数据</p>
                </div>
                <Button variant="default" className="ml-auto bg-yellow-400 text-black hover:bg-yellow-500" onClick={handleOpenfileBtnClick}>
                  从文件加载
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="text-center flex flex-col gap-4 px-6 py-4">
                  <h3 className="font-bold text-xl">保存到本地</h3>
                  <p className="text-sm flex-grow">将主题数据导出为文件，以便以后导入。</p>
                  <Button variant="outline" size="lg" onClick={handleFileSave}>保存到本地</Button>
                </div>

                <div className="text-center flex flex-col gap-4 px-6 py-4">
                  <h3 className="font-bold text-xl">导出为图片</h3>
                  <p className="text-sm flex-grow">将主题数据导出为图片</p>
                  <Button variant="outline" size="lg" onClick={handleImageExportDialogOpen}>导出为图片</Button>
                </div>

                <div className="text-center flex flex-col gap-4 px-6 py-4">
                  <h3 className="font-bold text-xl">OneIMG+</h3>
                  <p className="text-sm flex-grow">将主题数据保存到您的 OneIMG+ 工作区。</p>
                  <Button variant="outline" size="lg" disabled={true}>即将上线</Button>
                </div>
              </div>
            </div>
          </DialogContent>}
          {dialogType === 'save_file' && <DialogContent className="max-w-full sm:max-w-[900px] px-10 py-8 h-full overflow-y-auto sm:h-auto">
            <DialogHeader className="pb-4 border-b mb-4">
              <DialogTitle className="text-2xl">保存到...</DialogTitle>
              <DialogDescription className="hidden">
                save as...
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center justify-center flex-col gap-4 px-8 py-4">
                  <div className="flex flex-grow-0 flex-shrink-0 items-center justify-center bg-primary w-[110px] h-[110px] rounded-full">
                    <Download className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-xl">保存到本地</h3>
                  <p className="text-sm flex-grow">将主题数据导出为文件，以便以后导入。</p>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={async () => {
                      await handleFileSave()
                      setIsOpenFile(false)
                    }}>保存到本地</Button>
                </div>

                <div className="flex items-center justify-center flex-col gap-4 px-8 py-4">
                  <div className="flex flex-grow-0 flex-shrink-0 items-center justify-center bg-primary w-[110px] h-[110px] rounded-full">
                    <LinkIcon className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-xl">分享链接</h3>
                  <p className="text-sm flex-grow">导出为只读链接</p>
                  <Button variant="outline" size="lg" disabled={true}>即将上线</Button>
                </div>

                <div className="flex items-center justify-center flex-col gap-4 px-8 py-4">
                  <div className="flex flex-grow-0 flex-shrink-0 items-center justify-center bg-warning w-[110px] h-[110px] rounded-full">
                    <Logo type="part" className="w-12 h-12 text-warning-foreground" />
                  </div>
                  <h3 className="font-bold text-xl">OneIMG+</h3>
                  <p className="text-sm flex-grow">将主题数据保存到您的 OneIMG+ 工作区。</p>
                  <Button variant="outline" size="lg" disabled={true}>即将上线</Button>
                </div>
              </div>
            </div>
          </DialogContent>}
          {dialogType === 'reset_data' && <DialogContent className="max-w-full sm:max-w-[495px] px-10 py-8 h-full overflow-y-auto sm:h-auto">
            <DialogHeader className="text-2xl pb-4 border-b mb-4">
              <DialogTitle className="">清除数据</DialogTitle>
              <DialogDescription className="hidden">
                reset all data
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8 mb-8">
              <p>
                这将会清除整个主题数据。您是否继续？
              </p>
            </div>
            <DialogFooter>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setIsOpenFile(false)}>取消</Button>
                <Button variant="destructive" onClick={handleDataClear}>确定</Button>
              </div>
            </DialogFooter>
          </DialogContent>}
          {dialogType === 'user_guide' && <DialogContent className="max-w-full sm:max-w-[900px] px-10 py-8 h-full overflow-y-auto sm:h-auto">
            <DialogHeader className="text-2xl pb-4 border-b mb-4">
              <DialogTitle className="">使用指南</DialogTitle>
              <DialogDescription className="hidden">
                User Guide
              </DialogDescription>
            </DialogHeader>
            <div className="prose max-w-none text-sm leading-relaxed">
              <p>1. 從左欄「新增內容」開始,每張卡視為一頁(書頁排版模板下會自動分頁)。</p>
              <p>2. 頂部「模版」選單可選 7 種模板,並切換色票、字數密度、外白邊、padding 等設定。</p>
              <p>3. 完成後按右上「導出圖片」,zip 內每張 PNG 對應一頁。</p>
              <p>4. 內容會儲存在瀏覽器本地端 (IndexedDB),關掉視窗也不會遺失。</p>
            </div>
          </DialogContent>}
        </Dialog>
        <ExportImageDialog
          previewRef={previewRef}
          scale={scale}
          setScale={setScale}
          isExportModalOpen={imageDialogOpen}
          setIsExportModalOpen={setImageDialogOpen}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          templateName={templateName}
        />
      </header >
    </TooltipProvider>
  )
}
