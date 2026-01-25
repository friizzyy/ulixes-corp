import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Engineering excellence for capital markets. Learn about our philosophy, approach, and team.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
