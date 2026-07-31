'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion'

interface CredibilityChipsProps {
  chips: string[]
  className?: string
}

export function CredibilityChips({ chips, className }: CredibilityChipsProps) {
  return (
    <motion.div
      className={cn('flex flex-wrap gap-3', className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {chips.map((chip, index) => (
        <motion.div
          key={chip}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2',
            'bg-surface/60 backdrop-blur-sm border border-border/60 rounded-full',
            'text-body-sm text-text-secondary font-medium',
            'transition-all duration-300 hover:border-accent/30 hover:bg-surface/80'
          )}
          variants={fadeUp}
          custom={index}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
          {chip}
        </motion.div>
      ))}
    </motion.div>
  )
}
