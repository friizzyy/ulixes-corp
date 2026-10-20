import { CtaCard, Section } from '@/components/site'
import { servicesContent } from '@/lib/services-content'
import { Approach } from './approach'
import { Capabilities } from './capabilities'
import { ServicesHero } from './services-hero'

/*
 * /services, as approved in docs/build-spec/services: the hero with its
 * capability bar, the four capability cards, the engagement approach and the
 * closing brief card. The header, phone dock and footer come from the layout.
 */
export function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <Capabilities />
      <Approach />
      <Section wrap={false} aria-label="Start a conversation">
        <CtaCard lead={servicesContent.cta.lead} turn={servicesContent.cta.turn} />
      </Section>
    </>
  )
}
