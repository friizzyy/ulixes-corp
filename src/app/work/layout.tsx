import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Case studies showcasing successful Calypso implementations, integrations, and optimizations for leading financial institutions.',
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
