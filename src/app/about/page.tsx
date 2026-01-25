'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { aboutContent, aboutPageContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export default function AboutPage() {
  const { hero, origin, team } = aboutContent

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
            <div className="section-label">About</div>
            <h1 className="text-display-md md:text-display-lg font-bold mb-4">
              {hero.headline}
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Origin Story */}
      <section className="py-16 md:py-24 border-t border-border">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
            {/* Left: Title + Key Stats */}
            <motion.div variants={fadeUp}>
              <h2 className="text-display-sm font-bold mb-8">
                {origin.title}
              </h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {aboutPageContent.numbers.stats.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-sm bg-bg-secondary border border-border">
                    <div className="text-2xl font-semibold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-body-sm text-text-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Narrative */}
            <motion.div className="space-y-6" variants={fadeUp}>
              {origin.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`text-body-lg leading-relaxed ${
                    idx === origin.paragraphs.length - 1
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Operating Principles */}
      <section className="py-16 md:py-24 bg-bg-secondary/30 border-y border-border">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="max-w-4xl">
            <div className="section-label">Principles</div>
            <h2 className="text-display-sm font-bold mb-10">
              {aboutPageContent.values.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutPageContent.values.items.map((item, index) => (
                <div
                  key={item.title}
                  className="p-6 rounded-md bg-bg-secondary border border-border"
                >
                  <div className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                    0{index + 1}
                  </div>
                  <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team + CTA */}
      <section className="py-16 md:py-20 border-t border-border">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Team */}
            <motion.div variants={fadeUp}>
              <div className="section-label">The Team</div>
              <h2 className="text-display-sm font-bold mb-4">
                {team.title}
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed mb-6">
                {team.description}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
              >
                Work With Us
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            {/* Hiring */}
            <motion.div
              variants={fadeUp}
              className="p-8 rounded-md bg-bg-secondary border border-border"
            >
              <h3 className="text-heading-md font-semibold mb-4">
                {aboutPageContent.hiring.title}
              </h3>
              <p className="text-body-md text-text-secondary mb-6 leading-relaxed">
                {aboutPageContent.hiring.description}
              </p>
              <Link
                href={aboutPageContent.hiring.ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-sm hover:border-border-accent transition-colors"
              >
                {aboutPageContent.hiring.cta}
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
