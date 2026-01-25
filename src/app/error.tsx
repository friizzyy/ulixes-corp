'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, ArrowLeft } from '@/components/ui'
import { fadeUp, staggerContainer } from '@/lib/motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <section className="min-h-screen flex items-center justify-center relative z-10">
      <motion.div
        className="container-main text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-500/20 flex items-center justify-center"
          variants={fadeUp}
        >
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>
        <motion.h1
          className="text-display-sm font-bold mb-4"
          variants={fadeUp}
        >
          Something went wrong
        </motion.h1>
        <motion.p
          className="text-body-lg text-text-secondary mb-10 max-w-md mx-auto"
          variants={fadeUp}
        >
          An unexpected error occurred. Our team has been notified.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeUp}>
          <Button onClick={reset} size="lg">
            Try Again
          </Button>
          <Button href="/" variant="secondary" size="lg">
            <ArrowLeft size={18} />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
