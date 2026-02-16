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
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-14 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <motion.div
            className="max-w-4xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="section-label">{hero.label}</motion.div>
            <motion.h1 variants={fadeUp} className="text-[2.25rem] sm:text-display-lg md:text-display-xl font-bold mb-4">
              {hero.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-heading-md md:text-heading-lg text-accent font-medium mb-6">
              {hero.subtitle}
            </motion.p>
            <motion.p variants={fadeUp} className="text-base sm:text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {hero.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Introduction Banner */}
      <section className="pb-12 sm:pb-16 md:pb-28">
        <div className="container-main">
          <motion.div
            className="relative p-5 sm:p-8 md:p-16 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

            <p className="relative text-base sm:text-body-lg md:text-xl text-text-primary leading-relaxed max-w-4xl">
              {intro.text}
            </p>
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
                <nav className="space-y-0.5">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`group w-full text-left p-3 sm:p-4 min-h-[44px] transition-all duration-200 border-l-2 ${
                        activeSection === index
                          ? 'border-l-accent bg-gradient-to-r from-accent/[0.06] to-transparent'
                          : 'border-l-transparent hover:bg-surface/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className={`text-xs font-mono font-semibold transition-colors ${
                          activeSection === index ? 'text-accent' : 'text-text-muted/50'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-heading-sm font-medium transition-colors leading-tight ${
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
                    className="absolute -top-8 -left-4 text-[6rem] sm:text-[9rem] lg:text-[12rem] font-bold text-surface select-none leading-none opacity-30 pointer-events-none -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.3, scale: 1 }}
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
                    <h2 className="text-[1.75rem] sm:text-display-sm md:text-display-md font-bold mb-8">
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

              {/* Progress indicator */}
              <div className="flex items-center gap-2 mt-16">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className="min-h-[44px] flex items-center"
                  >
                    <div className={`rounded-full transition-all duration-300 ${
                      activeSection === index ? 'w-6 h-1 bg-accent' : 'w-1.5 h-1.5 bg-border hover:bg-text-muted'
                    }`} />
                  </button>
                ))}
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
            {/* Decorative glow */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

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
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
                >
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
