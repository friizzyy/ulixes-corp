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
    <section id="services" className="relative z-10 py-24 md:py-32 border-t border-border">
      <div className="container-main">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="section-label">{sectionContent.label}</motion.div>
          <motion.h2 variants={fadeUp} className="text-display-sm md:text-display-md font-bold mb-4">
            {sectionContent.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-body-lg text-text-secondary">
            {sectionContent.description}
          </motion.p>
        </motion.div>

        {/* Service Cards Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
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
                className={`group relative p-5 rounded-lg text-left transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-surface border-accent/50'
                    : 'bg-bg-secondary hover:bg-surface/50'
                } border border-border`}
              >
                {activeIndex === index && (
                  <motion.div
                    layoutId="services-indicator"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-accent rounded-t-lg"
                  />
                )}

                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                  activeIndex === index
                    ? 'bg-accent/20 text-accent'
                    : 'bg-surface text-text-muted group-hover:text-accent'
                }`}>
                  <Icon size={18} />
                </div>

                <h3 className={`text-body-sm font-medium transition-colors ${
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Description + Features */}
          <div className="relative p-8 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-accent uppercase tracking-wider mb-0.5">
                      Service {String(activeIndex + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-heading-md font-semibold text-text-primary">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                <p className="text-body-md text-text-secondary leading-relaxed mb-6">
                  {activeService.shortDescription}
                </p>

                <ul className="space-y-2 mb-6">
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
                  className="inline-flex items-center gap-2 text-accent text-body-sm font-medium hover:underline underline-offset-4"
                >
                  Full service details
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Risk/Control */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`risk-${activeIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative p-6 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-red-500/50 via-red-500/20 to-transparent" />

                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-widest text-red-400 mb-3">
                    Risk Prevented
                  </div>
                  <p className="text-body-md text-text-primary leading-relaxed">
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
                className="relative p-6 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />

                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">
                    Control Created
                  </div>
                  <p className="text-body-md text-text-primary leading-relaxed">
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
