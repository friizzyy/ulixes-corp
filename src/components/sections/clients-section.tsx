'use client'

import { motion } from 'framer-motion'
import { Section, HorizontalScroll, ScrollCard } from '@/components/ui'
import { GlassSurfaceContainer } from '@/components/system'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const clientTypes = [
  {
    name: 'G-SIB Banks',
    detail: 'Global systemically important institutions',
  },
  {
    name: 'Asset Managers',
    detail: 'Multi-strategy and alternatives',
  },
  {
    name: 'Hedge Funds',
    detail: 'Systematic + discretionary',
  },
  {
    name: 'Broker-Dealers',
    detail: 'Prime, clearing, and execution',
  },
  {
    name: 'Exchanges',
    detail: 'Listed + OTC venues',
  },
  {
    name: 'Central Banks',
    detail: 'Stability + oversight programs',
  },
]

export function ClientsSection() {
  return (
    <Section className="border-y border-border bg-bg-secondary/40">
      <motion.div
        className="text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p
          className="text-body-sm text-text-muted font-mono uppercase tracking-wider mb-8"
          variants={fadeUp}
        >
          Trusted by institutions that move markets
        </motion.p>

        <HorizontalScroll showControls className="mt-8">
          {clientTypes.map((client, index) => (
            <ScrollCard key={client.name} width="sm">
              <motion.div
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
              >
                <GlassSurfaceContainer padding="lg" className="h-full text-left">
                  <div className="text-lg font-semibold text-text-primary">
                    {client.name}
                  </div>
                  <div className="text-body-sm text-text-secondary mt-2">
                    {client.detail}
                  </div>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-ultraviolet/40 to-transparent" />
                </GlassSurfaceContainer>
              </motion.div>
            </ScrollCard>
          ))}
        </HorizontalScroll>

        <motion.div
          className="mt-12 pt-10 border-t border-border max-w-xl mx-auto"
          variants={fadeUp}
        >
          <p className="text-text-muted text-body-sm">
            We work under NDA with most clients. The case studies on this site represent
            engagements where clients have permitted disclosure.
          </p>
        </motion.div>
      </motion.div>
    </Section>
  )
}
