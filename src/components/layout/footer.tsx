'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
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
      <div className="container-main py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <motion.div className="md:col-span-1" variants={fadeUp}>
            <Link href="/" className="flex items-center mb-6">
              <span className="font-mono text-lg tracking-tight">
                <span className="text-accent font-semibold">[</span>
                <span className="text-text-primary font-medium mx-1">ulixes</span>
                <span className="text-accent font-semibold">]</span>
              </span>
            </Link>
            <p className="text-body-sm text-text-secondary leading-relaxed max-w-xs">
              Enterprise Calypso consulting for the world&apos;s most demanding financial institutions.
            </p>
          </motion.div>

          {/* Services Column */}
          <motion.div variants={fadeUp}>
            <h4 className="text-body-sm font-semibold text-text-primary mb-4">Services</h4>
            <ul className="space-y-3">
              {navigation.footer.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div variants={fadeUp}>
            <h4 className="text-body-sm font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              {navigation.footer.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={fadeUp}>
            <h4 className="text-body-sm font-semibold text-text-primary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-body-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
          variants={fadeUp}
        >
          <p className="text-body-sm text-text-muted">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
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
