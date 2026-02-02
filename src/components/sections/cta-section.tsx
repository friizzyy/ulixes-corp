'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from '@/components/ui'
import { homeContent } from '@/lib/content'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function CTASection() {
  const { cta } = homeContent

  return (
    <section className="relative z-10 py-20 md:py-28 border-t border-border">
      <div className="container-main">
        <motion.div
          className="relative p-10 md:p-16 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

          <motion.div
            className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div variants={fadeUp} className="max-w-xl">
              <h2 className="text-display-sm md:text-display-md font-bold mb-3">
                {cta.title}
              </h2>
              <p className="text-body-lg text-text-secondary">
                {cta.description}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
              >
                {cta.primaryCta}
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/work"
                className="text-text-secondary hover:text-accent transition-colors font-medium"
              >
                {cta.secondaryCta}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
