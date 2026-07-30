'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { aboutContent, aboutPageContent } from '@/lib/content'
import { ArrowUpRight, PageTransition } from '@/components/ui'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

export default function AboutPage() {
  const { hero, origin, philosophy, team } = aboutContent

  return (
    <PageTransition>
      {/* Hero + Stats */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 md:pb-24 relative z-10">
        <div className="container-main">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <div className="section-label">About</div>
              <h1 className="font-display text-[2.25rem] sm:text-display-lg md:text-display-xl font-semibold mb-6 sm:mb-8">
                {hero.headline}
              </h1>
              <p className="text-base sm:text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-xl">
                {hero.description}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-5 lg:pt-14">
              <div className="flex flex-row lg:flex-col gap-8 lg:gap-0">
                {aboutPageContent.numbers.stats.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={`${idx > 0 ? 'lg:border-t lg:border-border lg:pt-8 lg:mt-8' : ''} ${idx > 0 ? 'border-l lg:border-l-0 border-border pl-8 lg:pl-0' : ''}`}
                  >
                    <div className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-body-sm text-text-muted font-mono uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Origin — editorial narrative */}
      <section className="pb-20 sm:pb-28 md:pb-36 border-b border-border">
        <div className="container-main">
          {/* Lead quote */}
          <motion.blockquote
            className="border-l-2 border-violet-light pl-6 sm:pl-8 mb-16 sm:mb-20 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="font-display text-heading-lg sm:text-display-sm md:text-[1.75rem] font-semibold text-text-primary max-w-2xl leading-snug">
              We came from trading floors, treasury functions, and Big Four advisory practices.
            </p>
          </motion.blockquote>

          {/* Narrative Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
              <p className="text-body-lg text-text-secondary leading-relaxed">
                {origin.paragraphs[0]}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-6 lg:col-start-7 space-y-8">
              {origin.paragraphs.slice(1).map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`text-body-md leading-relaxed ${
                    idx === origin.paragraphs.length - 2
                      ? 'text-text-primary font-medium border-l-2 border-violet-light pl-6'
                      : 'text-text-secondary'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Believe — NOT a 3-card grid. Full-width principles with depth. */}
      <section className="py-20 sm:py-28 md:py-36">
        <div className="container-main">
          <motion.div
            className="mb-16 sm:mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
              What We Believe
            </motion.h2>
            <motion.p variants={fadeUp} className="font-display text-[1.75rem] sm:text-display-sm md:text-display-md font-semibold max-w-2xl">
              The principles that shape every engagement
            </motion.p>
          </motion.div>

          {/* Principles as full-width rows with number + title + description */}
          <motion.div
            className="space-y-0"
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {philosophy.points.map((point, index) => (
              <motion.div
                key={point.title}
                variants={fadeUp}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 sm:py-10 border-b border-border first:border-t"
              >
                <div className="md:col-span-1">
                  <span className="text-xs font-mono text-text-muted group-hover:text-violet-light transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-heading-md sm:text-heading-lg font-semibold text-text-primary group-hover:text-violet-light transition-colors">
                    {point.title}
                  </h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How We Work — Operating Principles as structured rows, not hover-reveal */}
      <section className="py-20 sm:py-28 md:py-36 bg-bg-secondary/40 border-y border-border">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
            >
              <div className="lg:sticky lg:top-32">
                <h2 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                  How We Work
                </h2>
                <p className="font-display text-[1.75rem] sm:text-display-sm font-semibold mb-4 sm:mb-6">
                  {aboutPageContent.values.title}
                </p>
                <p className="text-body-md text-text-secondary leading-relaxed">
                  We are senior practitioners, not staffing leverage. Every engagement is led by partners who have designed, built, and defended these systems inside institutions.
                </p>
              </div>
            </motion.div>

            <div className="lg:col-span-7 lg:col-start-6">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                variants={staggerContainerFast}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {aboutPageContent.values.items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    className="relative"
                  >
                    <span className="text-xs font-mono text-violet-light mb-3 block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team + Hiring — asymmetric, not two equal boxes */}
      <section className="py-20 sm:py-28 md:py-36">
        <div className="container-main">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {/* Team — takes more space */}
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                The Team
              </h2>
              <p className="font-display text-[1.75rem] sm:text-display-sm font-semibold mb-4 sm:mb-6">
                {team.title}
              </p>
              <p className="text-body-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
                {team.description}
              </p>
              <Link href="/contact" className="cta-primary">
                Work With Us
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            {/* Hiring — compact sidebar */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-4 lg:col-start-9"
            >
              <div className="border-l-2 border-violet-light pl-6">
                <h3 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                  {aboutPageContent.hiring.title}
                </h3>
                <p className="text-body-sm text-text-secondary leading-relaxed mb-6">
                  {aboutPageContent.hiring.description}
                </p>
                <Link href={aboutPageContent.hiring.ctaHref} className="cta-outline-accent">
                  {aboutPageContent.hiring.cta}
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
