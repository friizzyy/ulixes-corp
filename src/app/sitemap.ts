import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/content'

/*
 * Kept in step with the routes that actually exist. This previously advertised
 * /work, which was never built and could not be: the verified-claims guardrails
 * forbid named clients, testimonials, and invented metrics, so there is no
 * compliant way to fill a case-studies page. It also omitted
 * /institutional-experience entirely, and listed /about and /philosophy, which
 * are now retired and permanently redirected.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  return [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${baseUrl}/services`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nasdaq-calypso`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/institutional-experience`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
