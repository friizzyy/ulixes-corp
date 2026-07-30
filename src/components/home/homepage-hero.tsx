'use client'

import Link from 'next/link'
import { useRef, useState, type MouseEvent } from 'react'
import { homepageContent } from '@/lib/homepage-content'
import styles from './homepage.module.css'

type VideoReadiness = 'loading' | 'ready' | 'failed'

export function HomepageHero() {
  const [videoReadiness, setVideoReadiness] = useState<VideoReadiness>('loading')
  const videoFailedRef = useRef(false)

  const handleVideoCanPlay = () => {
    if (!videoFailedRef.current) {
      setVideoReadiness('ready')
    }
  }

  const handleVideoError = () => {
    videoFailedRef.current = true
    setVideoReadiness('failed')
  }

  const handleCapabilitiesClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(event.currentTarget.hash.slice(1))
    const heading = target?.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6')

    if (!target || !heading) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1')
    }
    heading.focus({ preventScroll: true })
  }

  return (
    <section
      id="homepage-hero"
      aria-labelledby="homepage-hero-title"
      className={styles.hero}
    >
      <div className={styles.media} aria-hidden="true">
        <picture className={styles.poster}>
          <source
            media="(max-width: 767px)"
            srcSet="/media/hero/ulixes-signal-mobile-poster.avif"
            width="1080"
            height="1920"
          />
          <img
            className={styles.mediaSurface}
            src="/media/hero/ulixes-signal-desktop-poster.avif"
            width="2560"
            height="1440"
            fetchPriority="high"
            alt=""
            aria-hidden="true"
          />
        </picture>

        <video
          className={`${styles.mediaSurface} ${styles.video} ${
            videoReadiness === 'ready' ? styles.videoReady : ''
          }`}
          data-readiness={videoReadiness}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
        >
          <source
            media="(max-width: 767px)"
            src="/media/hero/ulixes-signal-mobile-1080.webm"
            type="video/webm"
          />
          <source
            media="(max-width: 767px)"
            src="/media/hero/ulixes-signal-mobile-1080.mp4"
            type="video/mp4"
          />
          <source
            src="/media/hero/ulixes-signal-desktop-1440.webm"
            type="video/webm"
          />
          <source
            src="/media/hero/ulixes-signal-desktop-1080.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className={styles.copyScrim} aria-hidden="true" />
      <div className={styles.navigationScrim} aria-hidden="true" />

      <div className={styles.layout}>
        <div className={styles.copy}>
          <h1 id="homepage-hero-title" className={styles.headline}>
            {homepageContent.hero.headline}
          </h1>
          <p className={styles.body}>{homepageContent.hero.body}</p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.primaryAction}>
              {homepageContent.hero.primaryCta}
            </Link>
            <a
              href="#capabilities"
              className={styles.secondaryAction}
              onClick={handleCapabilitiesClick}
            >
              {homepageContent.hero.secondaryCta}
            </a>
          </div>
        </div>

        <p className={styles.proof}>{homepageContent.hero.proof}</p>
      </div>
    </section>
  )
}
