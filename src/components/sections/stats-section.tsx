'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce, reducedMotionVariants } from '@/lib/motion'
import { MetricCard } from '@/components/system/MetricCard'
import { IconShield } from '@/components/ui/icons'

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative z-10 py-16 md:py-20">
      <motion.div
        className="container-main"
        variants={prefersReducedMotion ? reducedMotionVariants : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {/* Tight 4-column grid - no header, let numbers speak */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-md overflow-hidden"
          variants={prefersReducedMotion ? reducedMotionVariants : fadeUp}
        >
          <div className="bg-bg-primary p-6 md:p-8">
            <MetricCard
              value="$2.1T"
              label="Notional Migrated"
              size="md"
              className="bg-transparent p-0"
            />
          </div>
          <div className="bg-bg-primary p-6 md:p-8">
            <MetricCard
              value={40}
              suffix="+"
              label="Institutions"
              size="md"
              className="bg-transparent p-0"
            />
          </div>
          <div className="bg-bg-primary p-6 md:p-8">
            <MetricCard
              value={0}
              label="Restatements"
              size="md"
              icon={<IconShield size={18} className="text-accent" />}
              className="bg-transparent p-0"
            />
          </div>
          <div className="bg-bg-primary p-6 md:p-8">
            <MetricCard
              value={100}
              suffix="%"
              label="Audit Defensible"
              size="md"
              className="bg-transparent p-0"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
