import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/privacy',
  title: 'Privacy Policy',
  description: 'Ulixes Corporation privacy policy. Learn how we collect, use, and protect your information.',
  socialTitle: 'Privacy Policy | Ulixes Corporation',
})

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
