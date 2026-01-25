'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { caseStudies, workPageContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export default function WorkPage() {
  const [activeStudy, setActiveStudy] = useState(0)
  const study = caseStudies[activeStudy]

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
            <div className="section-label">{workPageContent.hero.label}</div>
            <h1 className="text-display-md md:text-display-lg font-bold mb-4">
              {workPageContent.hero.headline}
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {workPageContent.hero.description}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-24">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
            {/* Left: Case Study Selector */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="section-label mb-6">Engagements</div>
              <nav className="space-y-2">
                {caseStudies.map((cs, index) => (
                  <button
                    key={cs.id}
                    onClick={() => setActiveStudy(index)}
                    className={`w-full text-left p-4 rounded-sm transition-all duration-200 ${
                      activeStudy === index
                        ? 'bg-surface border-l-2 border-l-accent'
                        : 'hover:bg-surface/50'
                    }`}
                  >
                    <span className={`text-heading-sm font-medium block mb-1 transition-colors ${
                      activeStudy === index ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {cs.title}
                    </span>
                    <span className="text-body-sm text-text-muted">
                      {cs.client}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right: Active Case Study */}
            <div className="min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeStudy}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 md:p-10 rounded-md bg-bg-secondary border border-border"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-surface border border-border rounded-sm text-body-sm text-text-muted font-mono">
                      {study.industry}
                    </span>
                    {study.services.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-sm text-body-sm text-accent"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-display-sm font-bold mb-3">{study.title}</h2>
                  <p className="text-body-lg text-text-secondary leading-relaxed mb-8">
                    {study.summary}
                  </p>

                  {/* Challenge & Approach */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                        The Challenge
                      </div>
                      <p className="text-body-md text-text-secondary leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                        Our Approach
                      </div>
                      <p className="text-body-md text-text-secondary leading-relaxed">
                        {study.approach}
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="pt-6 border-t border-border">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
                      Results
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {study.outcome.metrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="text-2xl font-semibold gradient-text mb-1">
                            {metric.value}
                          </div>
                          <div className="text-body-sm text-text-secondary">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
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
                {workPageContent.cta.title}
              </h2>
              <p className="text-body-md text-text-secondary">
                {workPageContent.cta.description}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
            >
              {workPageContent.cta.primaryCta}
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
