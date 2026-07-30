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
          className="relative text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Headline — centered, single line on desktop */}
          <motion.h2
            variants={fadeUp}
            className="font-display text-[1.75rem] sm:text-display-sm md:text-display-lg lg:text-[3.75rem] xl:text-[4.25rem] font-semibold leading-[1.1] tracking-tight mb-6 sm:mb-8 whitespace-normal lg:whitespace-nowrap"
          >
            {cta.title}
          </motion.h2>

          {/* Description — centered below */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-body-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12"
          >
            {cta.description}
          </motion.p>

          {/* CTAs — centered */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col xs:flex-row items-center justify-center gap-4"
          >
            <Link href="/contact" className="cta-primary">
              {cta.primaryCta}
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/institutional-experience"
              className="text-text-secondary hover:text-violet-light active:text-violet-light transition-colors font-medium min-h-[44px] inline-flex items-center"
            >
              {cta.secondaryCta}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
