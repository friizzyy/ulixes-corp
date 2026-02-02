import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philosophy',
  description: 'The intellectual foundation that shapes every engagement. Infrastructure is financial architecture that directly shapes earnings behavior, capital ratios, and regulatory exposure.',
  openGraph: {
    title: 'Philosophy | Ulixes Corporation',
    description: 'The intellectual foundation that shapes every engagement we undertake.',
  },
}

export default function PhilosophyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
