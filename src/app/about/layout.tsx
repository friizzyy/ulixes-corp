import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/about',
  title: 'About',
  description: 'Ulysses Williams has Calypso experience since 2004, spanning front-, middle-, and back-office delivery across North America, Europe, APAC, and Latin America.',
  socialTitle: 'About | Ulixes Corporation',
  socialDescription: "Ulysses Williams's product-domain experience covers interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives.",
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
