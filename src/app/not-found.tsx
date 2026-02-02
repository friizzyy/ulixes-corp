'use client'

import { motion } from 'framer-motion'
import { Button, ArrowLeft } from '@/components/ui'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { notFoundContent } from '@/lib/content'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10">
      <motion.div
        className="container-main text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-[8rem] md:text-[12rem] font-bold gradient-text leading-none mb-4"
          variants={fadeUp}
        >
          {notFoundContent.headline}
        </motion.div>
        <motion.h1
          className="text-display-sm font-bold mb-4"
          variants={fadeUp}
        >
          {notFoundContent.title}
        </motion.h1>
        <motion.p
          className="text-body-lg text-text-secondary mb-10 max-w-md mx-auto"
          variants={fadeUp}
        >
          {notFoundContent.description}
        </motion.p>
        <motion.div variants={fadeUp}>
          <Button href="/" size="lg">
            <ArrowLeft size={18} />
            {notFoundContent.cta}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
