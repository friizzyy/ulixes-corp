'use client'

import { useState } from 'react'
import Link from 'next/link'
import { caseStudies, workPageContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export default function WorkPage() {
  const [activeStudy, setActiveStudy] = useState(0)
  const study = caseStudies[activeStudy]

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <div className="max-w-4xl">
            <div className="section-label">{workPageContent.hero.label}</div>
            <h1 className="text-display-lg md:text-display-xl font-bold mb-6">
              {workPageContent.hero.headline}
            </h1>
            <p className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {workPageContent.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="pb-24 md:pb-32">
        <div className="container-main">
          {/* Navigation - Minimal numbered tabs */}
          <div className="flex items-center gap-1 mb-16">
            {caseStudies.map((cs, index) => (
              <button
                key={cs.id}
                onClick={() => setActiveStudy(index)}
                className={`group relative px-6 py-3 transition-all duration-300 ${
                  activeStudy === index
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-xs font-mono tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-300 ${
                  activeStudy === index
                    ? 'bg-accent'
                    : 'bg-transparent group-hover:bg-border'
                }`} />
              </button>
            ))}
            <div className="flex-1 h-px bg-border ml-4" />
          </div>

          {/* Featured Case Study */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Title and Summary */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs font-mono tracking-wider text-text-muted uppercase">
                  {study.industry}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-xs font-mono tracking-wider text-text-muted">
                  {study.client}
                </span>
              </div>

              <h2 className="text-display-sm md:text-display-md font-bold mb-6 leading-tight">
                {study.title}
              </h2>

              <p className="text-body-lg text-text-secondary leading-relaxed mb-10">
                {study.summary}
              </p>

              {/* Services Tags */}
              <div className="flex flex-wrap gap-2">
                {study.services.map((service) => (
                  <span
                    key={service}
                    className="px-4 py-2 text-body-sm text-accent border border-accent/30 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-12">
              {/* Challenge */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  Challenge
                </h3>
                <p className="text-body-md text-text-secondary leading-relaxed">
                  {study.challenge}
                </p>
              </div>

              {/* Approach */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  Approach
                </h3>
                <p className="text-body-md text-text-secondary leading-relaxed">
                  {study.approach}
                </p>
              </div>

              {/* Results */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-8">
                  Results
                </h3>
                <div className="grid grid-cols-3 gap-8">
                  {study.outcome.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                        {metric.value}
                      </div>
                      <div className="text-body-sm text-text-muted">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-heading-lg md:text-display-sm font-bold mb-3">
                {workPageContent.cta.title}
              </h2>
              <p className="text-body-md text-text-secondary">
                {workPageContent.cta.description}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
            >
              {workPageContent.cta.primaryCta}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
