import { HomeCalypso } from './home-calypso'
import { HomeHero } from './home-hero'
import { HomePractitioner } from './home-practitioner'
import { HomeServices } from './home-services'

/*
 * The home page (docs/build-spec/home). The layout renders the header, the
 * phone dock and the footer (05-close); home has no closing CtaCard.
 */
export function Homepage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeCalypso />
      <HomePractitioner />
    </>
  )
}
