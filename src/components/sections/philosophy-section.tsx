'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { homeContent } from '@/lib/content'
import { ArrowUpRight } from '@/components/ui'

export function PhilosophySection() {
  const { philosophy } = homeContent
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative z-10 py-20 md:py-28">
      <motion.div
        className="container-main"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
          {/* Left: Header + Navigation */}
          <motion.div variants={fadeUp}>
            <div className="section-label">{philosophy.label}</div>
            <h2 className="text-display-sm md:text-display-md font-bold mb-6">
              {philosophy.title}
            </h2>
            <p className="text-body-lg text-text-secondary leading-relaxed mb-10">
              {philosophy.description}
            </p>

            {/* Tab Navigation */}
            <nav className="space-y-1">
              {philosophy.points.map((point, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-200 group ${
                    activeIndex === index
                      ? 'bg-surface border-l-2 border-l-accent'
                      : 'hover:bg-surface/50'
                  }`}
                >
                  <span className={`text-heading-sm font-medium transition-colors ${
                    activeIndex === index ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                  }`}>
                    {point.title}
                  </span>
                </button>
              ))}
            </nav>

            <Link
              href="/philosophy"
              className="inline-flex items-center gap-2 mt-8 text-accent font-medium hover:underline underline-offset-4"
            >
              {philosophy.cta}
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>

          {/* Right: Active Content */}
          <motion.div
            variants={fadeUp}
            className="lg:pt-16"
          >
            <div className="relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 rounded-md bg-bg-secondary border border-border"
                >
                  <div className="text-xs font-mono text-accent uppercase tracking-widest mb-4">
                    0{activeIndex + 1}
                  </div>
                  <h3 className="text-heading-lg font-semibold text-text-primary mb-4">
                    {philosophy.points[activeIndex].title}
                  </h3>
                  <p className="text-body-lg text-text-secondary leading-relaxed">
                    {philosophy.points[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
