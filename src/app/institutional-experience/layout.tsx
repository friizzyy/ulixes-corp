import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'

const title = 'Institutional Experience'
const description =
  'Ulysses Williams brings Calypso experience since 2004, a front-to-back operating perspective, and work across North America, Europe, APAC, and Latin America.'

export const metadata: Metadata = {
  title,
  ...createRouteMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    path: '/institutional-experience',
  }),
}

export default function InstitutionalExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
