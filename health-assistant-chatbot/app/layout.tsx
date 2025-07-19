import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MHZ Chatbot',
  description: 'Checks Symptoms',
  generator: 'Mind Hack Zombies',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
