'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { experienceContent, caseStudies } from '@/lib/content'
import { ArrowUpRight, PageTransition } from '@/components/ui'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

export default function ExperiencePage() {
  const { hero, stats, credibilityChips, intro, institutions, programs, closing, cta } = experienceContent
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
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
            <motion.div variants={fadeUp} className="section-label">{hero.label}</motion.div>
            <motion.h1 variants={fadeUp} className="text-display-lg md:text-display-xl font-bold mb-6">
              {hero.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {hero.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="pb-24 md:pb-32">
        <div className="container-main">
          <motion.div
            className="relative mb-20 p-10 md:p-16 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  Institutional Perspective
                </h2>
                <p className="text-heading-lg md:text-display-sm font-semibold text-text-primary max-w-lg">
                  Built from inside the organizations we work with today.
                </p>
              </motion.div>

              <motion.div
                className="flex gap-12 md:gap-16"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="text-right">
                    <div className="text-5xl md:text-6xl font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-body-sm text-text-muted font-mono uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Narrative Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8"
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
              <p className="text-body-md leading-relaxed text-text-primary font-medium border-l-2 border-accent pl-6">
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
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-body-sm font-medium">{chip}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Institutions Categories - Accordion Style */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column - Header */}
            <motion.div
              className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                Where We&apos;ve Worked
              </motion.h2>
              <motion.p variants={fadeUp} className="text-heading-lg md:text-display-sm font-bold mb-4">
                Our experience spans seven distinct institutional sectors.
              </motion.p>
              <motion.p variants={fadeUp} className="text-body-sm text-text-muted">
                Select a category to learn more about our work in that sector.
              </motion.p>
            </motion.div>

            {/* Right Column - Accordion */}
            <motion.div
              className="lg:col-span-8"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainerFast}
            >
              <div className="space-y-2">
                {institutions.categories.map((category, index) => {
                  const isExpanded = expandedIndex === index
                  return (
                    <motion.div
                      key={category.name}
                      variants={fadeUp}
                      className="group"
                    >
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="w-full text-left"
                      >
                        <div
                          className={`
                            flex items-center justify-between gap-4 p-4 rounded-md border transition-all duration-300
                            ${isExpanded
                              ? 'bg-surface border-accent/40'
                              : 'bg-transparent border-border hover:border-border-accent hover:bg-surface/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-mono transition-colors ${isExpanded ? 'text-accent' : 'text-text-muted'}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className={`text-base font-semibold transition-colors ${isExpanded ? 'text-accent' : 'text-text-primary'}`}>
                              {category.name}
                            </h3>
                          </div>
                          <motion.span
                            className="text-text-muted text-xl font-light"
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            +
                          </motion.span>
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-2 ml-12">
                              <p className="text-body-sm text-text-secondary leading-relaxed">
                                {category.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 md:py-32 bg-bg-secondary/50 border-y border-border">
        <div className="container-main">
          <motion.div
            className="mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              Selected Engagements
            </motion.h2>
            <motion.p variants={fadeUp} className="text-heading-lg md:text-display-sm font-bold max-w-xl">
              Patterns from our work. Most clients require confidentiality. These represent what we can discuss.
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

                <motion.h3
                  className="text-display-sm md:text-display-md font-bold mb-6 leading-tight"
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                    Approach
                  </h4>
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-accent mb-8">
                    Results
                  </h4>
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

      {/* Programs & Scope */}
      <section className="py-24 md:py-32">
        <div className="container-main">
          <motion.div
            className="mb-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              {programs.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-heading-lg md:text-display-sm font-bold max-w-xl">
              {programs.description}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {programs.tags.map((tag, index) => (
              <motion.div
                key={tag}
                className="bg-bg-primary p-5 md:p-6 hover:bg-surface transition-colors duration-200 group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="text-[10px] font-mono text-accent/60 group-hover:text-accent transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-body-sm text-text-secondary group-hover:text-text-primary transition-colors mt-2 leading-snug">
                  {tag}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Closing Quote + CTA */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-main">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {/* Quote */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="relative">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  Our Perspective
                </h2>
                <blockquote className="text-display-sm font-bold mb-6 leading-tight">
                  &ldquo;{closing.quote}&rdquo;
                </blockquote>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              variants={fadeUp}
              className="relative p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface to-bg-secondary border border-border"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  {cta.title}
                </h3>
                <p className="text-body-md text-text-secondary leading-relaxed mb-8">
                  {cta.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
                >
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
