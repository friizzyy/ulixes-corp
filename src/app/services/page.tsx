'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { IconBolt, IconWrench, IconChart, IconShield, ArrowUpRight, PageTransition } from '@/components/ui'
import { services, servicesPageContent, ServiceIconType } from '@/lib/content'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

const iconMap: Record<ServiceIconType, React.FC<{ className?: string; size?: number }>> = {
  bolt: IconBolt,
  wrench: IconWrench,
  chart: IconChart,
  shield: IconShield,
}

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const servicesGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const serviceIndex = services.findIndex(s => s.id === hash)
        if (serviceIndex !== -1) {
          setActiveIndex(serviceIndex)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }

    // Run on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  const activeService = services[activeIndex]
  const IconComponent = iconMap[activeService.iconType]

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-8 sm:pt-40 sm:pb-12 md:pt-48 md:pb-16 relative z-10">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            {/* Left: Headline */}
            <motion.div
              className="lg:col-span-7"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="section-label">{servicesPageContent.hero.label}</motion.div>
              <motion.h1 variants={fadeUp} className="font-display text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-semibold leading-[1.08] tracking-tight mb-6 sm:mb-8">
                {servicesPageContent.hero.headline}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base sm:text-body-lg text-text-secondary leading-relaxed max-w-lg">
                {servicesPageContent.hero.description}
              </motion.p>
            </motion.div>

            {/* Right: Service Index */}
            <motion.div
              className="lg:col-span-4 lg:col-start-9"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <nav className="space-y-0">
                {services.map((service, index) => (
                  <motion.button
                    key={service.id}
                    variants={fadeUp}
                    onClick={() => {
                      setActiveIndex(index)
                      servicesGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="group flex items-baseline gap-3 w-full text-left py-3 border-b border-border last:border-b-0 transition-colors duration-200"
                  >
                    <span className="text-xs font-mono text-text-muted/50 group-hover:text-violet-light transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base sm:text-lg font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                      {service.title}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="pb-20 sm:pb-28 md:pb-36" ref={servicesGridRef}>
        <div className="container-main">
          {/* Tab navigation — clean underline tabs */}
          <motion.div
            className="flex items-center gap-0 border-b border-border mb-12 sm:mb-16 overflow-x-auto scrollbar-none -mx-5 px-5 sm:mx-0 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {services.map((service, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  key={service.id}
                  id={service.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-body-sm font-medium transition-colors duration-200 min-h-[44px] ${
                    isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {service.title}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                    isActive ? 'bg-ultraviolet' : 'bg-transparent'
                  }`} />
                </button>
              )
            })}
          </motion.div>

          {/* Active service — open layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
                {/* Left: Main content */}
                <div className="lg:col-span-7">
                  <div className="text-xs font-mono text-violet-light uppercase tracking-wider mb-3">
                    Service {String(activeIndex + 1).padStart(2, '0')}
                  </div>
                  <h2 className="font-display text-[1.5rem] sm:text-display-sm font-semibold mb-6 sm:mb-8">
                    {activeService.title}
                  </h2>

                  <p className="text-body-lg text-text-secondary leading-relaxed mb-10">
                    {activeService.fullDescription}
                  </p>

                  {/* Deliverables — clean list, no card wrappers */}
                  <div className="mb-10">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">
                      What You Get
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeService.whatYouGet.map((item, i) => (
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
                  </div>

                  <Link href="/contact" className="cta-primary">
                    Discuss {activeService.title}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                {/* Right: Risk + control + approach */}
                <div className="lg:col-span-5 space-y-10 lg:pt-10">
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

                  <div className="pt-6 border-t border-border">
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-4">
                      Our Approach
                    </h4>
                    <div className="space-y-3">
                      {servicesPageContent.process.steps.slice(0, 3).map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-xs font-mono text-violet-light">{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-body-sm text-text-secondary">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Engagement Process */}
      <section className="py-20 sm:py-28 md:py-36 bg-bg-secondary/50 border-y border-border">
        <div className="container-main">
          <motion.div
            className="mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2 variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
              {servicesPageContent.process.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[1.75rem] sm:text-display-sm md:text-display-md font-display font-semibold max-w-2xl">
              {servicesPageContent.process.description}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {servicesPageContent.process.steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="group relative p-6 rounded-lg bg-bg-primary border border-border hover:border-violet-light/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono text-violet-light mt-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-body-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 md:py-36">
        <div className="container-main">
          <motion.div
            className="relative p-6 sm:p-10 md:p-16 rounded-lg bg-bg-secondary border border-border overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <motion.div variants={fadeUp} className="max-w-xl">
                <h2 className="text-[1.75rem] sm:text-display-sm font-display font-semibold mb-3">
                  {servicesPageContent.cta.title}
                </h2>
                <p className="text-body-lg text-text-secondary">
                  {servicesPageContent.cta.description}
                </p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link href="/contact" className="cta-primary shrink-0">
                  {servicesPageContent.cta.primaryCta}
                  <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
