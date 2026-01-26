'use client'

import { useState } from 'react'
import Link from 'next/link'
import { homeContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export function PhilosophySection() {
  const { philosophy } = homeContent
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative z-10 py-24 md:py-32">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Header + Navigation */}
          <div>
            <div className="section-label">{philosophy.label}</div>
            <h2 className="text-display-sm md:text-display-md font-bold mb-6">
              {philosophy.title}
            </h2>
            <p className="text-body-lg text-text-secondary leading-relaxed mb-10">
              {philosophy.description}
            </p>

            {/* Tab Navigation */}
            <nav className="space-y-1 mb-8">
              {philosophy.points.map((point, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`group w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    activeIndex === index
                      ? 'bg-surface'
                      : 'hover:bg-surface/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`text-xs font-mono transition-colors ${
                      activeIndex === index ? 'text-accent' : 'text-text-muted'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-heading-sm font-medium transition-colors ${
                      activeIndex === index ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}>
                      {point.title}
                    </span>
                  </div>
                  {activeIndex === index && (
                    <div className="ml-8 mt-2 h-0.5 w-12 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            <Link
              href="/philosophy"
              className="inline-flex items-center gap-2 text-accent font-medium hover:underline underline-offset-4"
            >
              {philosophy.cta}
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Right: Active Content */}
          <div className="lg:pt-16">
            <div className="relative">
              {/* Large decorative number */}
              <div className="absolute -top-8 -left-4 text-[10rem] font-bold text-surface select-none leading-none opacity-50 pointer-events-none -z-10">
                {String(activeIndex + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10 p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                <div className="text-xs font-mono text-accent uppercase tracking-widest mb-4">
                  Principle {String(activeIndex + 1).padStart(2, '0')}
                </div>
                <h3 className="text-heading-lg font-semibold text-text-primary mb-4">
                  {philosophy.points[activeIndex].title}
                </h3>
                <p className="text-body-lg text-text-secondary leading-relaxed">
                  {philosophy.points[activeIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
