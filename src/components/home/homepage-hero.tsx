'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { homepageContent } from '@/lib/homepage-content'
import styles from './homepage.module.css'

type VideoReadiness = 'loading' | 'ready' | 'failed'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const instantScrollFocusDelayMs = 1
const smoothScrollFocusSafetyMs = 2000

export function HomepageHero() {
  const [videoReadiness, setVideoReadiness] = useState<VideoReadiness>('loading')
  const videoFailedRef = useRef(false)
  const scrollFocusCleanupRef = useRef<null | (() => void)>(null)

  useEffect(() => () => {
    scrollFocusCleanupRef.current?.()
  }, [])

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
    const targetHeading = heading

    scrollFocusCleanupRef.current?.()

    let settled = false
    let fallbackId: number | undefined
    let listeningForScrollEnd = false

    const removeScheduledFocus = () => {
      if (listeningForScrollEnd) {
        window.removeEventListener('scrollend', finishFocus)
      }
      if (fallbackId !== undefined) {
        window.clearTimeout(fallbackId)
      }
    }

    const cancelFocus = () => {
      if (settled) return
      settled = true
      removeScheduledFocus()
      if (scrollFocusCleanupRef.current === cancelFocus) {
        scrollFocusCleanupRef.current = null
      }
    }

    function finishFocus() {
      if (settled) return
      settled = true
      removeScheduledFocus()
      if (scrollFocusCleanupRef.current === cancelFocus) {
        scrollFocusCleanupRef.current = null
      }
      if (!targetHeading.isConnected) return

      if (!targetHeading.hasAttribute('tabindex')) {
        targetHeading.setAttribute('tabindex', '-1')
      }
      targetHeading.focus({ preventScroll: true })
    }

    const behavior = window.matchMedia(reducedMotionQuery).matches ? 'auto' : 'smooth'
    const shouldWaitForScrollEnd = behavior === 'smooth' && 'onscrollend' in window

    if (shouldWaitForScrollEnd) {
      listeningForScrollEnd = true
      window.addEventListener('scrollend', finishFocus, { once: true })
    }

    fallbackId = window.setTimeout(
      finishFocus,
      behavior === 'auto' ? instantScrollFocusDelayMs : smoothScrollFocusSafetyMs,
    )
    scrollFocusCleanupRef.current = cancelFocus

    target.scrollIntoView({ behavior, block: 'start' })
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
      <div className={styles.mobileScrim} aria-hidden="true" />
      <div className={styles.navigationScrim} aria-hidden="true" />

      <div
        className={styles.heroSignalExit}
        data-hero-signal-exit
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            className={styles.heroSignalExitRoute}
            d="M 920 0 C 920 42, 920 78, 920 120"
            pathLength="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

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
