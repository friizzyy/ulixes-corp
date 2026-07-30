'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from '@/components/ui'
import { homeContent, services } from '@/lib/content'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function ServicesSection() {
  const { services: sectionContent } = homeContent
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = services[activeIndex]

  return (
    <section id="services" className="relative z-10 py-20 sm:py-28 md:py-36 border-t border-border">
      <div className="container-main">
        {/* Header */}
        <motion.div
          className="mb-14 sm:mb-18 md:mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="section-label">{sectionContent.label}</motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-[1.75rem] sm:text-display-sm md:text-display-md font-semibold mb-4 sm:mb-5 max-w-2xl">
            {sectionContent.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base sm:text-body-lg text-text-secondary leading-relaxed max-w-xl">
            {sectionContent.description}
          </motion.p>
        </motion.div>

        {/* Tab navigation — clean text tabs with underline, NOT card buttons */}
        <motion.div
          role="tablist"
          className="flex items-center gap-0 border-b border-border mb-10 sm:mb-14 overflow-x-auto scrollbar-none -mx-5 px-5 sm:mx-0 sm:px-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index
            return (
              <button
                key={service.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`View ${service.title}`}
                onClick={() => setActiveIndex(index)}
                className={`relative whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-body-sm font-medium transition-colors duration-200 min-h-[44px] ${
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {service.title}
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                  isActive ? 'bg-ultraviolet' : 'bg-transparent'
                }`} aria-hidden="true" />
              </button>
            )
          })}
        </motion.div>

        {/* Active service content — open layout, no card wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
              {/* Left: Service description + deliverables */}
              <div className="lg:col-span-7">
                <div className="text-[11px] font-mono text-violet-light uppercase tracking-widest mb-3">
                  Service {String(activeIndex + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-heading-lg sm:text-display-sm font-semibold text-text-primary mb-4 sm:mb-6">
                  {activeService.title}
                </h3>
                <p className="text-body-md sm:text-body-lg text-text-secondary leading-relaxed mb-8">
                  {activeService.shortDescription}
                </p>

                {/* Deliverables as a clean list */}
                <div className="space-y-3 mb-8">
                  {activeService.whatYouGet.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-body-sm text-text-secondary">
                      <span className="text-violet-light mt-0.5 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <Link
                  href={`/services#${activeService.id}`}
                  className="inline-flex items-center gap-2 text-violet-light text-body-sm font-medium hover:underline underline-offset-4 min-h-[44px]"
                >
                  Full service details
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Right: Risk vs control — simple text blocks, not cards */}
              <div className="lg:col-span-5 space-y-8 lg:pt-10">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">
                    The risk
                  </div>
                  <p className="text-body-md text-text-secondary leading-relaxed border-l-2 border-red-500/30 pl-4">
                    {activeService.riskPrevented}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">
                    The outcome
                  </div>
                  <p className="text-body-md text-text-secondary leading-relaxed border-l-2 border-violet-light/40 pl-4">
                    {activeService.controlCreated}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
