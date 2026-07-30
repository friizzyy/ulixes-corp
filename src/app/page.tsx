import {
  CapabilityStage,
  ClosingSignalCTA,
  HomepageHero,
  RepresentativeMandates,
  SeniorJudgment,
  SystemTrace,
} from '@/components/home'
import { siteConfig } from '@/lib/content'
import { createPageMetadata, siteMetadataTitle } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/',
  description: siteConfig.description,
  socialTitle: siteMetadataTitle,
})

export default function HomePage() {
  return (
    <div data-homepage>
      <HomepageHero />
      <SystemTrace />
      <CapabilityStage />
      <RepresentativeMandates />
      <SeniorJudgment />
      <ClosingSignalCTA />
    </div>
  )
}
