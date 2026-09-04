import { toLegalSections } from '@/components/legal'
import { siteConfig, termsContent } from '@/lib/content'
import { TermsDocument } from './terms-document'

/* Metadata for this segment lives in ./layout.tsx. */

export default function TermsPage() {
  return (
    <TermsDocument
      eyebrow="Legal"
      title={termsContent.title}
      updated={termsContent.lastUpdated}
      sections={toLegalSections(termsContent.sections)}
      closing="Questions about these terms? Reach out directly."
      email={siteConfig.email}
      cross={{ label: 'View Privacy Policy', href: '/privacy' }}
    />
  )
}
