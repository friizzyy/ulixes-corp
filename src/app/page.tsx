import type { Metadata } from 'next'
import {
  CapabilityStage,
  ClosingSignalCTA,
  HomepageHero,
  RepresentativeMandates,
  SeniorJudgment,
  SystemTrace,
} from '@/components/home'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

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
