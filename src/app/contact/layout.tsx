import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'

/*
 * Rewritten out of company-wide "we". The previous description ended "we
 * should talk", which describes a firm rather than a senior practitioner
 * responding directly.
 */
const description =
  'Describe a Calypso platform change that needs senior attention. Ulysses Williams responds directly.'
const title = 'Contact'

export const metadata: Metadata = {
  title,
  ...createRouteMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    path: '/contact',
  }),
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
