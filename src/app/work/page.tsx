'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { caseStudies, workPageContent } from '@/lib/content'
import { ArrowUpRight, PageTransition } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export default function WorkPage() {
  const [activeStudy, setActiveStudy] = useState(0)
  const study = caseStudies[activeStudy]

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <motion.div
            className="max-w-4xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="section-label">{workPageContent.hero.label}</motion.div>
            <motion.h1 variants={fadeUp} className="text-display-lg md:text-display-xl font-bold mb-6">
              {workPageContent.hero.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {workPageContent.hero.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="pb-24 md:pb-32">
        <div className="container-main">
          {/* Navigation - Minimal numbered tabs */}
          <motion.div
            className="flex items-center gap-1 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {caseStudies.map((cs, index) => (
              <button
                key={cs.id}
                onClick={() => setActiveStudy(index)}
                className={`group relative px-6 py-3 transition-all duration-300 ${
                  activeStudy === index
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-xs font-mono tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-300 ${
                  activeStudy === index
                    ? 'bg-accent'
                    : 'bg-transparent group-hover:bg-border'
                }`} />
              </button>
            ))}
            <div className="flex-1 h-px bg-border ml-4" />
          </motion.div>

          {/* Featured Case Study */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudy}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Left: Title and Summary */}
              <div>
                <motion.div
                  className="flex items-center gap-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-xs font-mono tracking-wider text-text-muted uppercase">
                    {study.industry}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-xs font-mono tracking-wider text-text-muted">
                    {study.client}
                  </span>
                </motion.div>

                <motion.h2
                  className="text-display-sm md:text-display-md font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {study.title}
                </motion.h2>

                <motion.p
                  className="text-body-lg text-text-secondary leading-relaxed mb-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {study.summary}
                </motion.p>

                {/* Services Tags */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {study.services.map((service, idx) => (
                    <motion.span
                      key={service}
                      className="px-4 py-2 text-body-sm text-accent border border-accent/30 rounded-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      {service}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Right: Details */}
              <div className="space-y-12">
                {/* Challenge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                    Challenge
                  </h3>
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    {study.challenge}
                  </p>
                </motion.div>

                {/* Approach */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                    Approach
                  </h3>
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    {study.approach}
                  </p>
                </motion.div>

                {/* Results */}
                <motion.div
                  className="pt-8 border-t border-border"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-8">
                    Results
                  </h3>
                  <div className="grid grid-cols-3 gap-8">
                    {study.outcome.metrics.map((metric, idx) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                          {metric.value}
                        </div>
                        <div className="text-body-sm text-text-muted">
                          {metric.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-main">
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-heading-lg md:text-display-sm font-bold mb-3">
                {workPageContent.cta.title}
              </h2>
              <p className="text-body-md text-text-secondary">
                {workPageContent.cta.description}
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
              >
                {workPageContent.cta.primaryCta}
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
