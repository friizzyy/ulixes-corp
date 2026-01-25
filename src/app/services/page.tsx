'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { IconBolt, IconWrench, IconChart, IconShield, ArrowUpRight } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { services, servicesPageContent, ServiceIconType } from '@/lib/content'

const iconMap: Record<ServiceIconType, React.FC<{ className?: string; size?: number }>> = {
  bolt: IconBolt,
  wrench: IconWrench,
  chart: IconChart,
  shield: IconShield,
}

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = services[activeIndex]
  const IconComponent = iconMap[activeService.iconType]

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
            <div className="section-label">{servicesPageContent.hero.label}</div>
            <h1 className="text-display-md md:text-display-lg font-bold mb-4">
              {servicesPageContent.hero.headline}
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {servicesPageContent.hero.description}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Service Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {services.map((service, index) => {
              const Icon = iconMap[service.iconType]
              return (
                <button
                  key={service.id}
                  id={service.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-sm text-body-sm font-medium transition-all duration-200 ${
                    activeIndex === index
                      ? 'bg-accent text-bg-primary'
                      : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <Icon size={18} />
                  {service.title}
                </button>
              )
            })}
          </div>

          {/* Active Service Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
                  {/* Main Content */}
                  <div className="p-8 md:p-10 rounded-md bg-bg-secondary border border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
                          Service 0{activeIndex + 1}
                        </div>
                        <h2 className="text-heading-lg font-semibold">
                          {activeService.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-body-lg text-text-secondary leading-relaxed mb-8">
                      {activeService.fullDescription}
                    </p>

                    <div className="mb-8">
                      <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
                        Deliverables
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeService.whatYouGet.map((item, i) => (
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
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-sm hover:border-border-accent transition-colors"
                    >
                      Discuss {activeService.title}
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>

                  {/* Side Panel */}
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
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t border-border">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            variants={fadeUp}
          >
            <div className="max-w-xl">
              <h2 className="text-heading-lg md:text-display-sm font-bold mb-2">
                {servicesPageContent.cta.title}
              </h2>
              <p className="text-body-md text-text-secondary">
                {servicesPageContent.cta.description}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
            >
              {servicesPageContent.cta.primaryCta}
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
