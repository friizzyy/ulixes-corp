import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a conversation about your capital markets infrastructure challenges. If your problem sits at the intersection of accounting, risk, and systems, we should talk.',
  openGraph: {
    title: 'Contact | Ulixes Corporation',
    description: 'Start a conversation about your capital markets infrastructure challenges.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
