'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { homeContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function PhilosophySection() {
  const { philosophy } = homeContent
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative z-10 py-16 sm:py-20 md:py-32">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24">
          {/* Left: Header + Navigation */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div variants={fadeUp} className="section-label">{philosophy.label}</motion.div>
            <motion.h2 variants={fadeUp} className="text-[1.75rem] sm:text-display-sm md:text-display-md font-bold mb-4 sm:mb-6">
              {philosophy.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base sm:text-body-lg text-text-secondary leading-relaxed mb-8 sm:mb-10">
              {philosophy.description}
            </motion.p>

            {/* Tab Navigation */}
            <motion.nav variants={fadeUp} className="space-y-1 mb-6 sm:mb-8">
              {philosophy.points.map((point, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`group w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 min-h-[44px] ${
                    activeIndex === index
                      ? 'bg-surface'
                      : 'hover:bg-surface/50 active:bg-surface/50'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className={`text-xs font-mono transition-colors ${
                      activeIndex === index ? 'text-accent' : 'text-text-muted'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-base sm:text-heading-sm font-medium transition-colors ${
                      activeIndex === index ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}>
                      {point.title}
                    </span>
                  </div>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="philosophy-indicator"
                      className="ml-7 sm:ml-8 mt-2 h-0.5 w-12 bg-accent rounded-full"
                    />
                  )}
                </button>
              ))}
            </motion.nav>

            <motion.div variants={fadeUp}>
              <Link
                href="/philosophy"
                className="inline-flex items-center gap-2 text-accent font-medium hover:underline active:underline underline-offset-4 min-h-[44px]"
              >
                {philosophy.cta}
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Active Content */}
          <motion.div
            className="lg:pt-16"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative">
              <div className="p-6 sm:p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3 sm:mb-4">
                      Principle {String(activeIndex + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-heading-md sm:text-heading-lg font-semibold text-text-primary mb-3 sm:mb-4">
                      {philosophy.points[activeIndex].title}
                    </h3>
                    <p className="text-base sm:text-body-lg text-text-secondary leading-relaxed">
                      {philosophy.points[activeIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
