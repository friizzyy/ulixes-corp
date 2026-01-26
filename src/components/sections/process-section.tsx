'use client'

import { useState } from 'react'
import { IconChart, IconWrench, IconShield } from '@/components/ui/icons'

const phases = [
  {
    id: 'assess',
    icon: IconChart,
    title: 'Assess',
    duration: 'Weeks 1-2',
    description: 'Deep-dive into current state, data lineage, and risk exposure.',
    deliverables: [
      'System and data lineage mapping',
      'Control gap analysis',
      'Risk quantification',
      'Stakeholder alignment',
    ],
  },
  {
    id: 'design',
    icon: IconWrench,
    title: 'Design',
    duration: 'Weeks 3-4',
    description: 'Architecture, accounting policy mapping, and control design.',
    deliverables: [
      'Target state architecture',
      'Policy-to-system mapping',
      'Control framework design',
      'Migration pathway',
    ],
  },
  {
    id: 'execute',
    icon: IconShield,
    title: 'Execute',
    duration: 'Weeks 5+',
    description: 'Iterative delivery with checkpoints, validation, and handoff.',
    deliverables: [
      'Implementation sprints',
      'Parallel run validation',
      'Audit documentation',
      'Knowledge transfer',
    ],
  },
]

export function ProcessSection() {
  const [activePhase, setActivePhase] = useState(0)

  return (
    <section className="relative z-10 py-24 md:py-32 bg-bg-secondary/40">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="section-label">How We Work</div>
          <h2 className="text-display-sm md:text-display-md font-bold mb-4">
            Predictable process.
          </h2>
          <p className="text-body-lg text-text-secondary">
            Every engagement follows a disciplined rhythm so complex changes land without surprises.
          </p>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {phases.map((phase, index) => {
            const Icon = phase.icon
            const isActive = activePhase === index

            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(index)}
                className={`group relative p-6 rounded-lg text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-surface border-accent/50'
                    : 'bg-bg-secondary hover:bg-surface/50'
                } border border-border`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent rounded-t-lg" />
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : 'bg-surface text-text-muted group-hover:text-accent'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-mono transition-colors ${
                    isActive ? 'text-accent' : 'text-text-muted'
                  }`}>
                    {phase.duration}
                  </span>
                </div>

                <h3 className={`text-heading-md font-semibold transition-colors ${
                  isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                }`}>
                  {phase.title}
                </h3>
              </button>
            )
          })}
        </div>

        {/* Active Phase Content */}
        <div className="relative p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-4">
                Phase {String(activePhase + 1).padStart(2, '0')} — {phases[activePhase].title}
              </div>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                {phases[activePhase].description}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">
                Deliverables
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {phases[activePhase].deliverables.map((item, i) => (
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
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {phases.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePhase(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activePhase === index
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-border hover:bg-text-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
