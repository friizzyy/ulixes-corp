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
            'bg-surface/40 border border-violet-light/20 rounded-full',
            'text-body-sm text-violet-light font-medium',
            'transition-all duration-300',
            'hover:bg-ultraviolet/10 hover:border-violet-light/40'
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
