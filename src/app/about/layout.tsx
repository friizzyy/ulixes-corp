import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/about',
  title: 'About',
  description: 'Senior practitioners with 20+ years of Calypso platform expertise. We came from trading floors, treasury functions, and Big Four advisory practices.',
  socialTitle: 'About | Ulixes Corporation',
  socialDescription: 'Senior practitioners with 20+ years of Calypso platform expertise helping banks and hedge funds with capital markets infrastructure.',
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
