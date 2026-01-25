'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { IconBolt, IconWrench, IconChart, IconShield, ArrowRight } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { homeContent, services, ServiceIconType } from '@/lib/content'

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
    <section id="services" className="relative z-10 py-20 md:py-28 border-t border-border">
      <motion.div
        className="container-main"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {/* Header */}
        <motion.div className="max-w-2xl mb-12" variants={fadeUp}>
          <div className="section-label">{sectionContent.label}</div>
          <h2 className="text-display-sm md:text-display-md font-bold mb-4">
            {sectionContent.title}
          </h2>
          <p className="text-body-lg text-text-secondary">
            {sectionContent.description}
          </p>
        </motion.div>

        {/* Service Tabs + Content */}
        <motion.div variants={fadeUp}>
          {/* Tab Bar */}
          <div className="flex flex-wrap gap-2 mb-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.iconType]
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-body-sm font-medium transition-all duration-200 ${
                    activeIndex === index
                      ? 'bg-accent text-bg-primary'
                      : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <Icon size={16} />
                  {service.title}
                </button>
              )
            })}
          </div>

          {/* Active Service Content */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Left: Description + Features */}
                <div className="p-8 rounded-md bg-bg-secondary border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <IconComponent size={20} />
                    </div>
                    <div>
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
                        <span className="text-accent mt-1.5 flex-shrink-0">
                          <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                            <circle cx="3" cy="3" r="3" />
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
                </div>

                {/* Right: Risk/Control */}
                <div className="space-y-4">
                  <div className="p-6 rounded-md bg-red-500/5 border border-red-500/10">
                    <div className="text-xs font-mono uppercase tracking-wider text-red-400 mb-3">
                      Risk Prevented
                    </div>
                    <p className="text-body-md text-text-secondary leading-relaxed">
                      {activeService.riskPrevented}
                    </p>
                  </div>

                  <div className="p-6 rounded-md bg-accent/5 border border-accent/10">
                    <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
                      Control Created
                    </div>
                    <p className="text-body-md text-text-secondary leading-relaxed">
                      {activeService.controlCreated}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
