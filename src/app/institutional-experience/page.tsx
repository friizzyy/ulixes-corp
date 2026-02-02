'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { institutionalExperienceContent } from '@/lib/content'
import { ArrowUpRight, PageTransition } from '@/components/ui'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

export default function InstitutionalExperiencePage() {
  const { hero, credibilityChips, intro, institutions, programs, closing, cta } =
    institutionalExperienceContent

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
            {/* Decorative accent line */}
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
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-bold gradient-text mb-1">
                    20+
                  </div>
                  <div className="text-body-sm text-text-muted font-mono uppercase tracking-wider">
                    Years Experience
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-bold gradient-text mb-1">
                    9
                  </div>
                  <div className="text-body-sm text-text-muted font-mono uppercase tracking-wider">
                    Institutions
                  </div>
                </div>
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

      {/* Institutions Timeline */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-accent mb-5">
              Where We&apos;ve Worked
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-md text-text-muted max-w-lg mx-auto">
              Financial institutions where we&apos;ve designed, implemented, or defended capital markets infrastructure.
            </motion.p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-5xl mx-auto">
            {/* Central Axis */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2" />

            {/* Timeline Items */}
            <div className="space-y-6 md:space-y-0">
              {institutions.items.map((item, index) => {
                const isLeft = index % 2 === 0
                return (
                  <motion.div
                    key={item.name}
                    className="relative md:grid md:grid-cols-2 md:items-center md:min-h-[56px]"
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    {/* Axis Marker */}
                    <motion.div
                      className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-accent/80" />
                    </motion.div>

                    {/* Content */}
                    {isLeft ? (
                      <>
                        <div className="md:pr-16 md:text-right">
                          <h3 className="text-base font-semibold text-text-primary tracking-tight">
                            {item.name}
                          </h3>
                          <p className="text-sm text-text-muted whitespace-nowrap">
                            {item.description}
                          </p>
                        </div>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div className="md:pl-16">
                          <h3 className="text-base font-semibold text-text-primary tracking-tight">
                            {item.name}
                          </h3>
                          <p className="text-sm text-text-muted whitespace-nowrap">
                            {item.description}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Mobile marker */}
                    <div className="md:hidden absolute -left-4 top-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/80" />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Mobile axis */}
            <div className="md:hidden absolute -left-[10px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* Programs & Scope */}
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
              {programs.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-display-sm md:text-display-md font-bold max-w-2xl">
              {programs.description}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {programs.tags.map((tag, index) => (
              <motion.div
                key={tag}
                variants={fadeUp}
                className="group relative p-6 rounded-lg bg-bg-primary border border-border hover:border-accent/30 transition-all duration-300"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <span className="inline-block text-xs font-mono text-accent mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-body-sm text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                    {tag}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Closing Quote + CTA */}
      <section className="py-24 md:py-32">
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
