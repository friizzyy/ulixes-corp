'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/ui'
import { homeContent } from '@/lib/content'

export function CTASection() {
  const { cta } = homeContent
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="relative z-10 py-16 md:py-20 border-t border-border">
      <div className="container-main">
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-xl">
            <h2 className="text-heading-lg md:text-display-sm font-bold mb-2">
              {cta.title}
            </h2>
            <p className="text-body-md text-text-secondary">
              {cta.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
            >
              {cta.primaryCta}
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/work"
              className="text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              {cta.secondaryCta}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
