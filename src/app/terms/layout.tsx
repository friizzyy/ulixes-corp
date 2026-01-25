import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Ulixes Corporation terms of service. Read our terms and conditions for using our website and services.',
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
