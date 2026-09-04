import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'

/*
 * Description rewritten out of company-wide "we". The verified-claims
 * guardrails require claims to describe Ulysses Williams's experience rather
 * than a firm, and the previous copy asserted "We design for alignment".
 */
/*
 * Repositioned from Calypso-first to capability-first. Calypso is deliberately
 * still here, and still named: this page is one of the two that currently rank
 * for it, so the term moves down the sentence rather than out of it. The depth
 * lives at /nasdaq-calypso.
 */
const description =
  'Capital markets transformation and solution architecture, accounting and controls, trading risk and post-trade, and transformation assurance for banks and hedge funds. Supported by deep Nasdaq Calypso expertise.'
const title = 'Capital Markets Transformation Services'

export const metadata: Metadata = {
  title,
  ...createRouteMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    path: '/services',
  }),
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
