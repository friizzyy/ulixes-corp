'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { HomeHeroPlayback } from './home-hero-playback'
import styles from './homepage.module.css'

const posterSrc = '/media/home/ulixes-san-francisco-blue-hour.webp'
const ambientVideoQuery = '(min-width: 768px)'

type HomeHeroMediaProps = {
  imageAlt: string
  videoSrc?: string
}

export function HomeHeroMedia({ imageAlt, videoSrc }: HomeHeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const wasActive = useRef(false)
  /* Set once the visitor pauses the loop themselves. The viewport observer
     then leaves it alone until they play it again. */
  const manualPause = useRef(false)
  /*
   * Read after mount, so the server and the first client render agree, and
   * null until then. The stylesheet hides the video under reduced motion, but
   * display: none does not stop a browser fetching and decoding an autoplaying
   * source: the capture recorded it still playing. So under reduced motion
   * the source leaves the tree, the element is told to load nothing, and the
   * poster, which is a separate image, is all that remains.
   */
  const reduced = usePrefersReducedMotion() === true
  /* A reduced-motion visitor who chose to run the loop anyway. */
  const [optedIn, setOptedIn] = useState(false)
  /*
   * Start with the still image on the server. After hydration, larger screens
   * may opt into the ambient loop automatically; narrow screens never fetch
   * it unless the visitor explicitly presses play.
   */
  const [autoPlayEligible, setAutoPlayEligible] = useState(false)
  const [paused, setPaused] = useState(true)
  const autoPlay = autoPlayEligible && !reduced
  /* Whether the source belongs in the tree at all. */
  const active = autoPlay || optedIn

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(ambientVideoQuery)
    const update = () => setAutoPlayEligible(query.matches)
    update()

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', update)
      return () => query.removeEventListener('change', update)
    }

    query.addListener(update)
    return () => query.removeListener(update)
  }, [])

  const attemptPlay = useCallback((video: HTMLVideoElement) => {
    /* play() returns a promise in browsers, nothing in the test DOM, hence
       the guard. A rejection means the browser refused (an autoplay policy,
       Low Power Mode) or a pause interrupted it; either way the loop is not
       running and the control should say play. */
    const outcome = video.play() as Promise<void> | undefined
    if (outcome && typeof outcome.catch === 'function') {
      outcome.catch(() => setPaused(true))
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onPlay = () => setPaused(false)
    const onPause = () => setPaused(true)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!active) {
      /* Only abort a resource that was previously active. On narrow and
         reduced-motion first loads, the source never enters the tree. */
      if (wasActive.current) {
        video.pause()
        video.load()
      }
      wasActive.current = false
      setPaused(true)
      return
    }
    wasActive.current = true
    /* The source has just joined the tree; load() picks it up before play. */
    video.load()
    attemptPlay(video)
  }, [active, attemptPlay])

  useEffect(() => {
    const video = videoRef.current
    const frame = frameRef.current
    if (
      !video ||
      !frame ||
      !active ||
      typeof IntersectionObserver !== 'function'
    ) {
      return
    }
    /* Nothing plays off screen. The loop resumes when the hero returns unless
       the visitor paused it, and the first callback doubles as the autoplay
       check: a refused play() lands the control on play. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (!entry.isIntersecting) {
          if (!video.paused) video.pause()
          return
        }
        if (!manualPause.current && video.paused) attemptPlay(video)
      },
      { threshold: 0 },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [active, attemptPlay])

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (paused) {
      manualPause.current = false
      setPaused(false)
      if (!active) {
        /* Reduced motion: the source joins the tree on this render and the
           effect above starts it. */
        setOptedIn(true)
        return
      }
      attemptPlay(video)
      return
    }
    manualPause.current = true
    setPaused(true)
    video.pause()
  }, [active, attemptPlay, paused])

  return (
    <>
      <div ref={frameRef} className={styles.heroMedia} data-video-ready="true">
        <Image
          src={posterSrc}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 767px) 100vw, (max-width: 1599px) 76vw, 1090px"
          className={styles.heroPoster}
        />
        {videoSrc ? (
          <video
            ref={videoRef}
            className={styles.heroVideo}
            autoPlay={autoPlay}
            muted
            loop
            playsInline
            preload={active ? 'metadata' : 'none'}
            aria-hidden="true"
            tabIndex={-1}
            data-motion={
              reduced ? (optedIn ? 'opted-in' : 'reduced') : undefined
            }
          >
            {active ? <source src={videoSrc} type="video/mp4" /> : null}
          </video>
        ) : null}
      </div>
      <HomeHeroPlayback paused={paused} onToggle={videoSrc ? toggle : undefined} />
    </>
  )
}
