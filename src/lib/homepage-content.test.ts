import { expertiseAreas } from './expertise-content'
import { describe, expect, it } from 'vitest'
import {
  authorityItems,
  editorialNavigation,
  editorialRoutes,
  homepageContent,
  isEditorialRoute,
  serviceModules,
} from './homepage-content'

describe('homepage content contract', () => {
  it('publishes the selected concise homepage structure', () => {
    expect(homepageContent.hero.headline).toBe(
      'Capital markets transformation and architecture.',
    )
    expect(homepageContent.hero.headlineLines).toEqual([
      'Capital markets',
      'transformation & architecture.',
    ])
    expect(homepageContent.hero.primaryCta).toBe('Discuss a mandate')
    expect(authorityItems).toHaveLength(4)
    expect(authorityItems.map((item) => item.context)).toEqual([
      'Continuity',
      'Lifecycle',
      'Reach',
      'Access',
    ])
    expect(serviceModules.map((service) => service.id)).toEqual([
      'architecture',
      'accounting',
      'trading',
      'assurance',
    ])
    expect(serviceModules.every((service) => service.scope.length > 0)).toBe(
      true,
    )
    /*
     * The Approach anchor was dropped because it landed on the practitioner
     * bio. Contact is absent by design: the persistent "Discuss a mandate"
     * action owns it.
     *
     * Nasdaq Calypso is pinned last rather than second. The reposition exists
     * so the practice stops reading as a Calypso implementation shop, and
     * second position in the navigation is the first thing that would undo it.
     */
    expect(editorialNavigation.map((item) => item.href)).toEqual([
      '/services',
      '/institutional-experience',
      '/nasdaq-calypso',
    ])
    expect(editorialRoutes).toEqual([
      '/',
      '/services',
      '/nasdaq-calypso',
      '/institutional-experience',
      '/contact',
      '/privacy',
      '/terms',
    ])
    /*
     * Informational only. Privacy and terms were the last routes on the
     * retired interior theme, so there is no pathname left, known or not,
     * that renders anything but the editorial chrome.
     */
    for (const pathname of [
      ...editorialRoutes,
      '/anything',
      '/nasdaq-calypso/hero-concepts',
      null,
      undefined,
    ]) {
      expect(isEditorialRoute(pathname)).toBe(true)
    }
    expect(homepageContent.credibility.imageAlt).toContain('Salesforce Tower')
    expect(homepageContent.credibility.linkedinUrl).toBe(
      'https://www.linkedin.com/in/ulysses-williams-2379634/',
    )
    // The plate carries only what it uniquely owns. The region list lives in
    // the hero authority dock and the front-to-back line in the checkpoints,
    // so restating either one here would be the third printing of the fact.
    expect(homepageContent.credibility.footprint).toEqual({
      label: 'Delivery footprint',
      value: 'San Francisco base',
    })
    expect(homepageContent.credibility.checkpoints).toEqual([
      'Calypso experience since 2004',
      'Front-, middle-, and back-office perspective',
    ])
    expect(homepageContent.contact.email).toBe('admin@ulixescorp.com')
  })

  it('keeps Ulysses Williams facts grounded and complete', () => {
    const published = JSON.stringify({
      homepageContent,
      authorityItems,
    })
    expect(published).toContain('Ulysses Williams')
    expect(published).toContain('2004')

    for (const region of ['North America', 'Europe', 'APAC', 'Latin America']) {
      expect(published).toContain(region)
    }
  })

  it('keeps published homepage copy free of em dashes', () => {
    const published = JSON.stringify({
      homepageContent,
      authorityItems,
      serviceModules,
    })

    expect(published).not.toContain('—')
  })

  it('excludes rejected motifs and unsupported claims', () => {
    const published = JSON.stringify({
      homepageContent,
      serviceModules,
    }).toLowerCase()

    for (const forbidden of [
      '20 implementations',
      'zero disruption',
      'real-time compliance',
      'ai-driven',
      'terminal',
      'dashboard',
      'award',
      'microsoft',
      'amazon',
      'google',
      'oracle',
      'regionalmarkers',
    ]) {
      expect(published).not.toContain(forbidden)
    }
  })

  it('sells the same four capabilities the services page carries', () => {
    expect(serviceModules.map((service) => service.title)).toEqual(
      expertiseAreas.map((area) => area.title),
    )
    expect(serviceModules.map((service) => service.scope)).toEqual(
      expertiseAreas.map((area) => area.scope),
    )
    expect(serviceModules.map((service) => service.href)).toEqual(
      expertiseAreas.map((area) => `/services#${area.id}`),
    )
  })
})
