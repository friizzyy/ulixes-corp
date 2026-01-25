import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philosophy',
  description: 'Elite Mastery: Capital Markets Infrastructure as Financial Architecture. The intellectual foundation that shapes every engagement we undertake.',
}

export default function PhilosophyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
