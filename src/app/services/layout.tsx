import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/services',
  title: 'Services',
  description: 'Infrastructure decisions shape financial outcomes. We design for alignment across accounting, capital, and regulatory requirements with proven Calypso platform expertise.',
  socialTitle: 'Services | Ulixes Corporation',
  socialDescription: 'Infrastructure decisions shape financial outcomes. We design for alignment across accounting, capital, and regulatory requirements.',
})

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
