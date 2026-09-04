const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/** @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  // A concurrent `next build` must not replace the chunks used by `next dev`.
  // When both share `.next`, the open app starts returning 404s for its client
  // runtime and every Next.js link degrades into a slow full-page navigation.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  // Keep localhost captures and interaction reviews focused on the product UI.
  devIndicators: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
  async redirects() {
    /*
     * /about and /philosophy are retired. They duplicated each other and the
     * new pages (both preached "architecture before technology" and "control is
     * the outcome"), they were unreachable from the navigation, and /about was
     * still publishing the "20 implementations" claim the redesign purged.
     * Their subject matter now lives on the experience page.
     *
     * Permanent so search engines transfer the equity rather than holding two
     * dead URLs that were in the sitemap for months.
     */
    return [
      {
        source: '/about',
        destination: '/institutional-experience',
        permanent: true,
      },
      {
        source: '/philosophy',
        destination: '/institutional-experience',
        permanent: true,
      },
    ]
  },
})
