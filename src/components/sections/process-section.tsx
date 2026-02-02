'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconChart, IconWrench, IconShield } from '@/components/ui/icons'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

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
        <motion.div
          className="max-w-2xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="section-label">How We Work</motion.div>
          <motion.h2 variants={fadeUp} className="text-display-sm md:text-display-md font-bold mb-4">
            Predictable process.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-body-lg text-text-secondary">
            Every engagement follows a disciplined rhythm so complex changes land without surprises.
          </motion.p>
        </motion.div>

        {/* Phase Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {phases.map((phase, index) => {
            const Icon = phase.icon
            const isActive = activePhase === index

            return (
              <motion.button
                key={phase.id}
                variants={fadeUp}
                onClick={() => setActivePhase(index)}
                className={`group relative p-6 rounded-lg text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-surface border-accent/50'
                    : 'bg-bg-secondary hover:bg-surface/50'
                } border border-border`}
              >
                {isActive && (
                  <motion.div
                    layoutId="process-indicator"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-accent rounded-t-lg"
                  />
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
              </motion.button>
            )
          })}
        </motion.div>

        {/* Active Phase Content */}
        <motion.div
          className="relative p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-10"
            >
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
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-2 text-body-sm text-text-secondary"
                    >
                      <span className="text-accent mt-1 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
        </motion.div>
      </div>
    </section>
  )
}
