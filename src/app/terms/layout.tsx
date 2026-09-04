import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'

const title = 'Terms of Service'
const description =
  'Ulixes Corporation terms of service. Read our terms and conditions for using our website and services.'

export const metadata: Metadata = {
  title,
  ...createRouteMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    path: '/terms',
  }),
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
