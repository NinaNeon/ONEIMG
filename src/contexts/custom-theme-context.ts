import { createContext } from 'react'
import { techTemplate } from '@/theme/templates'

export const CustomThemeContext = createContext({
  theme: 'tech_blue',
  template: techTemplate,
  templateName: 'wechat-post-1' as string,
})
