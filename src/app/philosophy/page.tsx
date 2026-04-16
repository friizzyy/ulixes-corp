'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { philosophyContent } from '@/lib/content'
import { ArrowUpRight, PageTransition } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export default function PhilosophyPage() {
  const { hero, intro, sections, closing } = philosophyContent
  const [activeSection, setActiveSection] = useState(0)

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 md:pb-28 relative z-10">
        <div className="container-main">
          <motion.div
            className="flex flex-col items-center text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="section-label">{hero.label}</motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-semibold leading-[1.05] tracking-tight mb-4 sm:mb-6">
              {hero.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-accent font-mono uppercase tracking-widest mb-12 sm:mb-16 md:mb-20">
              {hero.subtitle}
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="max-w-3xl mx-auto border-t border-border pt-10 sm:pt-14 md:pt-16"
            >
              <p className="font-display text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-semibold text-text-primary leading-relaxed">
                {intro.text}
              </p>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-8 sm:mt-10 text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
              {hero.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Principles */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-border">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            {/* Left: Sticky Navigation */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
            >
              <div className="lg:sticky lg:top-32">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-8">
                  Core Principles
                </h2>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className="group w-full text-left py-2.5 min-h-[44px] transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-mono transition-colors mt-0.5 ${
                          activeSection === index ? 'text-accent' : 'text-text-muted/40'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-body-sm font-medium transition-colors leading-snug ${
                          activeSection === index ? 'text-text-primary' : 'text-text-muted group-hover:text-text-secondary'
                        }`}>
                          {section.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              className="lg:col-span-7 lg:col-start-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <article className="relative">
                {/* Large decorative number */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    className="absolute -top-8 -left-4 text-[6rem] sm:text-[9rem] lg:text-[12rem] font-bold text-white/[0.03] select-none leading-none pointer-events-none -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {String(activeSection + 1).padStart(2, '0')}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="font-display text-[1.75rem] sm:text-display-sm md:text-display-md font-semibold mb-8">
                      {sections[activeSection].title}
                    </h2>

                    <div className="space-y-6">
                      {sections[activeSection].content.map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className={`text-body-lg leading-relaxed ${
                            idx === sections[activeSection].content.length - 1
                              ? 'text-text-primary font-medium border-l-2 border-accent pl-6'
                              : 'text-text-secondary'
                          }`}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </article>

              {/* Current position indicator — subtle text, not dots */}
              <div className="mt-12 pt-6 border-t border-border">
                <span className="text-xs font-mono text-text-muted">
                  {String(activeSection + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-border">
        <div className="container-main">
          <motion.div
            className="relative p-5 sm:p-8 md:p-16 rounded-lg bg-bg-secondary border border-border overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
          >
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <motion.div
                className="max-w-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  {closing.title}
                </h2>
                <p className="text-body-lg text-text-secondary leading-relaxed">
                  {closing.content}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/contact" className="cta-primary shrink-0">
                  Start a Conversation
                  <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
