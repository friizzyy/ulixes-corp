import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'

/*
 * The route is /nasdaq-calypso rather than /calypso because that is how the
 * product is branded now and how it is searched. The description leads on the
 * term for the same reason: this is the one page on the site that should be
 * unambiguously Calypso-first, which is what allows the rest of it not to be.
 */
const description =
  'Nasdaq Calypso expertise since 2004, across front office, risk, accounting, collateral, operations, testing, migration, and implementation for banks and hedge funds.'
const title = 'Nasdaq Calypso Expertise'

export const metadata: Metadata = {
  title,
  ...createRouteMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    path: '/nasdaq-calypso',
  }),
}

export default function NasdaqCalypsoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
