import { LegalPage, toLegalSections } from '@/components/legal'
import { privacyContent, siteConfig } from '@/lib/content'

/* Metadata for this segment lives in ./layout.tsx. */

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={privacyContent.title}
      updated={privacyContent.lastUpdated}
      sections={toLegalSections(privacyContent.sections)}
      closing="Questions about our privacy practices? Contact us directly."
      email={siteConfig.email}
      cross={{ label: 'View Terms of Service', href: '/terms' }}
      reader
    />
  )
}
