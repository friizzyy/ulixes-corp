import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/institutional-experience',
  title: 'Institutional Experience',
  description: 'Built inside global capital markets institutions over two decades. Not alongside them.',
  socialTitle: 'Institutional Experience | Ulixes Corporation',
})

export default function InstitutionalExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
