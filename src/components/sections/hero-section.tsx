'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, ArrowUpRight } from '@/components/ui'
import { homeContent } from '@/lib/content'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function HeroSection() {
  const { hero, terminal } = homeContent

  return (
    <section className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-20 md:pb-20" style={{ minHeight: 'calc(100dvh - 80px)' }}>
      <div className="container-main w-full">
        {/* Top: Full-width headline block — NOT a 50/50 grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface/80 border border-border-accent text-xs font-mono text-text-secondary uppercase tracking-wider mb-6 sm:mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {hero.badge}
          </motion.div>

          {/* Headline spans full width — institutional authority */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-[2.5rem] xs:text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-semibold leading-[1.02] tracking-tight mb-0"
          >
            <span className="text-text-primary block">{hero.headline}</span>
            <span className="text-accent block">{hero.headlineAccent}</span>
          </motion.h1>
        </motion.div>

        {/* Bottom: Asymmetric grid — description left, terminal right */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Left column: Description + CTAs — narrower, deliberate */}
          <div className="lg:col-span-5 xl:col-span-4">
            <p className="text-base sm:text-lg md:text-body-xl text-text-secondary leading-relaxed mb-8 sm:mb-10">
              {hero.description}
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-10 lg:mb-0">
              <Link
                href="/services"
                className="cta-primary"
              >
                {hero.primaryCta}
                <ArrowUpRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="cta-secondary"
              >
                {hero.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Center spacer — breathing room on large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Right column: Terminal — wider, offset down */}
          <div className="hidden sm:block lg:col-span-6 xl:col-span-7">
            <div className="relative">
              <div className="relative rounded-lg border border-border bg-bg-secondary overflow-hidden">
                <Terminal lines={terminal.lines} typingSpeed={25} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credential strip — separated from hero content, acts as section divider */}
        <motion.div
          className="mt-14 sm:mt-20 md:mt-24 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-0">
            <div className="flex items-center gap-6 sm:gap-10">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-text-primary leading-none mb-1">20+</div>
                <div className="text-[11px] sm:text-xs text-text-muted uppercase tracking-wider font-mono">Years Experience</div>
              </div>
              <div className="w-px h-10 bg-border-accent" />
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-text-primary leading-none mb-1">20</div>
                <div className="text-[11px] sm:text-xs text-text-muted uppercase tracking-wider font-mono">Implementations</div>
              </div>
            </div>
            {/* Extending line on desktop — visual anchor */}
            <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-border via-border to-transparent ml-10" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
