import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'

const title = 'Privacy Policy'
const description =
  'Ulixes Corporation privacy policy. Learn how we collect, use, and protect your information.'

export const metadata: Metadata = {
  title,
  ...createRouteMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    path: '/privacy',
  }),
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
