import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'

export const metadata = {
  title: 'NoteHub',
  description: 'NoteHub on Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TanStackProvider>
          <Header />
          {children}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  )
}
