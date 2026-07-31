'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FeatureShowcaseProps {
  title: string
  description: string
  features?: string[]
  visual: React.ReactNode
  reverse?: boolean
  badge?: string
  cta?: {
    label: string
    href: string
  }
  className?: string
}

export function FeatureShowcase({
  title,
  description,
  features,
  visual,
  reverse = false,
  badge,
  cta,
  className,
}: FeatureShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center',
        reverse && 'lg:grid-flow-dense',
        className
      )}
    >
      {/* Content */}
      <motion.div
        className={cn(reverse && 'lg:col-start-2')}
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {badge && (
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full">
            {badge}
          </span>
        )}

        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
          {title}
        </h3>

        <p className="text-body-lg text-text-secondary leading-relaxed mb-6">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.li
                key={feature}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-text-secondary">{feature}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {cta && (
          <motion.a
            href={cta.href}
            className="inline-flex items-center gap-2 text-accent font-medium hover:underline underline-offset-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {cta.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        )}
      </motion.div>

      {/* Visual */}
      <motion.div
        className={cn(reverse && 'lg:col-start-1')}
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {visual}
      </motion.div>
    </div>
  )
}

// Bento-style feature grid
interface BentoItem {
  id: string
  title: string
  description: string
  span?: 'default' | 'wide' | 'tall' | 'large'
  icon?: React.ReactNode
  visual?: React.ReactNode
  className?: string
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

export function BentoGrid({ items, className }: BentoGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const spanClasses = {
    default: '',
    wide: 'md:col-span-2',
    tall: 'md:row-span-2',
    large: 'md:col-span-2 md:row-span-2',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
        className
      )}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={cn(
            'group relative bg-bg-secondary border border-border rounded-lg overflow-hidden',
            'hover:border-border-accent transition-colors duration-300',
            spanClasses[item.span || 'default'],
            item.className
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          {/* Visual area */}
          {item.visual && (
            <div className="aspect-video w-full overflow-hidden bg-bg-tertiary">
              {item.visual}
            </div>
          )}

          {/* Content */}
          <div className="p-5 md:p-6">
            {item.icon && (
              <div className="w-10 h-10 rounded-md bg-surface border border-border flex items-center justify-center mb-4 text-text-secondary group-hover:text-accent transition-colors">
                {item.icon}
              </div>
            )}

            <h4 className="text-lg font-semibold text-text-primary mb-2">
              {item.title}
            </h4>

            <p className="text-sm text-text-secondary leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  )
}
