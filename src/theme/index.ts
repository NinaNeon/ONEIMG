import {
  frameBronze, frameHoly, frameInk, frameSteel, frameStone, frameVermilion, frameViolet,
  pageBronze, pageHoly, pageInk, pageSteel, pageStone, pageTemplate, pageVermilion, pageViolet,
  pageFrameTemplate,
  proposalBronze, proposalHoly, proposalInk, proposalMidnight, proposalSteel, proposalStone,
  proposalTemplate, proposalVermilion, proposalViolet,
  serifLongBronze, serifLongHoly, serifLongInk, serifLongSteel, serifLongStone,
  serifLongTemplate, serifLongVermilion, serifLongViolet,
  serifLongWideTemplate,
  serifWideBronze, serifWideHoly, serifWideInk, serifWideSteel, serifWideStone, serifWideVermilion, serifWideViolet,
  simpleSnowBlack, simpleSnowWhite, simpleTemplate,
  techBlue, techRoseRed, techTemplate, techVibrantOrange,
} from './templates'
import type { ArticleModuleTemplate, ThemeColorItem } from '@/types'

export const DEFAULT_TEMPLATES = [
  { label: '简约科技风格', value: 'wechat-post-1', disabled: false, template: techTemplate },
  { label: '企劃書風格', value: 'proposal', disabled: false, template: proposalTemplate },
  { label: '黑白苹果风格', value: 'apple-style', disabled: false, template: simpleTemplate },
  { label: '思源宋體 長圖', value: 'serif-long', disabled: false, template: serifLongTemplate },
  { label: '思源宋體 長圖（寬版・一行32字）', value: 'serif-long-wide', disabled: false, template: serifLongWideTemplate },
  { label: '書頁排版（思源宋體）', value: 'page-style', disabled: false, template: pageTemplate },
  { label: '書頁排版（內凹邊框）', value: 'page-frame', disabled: false, template: pageFrameTemplate },
  { label: '更多模版尽情期待', value: 'post-more', disabled: true, template: null },
] as const

export const DEFAULT_TEMPLATE_MAP = DEFAULT_TEMPLATES
  .filter(item => !item.disabled)
  .reduce((acc, cur) => {
    const { value, template } = cur
    acc[value] = template
    return acc
  }, {} as Record<string, ArticleModuleTemplate>)

export const DEFAULT_THEME_COLOR_MAP: Record<string, ThemeColorItem[]> = {
  'wechat-post-1': [
    { value: '#4a5d7a', label: 'tech_blue', theme: techBlue },
    { value: '#a08866', label: 'vibrant_orange', theme: techVibrantOrange },
    { value: '#7a1e22', label: 'rose_red', theme: techRoseRed },
  ],
  'proposal': [
    { value: '#15171a', label: 'proposal_ink', theme: proposalInk },
    { value: '#2a2c30', label: 'proposal_stone', theme: proposalStone },
    { value: '#1c2540', label: 'proposal_midnight', theme: proposalMidnight },
    { value: '#7a1e22', label: 'proposal_vermilion', theme: proposalVermilion },
    { value: '#4a5d7a', label: 'proposal_holy', theme: proposalHoly },
    { value: '#6b7a8f', label: 'proposal_steel', theme: proposalSteel },
    { value: '#a08866', label: 'proposal_bronze', theme: proposalBronze },
    { value: '#9c8cb8', label: 'proposal_violet', theme: proposalViolet },
  ],
  'apple-style': [
    { value: '#ddd', label: 'snow_white', theme: simpleSnowWhite },
    { value: '#000', label: 'midnight_black', theme: simpleSnowBlack },
  ],
  'serif-long': [
    { value: '#15171a', label: 'serif_long_ink', theme: serifLongInk },
    { value: '#2a2c30', label: 'serif_long_stone', theme: serifLongStone },
    { value: '#6b7a8f', label: 'serif_long_steel', theme: serifLongSteel },
    { value: '#a08866', label: 'serif_long_bronze', theme: serifLongBronze },
    { value: '#7a1e22', label: 'serif_long_vermilion', theme: serifLongVermilion },
    { value: '#9c8cb8', label: 'serif_long_violet', theme: serifLongViolet },
    { value: '#4a5d7a', label: 'serif_long_holy', theme: serifLongHoly },
  ],
  'serif-long-wide': [
    { value: '#15171a', label: 'serif_wide_ink', theme: serifWideInk },
    { value: '#2a2c30', label: 'serif_wide_stone', theme: serifWideStone },
    { value: '#6b7a8f', label: 'serif_wide_steel', theme: serifWideSteel },
    { value: '#a08866', label: 'serif_wide_bronze', theme: serifWideBronze },
    { value: '#7a1e22', label: 'serif_wide_vermilion', theme: serifWideVermilion },
    { value: '#9c8cb8', label: 'serif_wide_violet', theme: serifWideViolet },
    { value: '#4a5d7a', label: 'serif_wide_holy', theme: serifWideHoly },
  ],
  'page-style': [
    { value: '#15171a', label: 'page_ink', theme: pageInk },
    { value: '#2a2c30', label: 'page_stone', theme: pageStone },
    { value: '#6b7a8f', label: 'page_steel', theme: pageSteel },
    { value: '#a08866', label: 'page_bronze', theme: pageBronze },
    { value: '#7a1e22', label: 'page_vermilion', theme: pageVermilion },
    { value: '#9c8cb8', label: 'page_violet', theme: pageViolet },
    { value: '#4a5d7a', label: 'page_holy', theme: pageHoly },
  ],
  'page-frame': [
    { value: '#15171a', label: 'frame_ink', theme: frameInk },
    { value: '#2a2c30', label: 'frame_stone', theme: frameStone },
    { value: '#6b7a8f', label: 'frame_steel', theme: frameSteel },
    { value: '#a08866', label: 'frame_bronze', theme: frameBronze },
    { value: '#7a1e22', label: 'frame_vermilion', theme: frameVermilion },
    { value: '#9c8cb8', label: 'frame_violet', theme: frameViolet },
    { value: '#4a5d7a', label: 'frame_holy', theme: frameHoly },
  ],
  'default': [
    { value: '#4a5d7a', label: 'tech_blue', theme: techBlue },
    { value: '#a08866', label: 'vibrant_orange', theme: techBlue },
    { value: '#7a1e22', label: 'rose_red', theme: techBlue },
  ],
}

export const DEFAULT_TEMPLATE = 'page-frame'
export const DEFAULT_THEME = {
  label: 'frame_vermilion',
  value: '#7a1e22',
}
