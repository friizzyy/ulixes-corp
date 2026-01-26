import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Patterns from our work with banks and hedge funds. Case studies in platform migrations, hedge accounting redesigns, and capital markets infrastructure.',
  openGraph: {
    title: 'Work | Ulixes Corporation',
    description: 'Case studies from our work with banks and hedge funds on capital markets infrastructure.',
  },
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
