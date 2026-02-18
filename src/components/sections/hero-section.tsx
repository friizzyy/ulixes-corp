'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, ArrowUpRight } from '@/components/ui'
import { homeContent } from '@/lib/content'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function HeroSection() {
  const { hero, terminal } = homeContent

  return (
    <section className="relative z-10 min-h-[calc(100vh-80px)] flex items-center py-12 sm:py-16 md:py-0" style={{ minHeight: 'calc(100dvh - 80px)' }}>
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-text-muted uppercase tracking-wider mb-6 sm:mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {hero.badge}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[2rem] xs:text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5 sm:mb-6"
            >
              <span className="text-text-primary">{hero.headline}</span>
              <br />
              <span className="gradient-text">{hero.headlineAccent}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-[540px] mb-8 sm:mb-10"
            >
              {hero.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow active:scale-[0.98] transition-shadow duration-200"
              >
                {hero.primaryCta}
                <ArrowUpRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-transparent text-text-primary border border-border-accent font-medium rounded-sm hover:bg-surface active:bg-surface transition-colors duration-200"
              >
                {hero.secondaryCta}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono gradient-text">20+</div>
                  <div className="text-[11px] sm:text-xs text-text-muted">Years Experience</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono gradient-text">20</div>
                  <div className="text-[11px] sm:text-xs text-text-muted">Implementations</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Terminal — hidden on small phones, visible from sm up */}
          <motion.div
            className="relative hidden sm:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Ambient glow behind terminal */}
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 rounded-lg blur-xl opacity-60" />

            {/* Terminal */}
            <div className="rounded-lg border border-border bg-bg-secondary/80 backdrop-blur-sm shadow-2xl shadow-black/20 overflow-hidden">
              <Terminal lines={terminal.lines} typingSpeed={25} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
