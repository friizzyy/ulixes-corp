'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { siteConfig, navigation } from '@/lib/content'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="relative z-10 border-t border-border"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="container-main py-12 sm:py-16 md:py-20" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)' }}>
        {/* Top row: Logo + Nav links */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 sm:gap-6 mb-10 sm:mb-12"
          variants={fadeUp}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-mono text-lg tracking-tight">
              <span className="text-accent font-semibold">[</span>
              <span className="text-text-primary font-medium mx-1">ulixes</span>
              <span className="text-accent font-semibold">]</span>
            </span>
          </Link>

          {/* Main nav — same links as header */}
          <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>

        {/* Bottom row: Copyright + Legal + Email */}
        <motion.div
          className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={fadeUp}
        >
          <p className="text-body-sm text-text-muted">
            &copy; {currentYear} {siteConfig.name}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-body-sm text-text-muted hover:text-accent transition-colors"
            >
              {siteConfig.email}
            </a>
            {navigation.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}
