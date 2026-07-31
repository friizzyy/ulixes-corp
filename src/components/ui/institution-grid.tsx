'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

interface Institution {
  name: string
  description: string
}

interface InstitutionGridProps {
  institutions: Institution[]
  className?: string
}

export function InstitutionGrid({ institutions, className }: InstitutionGridProps) {
  return (
    <motion.div
      className={cn('grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6', className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {institutions.map((institution, index) => (
        <motion.div
          key={institution.name}
          className={cn(
            'group relative p-6 md:p-8 rounded-lg',
            'bg-bg-secondary/50 border border-border/50',
            'transition-all duration-300',
            'hover:bg-bg-secondary hover:border-border hover:shadow-lg hover:shadow-accent/5'
          )}
          variants={fadeUp}
          custom={index}
        >
          {/* Subtle top accent line on hover */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/40 transition-all duration-500" />

          <h3 className="text-heading-md font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors duration-300">
            {institution.name}
          </h3>
          <p className="text-body-sm text-text-muted leading-relaxed">
            {institution.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
