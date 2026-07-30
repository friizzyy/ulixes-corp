import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/institutional-experience',
  title: 'Institutional Experience',
  description: 'Ulysses Williams has Calypso experience since 2004 across front-, middle-, and back-office delivery.',
  socialTitle: 'Institutional Experience | Ulixes Corporation',
  socialDescription: "Ulysses Williams's experience spans North America, Europe, APAC, Latin America, interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives.",
})

export default function InstitutionalExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
