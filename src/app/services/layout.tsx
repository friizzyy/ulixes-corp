import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Full-spectrum Calypso expertise: implementation, integration, optimization, and managed support for enterprise trading systems.',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
