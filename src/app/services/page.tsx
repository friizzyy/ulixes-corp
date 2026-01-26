'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconBolt, IconWrench, IconChart, IconShield, ArrowUpRight } from '@/components/ui'
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
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <div className="max-w-4xl">
            <div className="section-label">{servicesPageContent.hero.label}</div>
            <h1 className="text-display-lg md:text-display-xl font-bold mb-6">
              {servicesPageContent.hero.headline}
            </h1>
            <p className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {servicesPageContent.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container-main">
          {/* Service Selector - Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
            {services.map((service, index) => {
              const Icon = iconMap[service.iconType]
              return (
                <button
                  key={service.id}
                  id={service.id}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative p-6 rounded-lg text-left transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-surface border-accent/50'
                      : 'bg-bg-secondary hover:bg-surface/50'
                  } border border-border`}
                >
                  {/* Active indicator */}
                  {activeIndex === index && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent rounded-t-lg" />
                  )}

                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                    activeIndex === index
                      ? 'bg-accent/20 text-accent'
                      : 'bg-surface text-text-muted group-hover:text-accent'
                  }`}>
                    <Icon size={20} />
                  </div>

                  <div className="text-xs font-mono text-text-muted mb-1">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <h3 className={`text-heading-sm font-medium transition-colors ${
                    activeIndex === index ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                  }`}>
                    {service.title}
                  </h3>
                </button>
              )
            })}
          </div>

          {/* Active Service Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Main Content */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <IconComponent size={28} />
                </div>
                <div>
                  <div className="text-xs font-mono text-accent uppercase tracking-wider mb-1">
                    Service {String(activeIndex + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-display-sm font-bold">
                    {activeService.title}
                  </h2>
                </div>
              </div>

              <p className="text-body-lg text-text-secondary leading-relaxed mb-10">
                {activeService.fullDescription}
              </p>

              {/* Deliverables */}
              <div className="mb-10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-6">
                  What You Get
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeService.whatYouGet.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-lg bg-surface/50 border border-border"
                    >
                      <span className="text-accent mt-0.5 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="text-body-sm text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
              >
                Discuss {activeService.title}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Right: Risk/Control Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Risk Prevented */}
              <div className="relative p-8 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-red-500/50 via-red-500/20 to-transparent" />

                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-widest text-red-400 mb-4">
                    Risk Prevented
                  </div>
                  <p className="text-body-md text-text-primary leading-relaxed">
                    {activeService.riskPrevented}
                  </p>
                </div>
              </div>

              {/* Control Created */}
              <div className="relative p-8 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />

                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                    Control Created
                  </div>
                  <p className="text-body-md text-text-primary leading-relaxed">
                    {activeService.controlCreated}
                  </p>
                </div>
              </div>

              {/* Process Quick View */}
              <div className="p-6 rounded-lg bg-bg-secondary border border-border">
                <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">
                  Our Approach
                </h4>
                <div className="space-y-3">
                  {servicesPageContent.process.steps.slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs font-mono text-accent">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-body-sm text-text-secondary">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Process */}
      <section className="py-24 md:py-32 bg-bg-secondary/50 border-y border-border">
        <div className="container-main">
          <div className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              {servicesPageContent.process.title}
            </h2>
            <p className="text-display-sm md:text-display-md font-bold max-w-2xl">
              {servicesPageContent.process.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesPageContent.process.steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative p-8 rounded-lg bg-bg-primary border border-border hover:border-accent/30 transition-all duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-lg bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="text-4xl font-bold text-surface group-hover:text-accent/20 transition-colors mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="relative p-10 md:p-16 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-display-sm font-bold mb-3">
                  {servicesPageContent.cta.title}
                </h2>
                <p className="text-body-lg text-text-secondary">
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
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
