import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Senior practitioners with 20+ years of Calypso platform expertise. We came from trading floors, treasury functions, and Big Four advisory practices.',
  openGraph: {
    title: 'About | Ulixes Corporation',
    description: 'Senior practitioners with 20+ years of Calypso platform expertise helping banks and hedge funds with capital markets infrastructure.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
