/*
 * Shared pieces of the redesign. Page code imports from '@/components/site'
 * and never re-styles these. Global tokens and primitive classes live in
 * src/styles/site.css.
 */
export { Brand, BrandMark } from './brand'
export type { BrandProps } from './brand'
export { Eyebrow } from './eyebrow'
export type { EyebrowProps } from './eyebrow'
export { SlabButton } from './slab-button'
export type { SlabButtonProps, SlabButtonVariant, SlabArrow } from './slab-button'
export { TextLink } from './text-link'
export type { TextLinkProps } from './text-link'
export { CtaCard } from './cta-card'
export type { CtaCardProps } from './cta-card'
export { Section } from './section'
export { glideTo, GLIDE_DELAY_MS } from './glide'
export type { SectionProps } from './section'
export { SiteHeader } from './site-header'
export { PhoneDock } from './phone-dock'
export { SiteFooter, footerSignposts } from './site-footer'
export {
  CONTACT_HREF,
  headerRoutes,
  dockRoutes,
  heroBrandRoutes,
  isActiveRoute,
} from './routes'
export type { SiteRoute } from './routes'
