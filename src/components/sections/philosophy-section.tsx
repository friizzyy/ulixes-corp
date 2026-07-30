'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { homeContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

export function PhilosophySection() {
  const { philosophy } = homeContent

  return (
    <section className="relative z-10 py-20 sm:py-28 md:py-36 border-t border-border">
      <div className="container-main">
        {/* Header — right-aligned on desktop for visual variety, breaking the left-aligned monotony */}
        <motion.div
          className="mb-16 sm:mb-20 md:mb-28 lg:ml-auto lg:max-w-2xl lg:text-right"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="section-label lg:ml-auto">{philosophy.label}</motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-[1.75rem] sm:text-display-sm md:text-display-md font-semibold mb-4 sm:mb-5">
            {philosophy.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base sm:text-body-lg text-text-secondary leading-relaxed">
            {philosophy.description}
          </motion.p>
        </motion.div>

        {/* Principles — NOT tabs. A visible progression with asymmetric layout */}
        <motion.div
          className="space-y-0"
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {philosophy.points.map((point, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-10 md:py-14 ${
                  index < philosophy.points.length - 1 ? 'border-b border-border' : ''
                }`}>
                  {/* Number — always left */}
                  <div className="lg:col-span-1">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface group-hover:text-violet-light/20 transition-colors duration-500 font-mono leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title — offset on alternating rows for visual rhythm */}
                  <div className={`lg:col-span-4 ${isEven ? 'lg:col-start-2' : 'lg:col-start-3'}`}>
                    <h3 className="text-heading-md sm:text-heading-lg md:text-display-sm font-semibold text-text-primary group-hover:text-violet-light transition-colors duration-300">
                      {point.title}
                    </h3>
                  </div>

                  {/* Description — right side, wider */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:col-start-7' : 'lg:col-start-8'}`}>
                    <p className="text-body-md sm:text-body-lg text-text-secondary leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA — below the principles, left-aligned */}
        <motion.div
          className="mt-10 sm:mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/philosophy"
            className="inline-flex items-center gap-2 text-violet-light font-medium hover:underline active:underline underline-offset-4 min-h-[44px]"
          >
            {philosophy.cta}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
