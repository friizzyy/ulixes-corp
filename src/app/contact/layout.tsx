import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/contact',
  title: 'Contact',
  description: 'Start a conversation about your capital markets infrastructure challenges. If your problem sits at the intersection of accounting, risk, and systems, we should talk.',
  socialTitle: 'Contact | Ulixes Corporation',
  socialDescription: 'Start a conversation about your capital markets infrastructure challenges.',
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
