import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, Noto_Serif_TC } from 'next/font/google'
import '@/app/globals.css'
import { headers } from 'next/headers'
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const notoSansSc = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
})

const notoSerifTc = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// 站點 URL: 部署時可由 NEXT_PUBLIC_SITE_URL 環境變數覆寫
// (Vercel 會自動有 VERCEL_URL, 否則 fallback 到 localhost 不會壞)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  title: {
    template: '%s | OneIMG',
    default: 'OneIMG',
  },
  description: 'OneIMG - 文字轉圖片應用,快速生成多種尺寸的圖片',
  openGraph: {
    title: 'OneIMG',
    description: 'OneIMG - 文字轉圖片應用,快速生成多種尺寸的圖片',
    url: SITE_URL,
    siteName: 'OneIMG',
  },
  metadataBase: new URL(SITE_URL),
}

function getPlatform() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''

  if (userAgent.includes('Win')) {
    return 'windows'
  }
  if (userAgent.includes('Mac')) {
    return 'mac'
  }
  if (userAgent.includes('X11')) {
    return 'unix'
  }
  if (userAgent.includes('Linux')) {
    return 'linux'
  }
  if (userAgent.includes('Android')) {
    return 'android'
  }
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    return 'ios'
  }

  return 'unknown'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full break-words overflow-hidden" data-platform={getPlatform()}>
      <body className={cn('h-full overflow-hidden antialiased', notoSansSc.variable, notoSerifTc.variable)}>
        <NextAppDirEmotionCacheProvider options={{ key: 'tss' }}>
          {children}
          <Toaster />
        </NextAppDirEmotionCacheProvider>
      </body>
    </html>
  )
}

export const runtime = 'edge'
