'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { experienceContent, experiencePatterns } from '@/lib/content'
import { ArrowUpRight, PageTransition } from '@/components/ui'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

export default function ExperiencePage() {
  const { hero, stats, credibilityChips, intro, institutions, closing, cta } = experienceContent
  const [activeStudy, setActiveStudy] = useState(0)
  const study = experiencePatterns[activeStudy]

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 md:pt-48 md:pb-20 relative z-10">
        <div className="container-main">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="section-label">{hero.label}</motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-[2.5rem] sm:text-display-lg md:text-display-xl lg:text-[4.5rem] font-semibold mb-10 sm:mb-14 max-w-5xl leading-[1.1]">
              {hero.headline}
            </motion.h1>

            {/* Description + inline stats */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16">
              <p className="text-base sm:text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-xl">
                {hero.description}
              </p>

              <div className="flex items-start gap-6 sm:gap-8 shrink-0">
                {stats.map((stat, idx) => (
                  <div key={stat.label} className="flex items-start gap-6 sm:gap-8">
                    {idx > 0 && (
                      <div className="w-px h-14 sm:h-16 bg-border self-center" />
                    )}
                    <div>
                      <div className="font-display text-4xl sm:text-5xl font-semibold text-text-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-body-sm text-text-muted font-mono uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Credibility chips */}
          <motion.div
            className="mt-12 sm:mt-16 flex flex-wrap gap-x-8 gap-y-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {credibilityChips.map((chip) => (
              <div key={chip} className="flex items-center gap-3 text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-ultraviolet" />
                <span className="text-body-sm font-medium">{chip}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Narrative Grid */}
      <section className="pb-16 sm:pb-20 md:pb-32">
        <div className="container-main">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
              <p className="text-body-lg text-text-secondary leading-relaxed">
                {intro.paragraphs[0]}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-6 lg:col-start-7 space-y-8">
              <p className="text-body-md leading-relaxed text-text-primary font-medium border-l-2 border-violet-light pl-6">
                {intro.paragraphs[1]}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Credentials Strip */}
      <motion.section
        className="py-12 border-y border-border bg-bg-secondary/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
      >
        <div className="container-main">
          <motion.div
            className="flex flex-wrap justify-center gap-x-12 gap-y-4"
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {credibilityChips.map((chip) => (
              <motion.div
                key={chip}
                variants={fadeUp}
                className="flex items-center gap-3 text-text-muted"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ultraviolet" />
                <span className="text-body-sm font-medium">{chip}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Institutions — static grid, no accordion (content too short to justify expand/collapse) */}
      <section className="py-20 sm:py-28 md:py-36">
        <div className="container-main">
          <motion.div
            className="mb-14 sm:mb-18 md:mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
              {institutions.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="font-display text-[1.75rem] sm:text-display-sm md:text-display-md font-semibold max-w-2xl">
              {institutions.description}
            </motion.p>
          </motion.div>

          <motion.div
            className="space-y-0"
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {institutions.categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={fadeUp}
                className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-6 sm:py-8 border-b border-border first:border-t"
              >
                <div className="md:col-span-1">
                  <span className="text-xs font-mono text-text-muted group-hover:text-violet-light transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-body-md sm:text-heading-sm font-semibold text-text-primary">
                    {category.name}
                  </h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Representative mandate patterns */}
      <section className="py-20 sm:py-28 md:py-36 bg-bg-secondary/50 border-y border-border">
        <div className="container-main">
          <motion.div
            className="mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
              Representative Mandate Patterns
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base sm:text-heading-lg md:text-display-sm font-display font-semibold max-w-xl">
              Operating patterns, not client case studies or claimed outcomes.
            </motion.p>
          </motion.div>

          {/* Case Study Navigation */}
          <motion.div
            className="flex items-center gap-1 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {experiencePatterns.map((pattern, index) => (
              <button
                key={pattern.id}
                onClick={() => setActiveStudy(index)}
                aria-label={`Show ${pattern.title}`}
                aria-pressed={activeStudy === index}
                className={`group relative px-6 py-3 min-h-[44px] transition-all duration-300 ${
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
                    ? 'bg-ultraviolet'
                    : 'bg-transparent group-hover:bg-border'
                }`} />
              </button>
            ))}
            <div className="flex-1 h-px bg-border ml-4" />
          </motion.div>

          {/* Selected mandate pattern */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudy}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24"
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
                    {study.context}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-xs font-mono tracking-wider text-text-muted">
                    {study.qualifier}
                  </span>
                </motion.div>

                <motion.h3
                  className="text-[1.5rem] sm:text-display-sm md:text-display-md font-display font-semibold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {study.title}
                </motion.h3>

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
                      className="px-4 py-2 text-body-sm text-violet-light border border-violet-light/30 rounded-full"
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                    Challenge
                  </h4>
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                    Approach
                  </h4>
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    {study.approach}
                  </p>
                </motion.div>

                {/* Decision coverage */}
                <motion.div
                  className="pt-8 border-t border-border"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-8">
                    Decision Coverage
                  </h4>
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-8">
                    {study.coverage.map((metric, idx) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                      >
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-2">
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

      {/* Closing Quote + CTA */}
      <section className="py-20 sm:py-28 md:py-36 border-t border-border">
        <div className="container-main">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {/* Quote */}
            <motion.div variants={fadeUp} className="relative">
              <div className="relative">
                <h2 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                  Our Perspective
                </h2>
                <blockquote className="text-[1.5rem] sm:text-display-sm font-display font-semibold mb-6 leading-tight">
                  &ldquo;{closing.quote}&rdquo;
                </blockquote>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              variants={fadeUp}
              className="relative p-5 sm:p-8 md:p-10 rounded-lg bg-bg-secondary border border-border"
            >
              <div className="relative">
                <h3 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                  {cta.title}
                </h3>
                <p className="text-body-md text-text-secondary leading-relaxed mb-8">
                  {cta.description}
                </p>
                <Link href="/contact" className="cta-primary">
                  {cta.primaryCta}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
