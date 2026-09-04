import type { Metadata } from 'next'
import { StatusPage } from '@/components/legal/status-page'
import { notFoundContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Page not found',
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
  },
}

/*
 * The content's title ("Page Not Found") would repeat the eyebrow word for
 * word, so the heading is its statement instead.
 */
export default function NotFound() {
  return (
    <StatusPage
      eyebrow="Page not found"
      title={notFoundContent.description}
      body="The address may have changed, or the page has been retired."
      primary={{ label: 'Return home', href: '/' }}
      secondary={{ label: 'See the capabilities', href: '/services' }}
    />
  )
}
