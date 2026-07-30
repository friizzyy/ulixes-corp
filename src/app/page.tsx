import {
  CapabilityStage,
  ClosingSignalCTA,
  HomepageHero,
  RepresentativeMandates,
  SeniorJudgment,
  SystemTrace,
} from '@/components/home'

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
