'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section } from '@/components/ui'
import { MetricCard, MetricGrid } from '@/components/system'

const metrics = [
  {
    label: 'Client Retention',
    value: 94,
    suffix: '%',
    trend: { value: 3, direction: 'up' as const, label: 'vs last year' },
    description: 'Clients return for additional engagements',
  },
  {
    label: 'On-Time Delivery',
    value: 97,
    suffix: '%',
    trend: { value: 2, direction: 'up' as const, label: 'vs industry avg' },
    description: 'Projects delivered by committed date',
  },
  {
    label: 'Production Issues',
    value: 0,
    description: 'Go-live failures in the past 3 years',
  },
  {
    label: 'Avg. Response Time',
    value: 47,
    suffix: 'min',
    trend: { value: 12, direction: 'down' as const, label: 'from 2023' },
    description: 'For P1 support incidents',
  },
]

export function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <Section>
      <div ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Track Record</span>
          <h2 className="text-display-sm md:text-display-md font-bold mb-4">
            Numbers Don&apos;t Lie
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            We track everything. Here&apos;s what the data says about our delivery.
          </p>
        </motion.div>

        <MetricGrid columns={4}>
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              {...metric}
              animate
            />
          ))}
        </MetricGrid>
      </div>
    </Section>
  )
}
