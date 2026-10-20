import { CtaCard, Section } from '@/components/site'
import { CalypsoHero } from '@/components/calypso/calypso-hero'
import { CalypsoMandates } from '@/components/calypso/calypso-mandates'
import { CalypsoPrograms } from '@/components/calypso/calypso-programs'
import { LifecycleChain } from '@/components/calypso/lifecycle-chain'
import { calypsoClose } from '@/lib/calypso-content'
import styles from './nasdaq-calypso.module.css'

/*
 * /nasdaq-calypso, as approved in docs/build-spec/calypso: the image hero with
 * its facts, the seven-stage lifecycle, the eight programs, the four mandate
 * shapes, and the closing brief card. The header, phone dock and footer come
 * from the root layout; on the phone the hero draws the brand itself.
 */
export default function NasdaqCalypsoPage() {
  return (
    <div className={styles.page}>
      <CalypsoHero />

      <Section id="lifecycle" className={styles.anchor} aria-labelledby="lifecycle-title">
        <LifecycleChain />
      </Section>

      <Section id="programs" className={styles.anchor} aria-labelledby="programs-title">
        <CalypsoPrograms />
      </Section>

      <Section id="mandates" className={styles.anchor} aria-labelledby="mandates-title">
        <CalypsoMandates />
      </Section>

      <Section wrap={false}>
        <CtaCard lead={calypsoClose.lead} turn={calypsoClose.turn} />
      </Section>
    </div>
  )
}
