import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/terms',
  title: 'Terms of Service',
  description: 'Ulixes Corporation terms of service. Read our terms and conditions for using our website and services.',
  socialTitle: 'Terms of Service | Ulixes Corporation',
})

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
