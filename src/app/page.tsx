import {
  HeroSection,
  ServicesSection,
  CTASection,
  PhilosophySection,
  ProcessSection,
} from '@/components/sections'
import { PageTransition } from '@/components/ui'

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <PhilosophySection />
      <ServicesSection />
      <ProcessSection />
      <CTASection />
    </PageTransition>
  )
}
