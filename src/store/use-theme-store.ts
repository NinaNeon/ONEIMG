import { create } from 'zustand'
import type { ArticleModuleTemplate, ThemeColorItem } from '@/types'
import { DEFAULT_TEMPLATE, DEFAULT_TEMPLATE_MAP, DEFAULT_THEME, DEFAULT_THEME_COLOR_MAP } from '@/theme'

export type PageDensity = 1000 | 2000
export type FrameMargin = 8 | 16 | 32
export type FrameOuterColor = 'paper' | 'white'
export type ProposalPadding = 56 | 36 | 20
export type ProposalHeavyTextColor = 'cream' | 'gold'

interface TemplateStore {
  templateMap: Record<string, ArticleModuleTemplate>;
  templateName: string;
  theme: string;
  themeMap: Record<string, ThemeColorItem[]>;
  pageDensity: PageDensity;
  frameMargin: FrameMargin;
  frameOuterColor: FrameOuterColor;
  proposalPadding: ProposalPadding;
  proposalHeavyTextColor: ProposalHeavyTextColor;
  setTemplateName: (templateName: string) => void;
  setTheme: (theme: string) => void;
  setTemplateMap: (templateMap: Record<string, ArticleModuleTemplate>) => void;
  setPageDensity: (density: PageDensity) => void;
  setFrameMargin: (m: FrameMargin) => void;
  setFrameOuterColor: (c: FrameOuterColor) => void;
  setProposalPadding: (p: ProposalPadding) => void;
  setProposalHeavyTextColor: (c: ProposalHeavyTextColor) => void;
}

export const useThemeStore = create<TemplateStore>(set => ({
  templateName: DEFAULT_TEMPLATE,
  theme: DEFAULT_THEME.label,
  templateMap: DEFAULT_TEMPLATE_MAP,
  themeMap: DEFAULT_THEME_COLOR_MAP,
  pageDensity: 1000,
  frameMargin: 16,
  frameOuterColor: 'paper',
  proposalPadding: 56,
  proposalHeavyTextColor: 'cream',
  setTemplateName: templateName => set({ templateName }),
  setTemplateMap: templateMap => set({ templateMap }),
  setTheme: theme => set({ theme }),
  setPageDensity: pageDensity => set({ pageDensity }),
  setFrameMargin: frameMargin => set({ frameMargin }),
  setFrameOuterColor: frameOuterColor => set({ frameOuterColor }),
  setProposalPadding: proposalPadding => set({ proposalPadding }),
  setProposalHeavyTextColor: proposalHeavyTextColor => set({ proposalHeavyTextColor }),
}))
