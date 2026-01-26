'use client'

import Link from 'next/link'
import { aboutContent, aboutPageContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export default function AboutPage() {
  const { hero, origin, philosophy, team } = aboutContent

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <div className="max-w-4xl">
            <div className="section-label">About</div>
            <h1 className="text-display-lg md:text-display-xl font-bold mb-6">
              {hero.headline}
            </h1>
            <p className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="pb-24 md:pb-32">
        <div className="container-main">
          {/* Large Stats Banner */}
          <div className="relative mb-20 p-10 md:p-16 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  {origin.title}
                </h2>
                <p className="text-heading-lg md:text-display-sm font-semibold text-text-primary max-w-lg">
                  We came from trading floors, treasury functions, and Big Four advisory practices.
                </p>
              </div>

              <div className="flex gap-12 md:gap-16">
                {aboutPageContent.numbers.stats.map((stat) => (
                  <div key={stat.label} className="text-right">
                    <div className="text-5xl md:text-6xl font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-body-sm text-text-muted font-mono uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Narrative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
              <p className="text-body-lg text-text-secondary leading-relaxed">
                {origin.paragraphs[0]}
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 space-y-8">
              {origin.paragraphs.slice(1).map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`text-body-md leading-relaxed ${
                    idx === origin.paragraphs.length - 2
                      ? 'text-text-primary font-medium border-l-2 border-accent pl-6'
                      : 'text-text-secondary'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="py-24 md:py-32 bg-bg-secondary/50 border-y border-border">
        <div className="container-main">
          <div className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              What We Believe
            </h2>
            <p className="text-display-sm md:text-display-md font-bold max-w-2xl">
              The principles that shape every engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophy.points.map((point, index) => (
              <div
                key={point.title}
                className="group relative p-8 rounded-lg bg-bg-primary border border-border hover:border-accent/30 transition-all duration-300"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <span className="inline-block text-xs font-mono text-accent mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-heading-md font-semibold text-text-primary mb-3">
                    {point.title}
                  </h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section className="py-24 md:py-32">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  How We Work
                </h2>
                <p className="text-display-sm font-bold mb-6">
                  {aboutPageContent.values.title}
                </p>
                <p className="text-body-md text-text-secondary">
                  We are senior practitioners, not staffing leverage. Every engagement is led by partners who have designed, built, and defended these systems inside institutions.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="space-y-1">
                {aboutPageContent.values.items.map((item, index) => (
                  <div
                    key={item.title}
                    className="group p-6 -mx-6 rounded-lg hover:bg-surface/50 transition-colors duration-200"
                  >
                    <div className="flex gap-4">
                      <span className="text-xs font-mono text-accent mt-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-heading-sm font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-body-md text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team + Hiring */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Team */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="relative">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  The Team
                </h2>
                <p className="text-display-sm font-bold mb-6">
                  {team.title}
                </p>
                <p className="text-body-lg text-text-secondary leading-relaxed mb-8">
                  {team.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow"
                >
                  Work With Us
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            {/* Hiring Card */}
            <div className="relative p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface to-bg-secondary border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  {aboutPageContent.hiring.title}
                </h3>
                <p className="text-body-md text-text-secondary leading-relaxed mb-8">
                  {aboutPageContent.hiring.description}
                </p>
                <Link
                  href={aboutPageContent.hiring.ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/30 text-accent font-medium rounded-sm hover:bg-accent/10 transition-colors"
                >
                  {aboutPageContent.hiring.cta}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
