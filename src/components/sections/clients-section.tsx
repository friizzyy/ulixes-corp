'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section, HorizontalScroll, ScrollCard } from '@/components/ui'
import { GlassSurfaceContainer } from '@/components/system'

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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <Section className="border-y border-border bg-bg-secondary/40">
      <div ref={ref} className="text-center">
        <motion.p
          className="text-body-sm text-text-muted font-mono uppercase tracking-wider mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Trusted by institutions that move markets
        </motion.p>

        <HorizontalScroll showControls className="mt-8">
          {clientTypes.map((client, index) => (
            <ScrollCard key={client.name} width="sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GlassSurfaceContainer padding="lg" className="h-full text-left">
                  <div className="text-lg font-semibold text-text-primary">
                    {client.name}
                  </div>
                  <div className="text-body-sm text-text-secondary mt-2">
                    {client.detail}
                  </div>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-accent/40 to-transparent" />
                </GlassSurfaceContainer>
              </motion.div>
            </ScrollCard>
          ))}
        </HorizontalScroll>

        <motion.div
          className="mt-12 pt-10 border-t border-border max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-text-muted text-body-sm">
            We work under NDA with most clients. The case studies on this site represent
            engagements where clients have permitted disclosure.
          </p>
        </motion.div>
      </div>
    </Section>
  )
}
