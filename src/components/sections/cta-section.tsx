'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from '@/components/ui'
import { homeContent } from '@/lib/content'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function CTASection() {
  const { cta } = homeContent

  return (
    <section className="relative z-10 py-20 sm:py-28 md:py-36 border-t border-border overflow-hidden">
      <div className="container-main">
        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Large display headline — full width, institutional weight */}
          <motion.h2
            variants={fadeUp}
            className="font-display text-[1.75rem] sm:text-display-sm md:text-display-lg lg:text-display-xl font-semibold leading-[1.08] tracking-tight mb-6 sm:mb-8 max-w-4xl"
          >
            {cta.title}
          </motion.h2>

          {/* Description + CTA — grid layout with wide gap */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-end"
          >
            <p className="lg:col-span-6 text-base sm:text-body-lg text-text-secondary leading-relaxed">
              {cta.description}
            </p>

            <div className="lg:col-span-6 flex flex-col xs:flex-row items-start xs:items-center gap-4 lg:justify-end">
              <Link href="/contact" className="cta-primary">
                {cta.primaryCta}
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/institutional-experience"
                className="text-text-secondary hover:text-accent active:text-accent transition-colors font-medium min-h-[44px] inline-flex items-center"
              >
                {cta.secondaryCta}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
