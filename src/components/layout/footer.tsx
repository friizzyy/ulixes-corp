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
      <div className="container-main py-12 sm:py-16 md:py-20" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 3rem)' }}>
        {/* Mobile: 2-column grid for link sections, full width for brand */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          {/* Brand Column — full width on mobile */}
          <motion.div className="col-span-2 md:col-span-1 mb-2 md:mb-0" variants={fadeUp}>
            <Link href="/" className="flex items-center mb-4 sm:mb-6">
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
            <h4 className="text-body-sm font-semibold text-text-primary mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {navigation.footer.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary hover:text-text-primary active:text-text-primary transition-colors inline-flex items-center min-h-[36px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div variants={fadeUp}>
            <h4 className="text-body-sm font-semibold text-text-primary mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {navigation.footer.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary hover:text-text-primary active:text-text-primary transition-colors inline-flex items-center min-h-[32px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column — hidden on smallest screens, shown in brand section */}
          <motion.div className="col-span-2 sm:col-span-1 md:col-span-1" variants={fadeUp}>
            <h4 className="text-body-sm font-semibold text-text-primary mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-body-sm text-text-secondary hover:text-accent active:text-accent transition-colors inline-flex items-center min-h-[32px] break-all"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone?.replace(/\s/g, '')}`}
                  className="text-body-sm text-text-secondary hover:text-accent active:text-accent transition-colors inline-flex items-center min-h-[32px]"
                >
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
          variants={fadeUp}
        >
          <p className="text-body-sm text-text-muted text-center sm:text-left">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {navigation.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm text-text-muted hover:text-text-secondary active:text-text-secondary transition-colors min-h-[32px] inline-flex items-center"
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
