'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

const phases = [
  {
    id: 'assess',
    title: 'Assess',
    duration: 'Weeks 1–2',
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
    title: 'Design',
    duration: 'Weeks 3–4',
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
  return (
    <section className="relative z-10 py-20 sm:py-28 md:py-36 bg-bg-secondary/40 border-t border-border">
      <div className="container-main">
        {/* Header — left-aligned with a large number accent for uniqueness */}
        <motion.div
          className="mb-14 sm:mb-20 md:mb-24 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="section-label">How We Work</div>
            <h2 className="font-display text-[1.75rem] sm:text-display-sm md:text-display-md font-semibold">
              Predictable process.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <p className="text-base sm:text-body-lg text-text-secondary leading-relaxed">
              Every engagement follows a disciplined rhythm so complex changes land without surprises.
            </p>
          </motion.div>
        </motion.div>

        {/* Phases — all visible as 3 columns on desktop, stacked timeline on mobile */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-0"
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              variants={fadeUp}
              className="group relative"
            >
              {/* Top connector line + phase indicator */}
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                {/* Phase dot */}
                <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0" />
                {/* Connector line */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-accent/40 to-border" />
                )}
                {index < phases.length - 1 && (
                  <div className="md:hidden absolute left-[5px] top-8 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-accent/40 to-border" />
                )}
              </div>

              {/* Phase content */}
              <div className={`pb-10 md:pb-0 pl-7 md:pl-0 ${index < phases.length - 1 ? 'md:pr-8 lg:pr-12' : ''}`}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[11px] font-mono text-accent uppercase tracking-widest">
                    Phase {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {phase.duration}
                  </span>
                </div>

                <h3 className="text-heading-lg sm:text-display-sm font-display font-semibold text-text-primary mb-3 sm:mb-4">
                  {phase.title}
                </h3>

                <p className="text-body-sm sm:text-body-md text-text-secondary leading-relaxed mb-5 sm:mb-6">
                  {phase.description}
                </p>

                <ul className="space-y-2">
                  {phase.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-body-sm text-text-muted">
                      <span className="text-accent/60 mt-1 flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
