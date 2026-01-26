'use client'

import { useState } from 'react'
import Link from 'next/link'
import { philosophyContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export default function PhilosophyPage() {
  const { hero, intro, sections, closing } = philosophyContent
  const [activeSection, setActiveSection] = useState(0)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <div className="max-w-4xl">
            <div className="section-label">{hero.label}</div>
            <h1 className="text-display-lg md:text-display-xl font-bold mb-4">
              {hero.headline}
            </h1>
            <p className="text-heading-md md:text-heading-lg text-accent font-medium mb-6">
              {hero.subtitle}
            </p>
            <p className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Banner */}
      <section className="pb-20 md:pb-28">
        <div className="container-main">
          <div className="relative p-10 md:p-16 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

            <p className="relative text-body-lg md:text-xl text-text-primary leading-relaxed max-w-4xl">
              {intro.text}
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Principles */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Sticky Navigation */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-8">
                  Core Principles
                </h2>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`group w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        activeSection === index
                          ? 'bg-surface'
                          : 'hover:bg-surface/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className={`text-xs font-mono transition-colors ${
                          activeSection === index ? 'text-accent' : 'text-text-muted'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-heading-sm font-medium transition-colors leading-tight ${
                          activeSection === index ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                        }`}>
                          {section.title}
                        </span>
                      </div>
                      {activeSection === index && (
                        <div className="ml-8 mt-2 h-0.5 w-12 bg-accent rounded-full" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-7 lg:col-start-6">
              <article className="relative">
                {/* Large decorative number */}
                <div className="absolute -top-8 -left-4 text-[12rem] font-bold text-surface select-none leading-none opacity-30 pointer-events-none -z-10">
                  {String(activeSection + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10">
                  <h2 className="text-display-sm md:text-display-md font-bold mb-8">
                    {sections[activeSection].title}
                  </h2>

                  <div className="space-y-6">
                    {sections[activeSection].content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={`text-body-lg leading-relaxed ${
                          idx === sections[activeSection].content.length - 1
                            ? 'text-text-primary font-medium border-l-2 border-accent pl-6'
                            : 'text-text-secondary'
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 mt-16">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeSection === index
                        ? 'w-8 bg-accent'
                        : 'w-2 bg-border hover:bg-text-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-main">
          <div className="relative p-10 md:p-16 rounded-lg bg-bg-secondary border border-border overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  {closing.title}
                </h2>
                <p className="text-body-lg text-text-secondary leading-relaxed">
                  {closing.content}
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow shrink-0"
              >
                Start a Conversation
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
