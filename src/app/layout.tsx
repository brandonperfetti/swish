import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brandon Perfetti - Swish Analytics',
  description: 'Swish Analytics FE Coding Assessment'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">{children}</body>
    </html>
  )
}
