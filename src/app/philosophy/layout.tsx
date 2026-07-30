import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/philosophy',
  title: 'Philosophy',
  description: 'The intellectual foundation that shapes every engagement. Infrastructure is financial architecture that directly shapes earnings behavior, capital ratios, and regulatory exposure.',
  socialTitle: 'Philosophy | Ulixes Corporation',
  socialDescription: 'The intellectual foundation that shapes every engagement we undertake.',
})

export default function PhilosophyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
