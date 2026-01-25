'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { philosophyContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export default function PhilosophyPage() {
  const { hero, intro, sections, closing } = philosophyContent
  const [activeSection, setActiveSection] = useState(0)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative z-10">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="max-w-3xl" variants={fadeUp}>
            <div className="section-label">{hero.label}</div>
            <h1 className="text-display-md md:text-display-lg font-bold mb-4">
              {hero.headline}
            </h1>
            <p className="text-heading-md text-accent font-medium mb-6">
              {hero.subtitle}
            </p>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16 border-y border-border bg-bg-secondary/30">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="max-w-3xl text-body-lg md:text-xl text-text-primary leading-relaxed">
            {intro.text}
          </p>
        </motion.div>
      </section>

      {/* Philosophy Sections - Interactive */}
      <section className="py-20 md:py-28">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-16">
            {/* Left: Navigation */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="section-label mb-6">Principles</div>
              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-200 ${
                      activeSection === index
                        ? 'bg-surface border-l-2 border-l-accent'
                        : 'hover:bg-surface/50'
                    }`}
                  >
                    <span className="text-xs font-mono text-text-muted block mb-1">
                      0{index + 1}
                    </span>
                    <span className={`text-heading-sm font-medium transition-colors ${
                      activeSection === index ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right: Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 md:p-10 rounded-md bg-bg-secondary border border-border"
                >
                  <div className="text-xs font-mono text-accent uppercase tracking-widest mb-4">
                    Principle 0{activeSection + 1}
                  </div>
                  <h2 className="text-display-sm font-bold mb-6">
                    {sections[activeSection].title}
                  </h2>
                  <div className="space-y-4 text-body-lg text-text-secondary leading-relaxed">
                    {sections[activeSection].content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Closing */}
      <section className="py-16 md:py-20 border-t border-border">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            variants={fadeUp}
          >
            <div className="max-w-xl">
              <h2 className="text-heading-lg md:text-display-sm font-bold mb-2">
                {closing.title}
              </h2>
              <p className="text-body-md text-text-secondary">
                {closing.content}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
            >
              Start a Conversation
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
