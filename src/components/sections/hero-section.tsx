'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, ArrowUpRight } from '@/components/ui'
import { fadeUp, staggerContainer, reducedMotionVariants } from '@/lib/motion'
import { homeContent } from '@/lib/content'

export function HeroSection() {
  const { hero, terminal } = homeContent
  const prefersReducedMotion = useReducedMotion()

  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer
  const itemVariants = prefersReducedMotion ? reducedMotionVariants : fadeUp

  return (
    <section className="relative z-10 min-h-[calc(100vh-80px)] flex items-center py-20 md:py-0">
      <motion.div
        className="container-main w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-text-muted uppercase tracking-wider mb-8"
              variants={itemVariants}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {hero.badge}
            </motion.div>

            <motion.h1
              className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-6"
              variants={itemVariants}
            >
              <span className="text-text-primary">{hero.headline}</span>
              <br />
              <span className="gradient-text">{hero.headlineAccent}</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-[540px] mb-10"
              variants={itemVariants}
            >
              {hero.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              variants={itemVariants}
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
              >
                {hero.primaryCta}
                <ArrowUpRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent text-text-primary border border-border-accent font-medium rounded-sm hover:bg-surface transition-colors"
              >
                {hero.secondaryCta}
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-6"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold font-mono gradient-text">20+</div>
                  <div className="text-xs text-text-muted">Years Experience</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="text-2xl font-bold font-mono gradient-text">20+</div>
                  <div className="text-xs text-text-muted">Implementations</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            {/* Ambient glow behind terminal */}
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 rounded-lg blur-xl opacity-60" />

            {/* Terminal container */}
            <div className="relative">
              {/* Status indicator */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-text-muted">Live</span>
                </div>
              </div>

              {/* Terminal */}
              <div className="rounded-lg border border-border bg-bg-secondary/80 backdrop-blur-sm shadow-2xl shadow-black/20 overflow-hidden">
                <Terminal lines={terminal.lines} typingSpeed={25} />
              </div>

            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
