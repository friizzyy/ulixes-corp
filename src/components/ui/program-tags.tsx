'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

interface ProgramTagsProps {
  tags: string[]
  className?: string
}

export function ProgramTags({ tags, className }: ProgramTagsProps) {
  return (
    <motion.div
      className={cn('flex flex-wrap gap-3', className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {tags.map((tag, index) => (
        <motion.span
          key={tag}
          className={cn(
            'inline-flex items-center px-4 py-2.5',
            'bg-surface/40 border border-accent/20 rounded-full',
            'text-body-sm text-accent font-medium',
            'transition-all duration-300',
            'hover:bg-accent/10 hover:border-accent/40'
          )}
          variants={fadeUp}
          custom={index}
        >
          {tag}
        </motion.span>
      ))}
    </motion.div>
  )
}
