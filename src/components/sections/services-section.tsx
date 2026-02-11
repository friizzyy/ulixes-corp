'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { IconBolt, IconWrench, IconChart, IconShield, ArrowRight } from '@/components/ui'
import { homeContent, services, ServiceIconType } from '@/lib/content'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

const iconMap: Record<ServiceIconType, React.FC<{ className?: string; size?: number }>> = {
  bolt: IconBolt,
  wrench: IconWrench,
  chart: IconChart,
  shield: IconShield,
}

export function ServicesSection() {
  const { services: sectionContent } = homeContent
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = services[activeIndex]
  const IconComponent = iconMap[activeService.iconType]

  return (
    <section id="services" className="relative z-10 py-16 sm:py-20 md:py-32 border-t border-border">
      <div className="container-main">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-10 sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="section-label">{sectionContent.label}</motion.div>
          <motion.h2 variants={fadeUp} className="text-[1.75rem] sm:text-display-sm md:text-display-md font-bold mb-3 sm:mb-4">
            {sectionContent.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base sm:text-body-lg text-text-secondary">
            {sectionContent.description}
          </motion.p>
        </motion.div>

        {/* Service Cards Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-8 sm:mb-12"
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.iconType]
            return (
              <motion.button
                key={service.id}
                variants={fadeUp}
                onClick={() => setActiveIndex(index)}
                className={`group relative p-3.5 sm:p-5 rounded-lg text-left transition-all duration-300 min-h-[44px] ${
                  activeIndex === index
                    ? 'bg-surface border-accent/50'
                    : 'bg-bg-secondary hover:bg-surface/50 active:bg-surface/50'
                } border border-border`}
              >
                {activeIndex === index && (
                  <motion.div
                    layoutId="services-indicator"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-accent rounded-t-lg"
                  />
                )}

                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-2.5 sm:mb-3 transition-colors ${
                  activeIndex === index
                    ? 'bg-accent/20 text-accent'
                    : 'bg-surface text-text-muted group-hover:text-accent'
                }`}>
                  <Icon size={16} className="sm:hidden" />
                  <Icon size={18} className="hidden sm:block" />
                </div>

                <h3 className={`text-[13px] sm:text-body-sm font-medium transition-colors leading-tight ${
                  activeIndex === index ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                }`}>
                  {service.title}
                </h3>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Active Service Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Description + Features */}
          <div className="relative p-5 sm:p-8 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <IconComponent size={20} className="sm:hidden" />
                    <IconComponent size={24} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-accent uppercase tracking-wider mb-0.5">
                      Service {String(activeIndex + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-base sm:text-heading-md font-semibold text-text-primary truncate">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                <p className="text-body-sm sm:text-body-md text-text-secondary leading-relaxed mb-5 sm:mb-6">
                  {activeService.shortDescription}
                </p>

                <ul className="space-y-2 mb-5 sm:mb-6">
                  {activeService.whatYouGet.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary">
                      <span className="text-accent mt-1 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services#${activeService.id}`}
                  className="inline-flex items-center gap-2 text-accent text-body-sm font-medium hover:underline active:underline underline-offset-4 min-h-[44px]"
                >
                  Full service details
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Risk/Control */}
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`risk-${activeIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative p-5 sm:p-6 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-red-500/50 via-red-500/20 to-transparent" />

                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-widest text-red-400 mb-2 sm:mb-3">
                    Risk Prevented
                  </div>
                  <p className="text-body-sm sm:text-body-md text-text-primary leading-relaxed">
                    {activeService.riskPrevented}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`control-${activeIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative p-5 sm:p-6 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />

                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2 sm:mb-3">
                    Control Created
                  </div>
                  <p className="text-body-sm sm:text-body-md text-text-primary leading-relaxed">
                    {activeService.controlCreated}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
