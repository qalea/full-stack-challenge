import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/providers'
import '@/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Notes App',
  description: 'Create, organise, and search your notes',
}

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="bg-surface-muted h-full font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
