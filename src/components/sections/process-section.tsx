'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activePhase, setActivePhase] = useState(0)

  return (
    <section ref={ref} className="relative z-10 py-20 md:py-28 bg-bg-secondary/40">
      <div className="container-main">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">How We Work</div>
          <h2 className="text-display-sm md:text-display-md font-bold mb-4">
            Predictable process.
          </h2>
          <p className="text-body-lg text-text-secondary">
            Every engagement follows a disciplined rhythm so complex changes land without surprises.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Phase Selector */}
          <div className="flex flex-wrap items-center gap-0 mb-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon
              const isActive = activePhase === index
              const isPast = index < activePhase

              return (
                <div key={phase.id} className="flex items-center">
                  <button
                    onClick={() => setActivePhase(index)}
                    className={`relative flex items-center gap-3 px-5 py-3 rounded-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-accent text-bg-primary'
                        : isPast
                          ? 'bg-surface text-accent'
                          : 'bg-surface/50 text-text-muted hover:text-text-secondary hover:bg-surface'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{phase.title}</span>
                    <span className={`text-xs font-mono hidden sm:inline ${isActive ? 'text-bg-primary/70' : 'text-text-muted'}`}>
                      {phase.duration}
                    </span>
                  </button>
                  {index < phases.length - 1 && (
                    <div className={`w-8 h-px hidden md:block ${index < activePhase ? 'bg-accent' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Active Phase Content */}
          <div className="relative min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 p-8 rounded-md bg-bg-secondary border border-border"
              >
                <div>
                  <p className="text-body-lg text-text-secondary leading-relaxed">
                    {phases[activePhase].description}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                    Deliverables
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {phases[activePhase].deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary">
                        <span className="text-accent mt-1.5 flex-shrink-0">
                          <svg width="5" height="5" viewBox="0 0 5 5" fill="currentColor">
                            <circle cx="2.5" cy="2.5" r="2.5" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
