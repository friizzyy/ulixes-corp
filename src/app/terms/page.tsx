'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section, ArrowRight } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { termsContent, siteConfig } from '@/lib/content'
import { GlassSurfaceContainer } from '@/components/system'

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="max-w-3xl" variants={fadeUp}>
            <div className="section-label">Legal</div>
            <h1 className="text-display-md font-bold mb-4">
              {termsContent.title}
            </h1>
            <p className="text-body-md text-text-muted font-mono">
              Last updated: {termsContent.lastUpdated}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Content */}
      <Section className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Table of Contents */}
          <motion.div
            className="lg:sticky lg:top-32 self-start"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <GlassSurfaceContainer>
              <h3 className="text-body-sm font-semibold text-text-muted mb-4 font-mono uppercase tracking-wider">
                On This Page
              </h3>
              <nav className="space-y-2">
                {termsContent.sections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#section-${index}`}
                    className="block text-body-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </GlassSurfaceContainer>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="space-y-12">
              {termsContent.sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  id={`section-${index}`}
                  className="scroll-mt-32"
                  variants={fadeUp}
                >
                  <h2 className="text-heading-lg font-semibold mb-4 flex items-center gap-3">
                    <span className="text-accent font-mono text-body-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer Note */}
            <motion.div
              className="mt-16 pt-8 border-t border-border"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <p className="text-body-sm text-text-muted mb-4">
                Questions about these terms? Reach out directly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`mailto:${siteConfig.email}`}
                  className="text-body-sm text-accent hover:underline underline-offset-4"
                >
                  {siteConfig.email}
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-accent transition-colors"
                >
                  View Privacy Policy
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
