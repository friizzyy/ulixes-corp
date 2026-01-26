import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Infrastructure decisions shape financial outcomes. We design for alignment across accounting, capital, and regulatory requirements with proven Calypso platform expertise.',
  openGraph: {
    title: 'Services | Ulixes Corporation',
    description: 'Infrastructure decisions shape financial outcomes. We design for alignment across accounting, capital, and regulatory requirements.',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
