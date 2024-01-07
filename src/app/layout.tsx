import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

import Providers from '@/components/providers'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ContextPDF',
  description: 'Made with love using Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={inter.className}> {children} </body>
          <Toaster />
        </html>
      </Providers>
    </ClerkProvider>
  )
}
