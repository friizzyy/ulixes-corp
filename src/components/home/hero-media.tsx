'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './hero.module.css'

/* The loop only plays by itself where the desktop composition shows it. */
const ambientVideoQuery = '(min-width: 768px)'

interface HeroMediaProps {
  posterSrc: string
  imageAlt: string
  videoSrc: string
}

/*
 * The San Francisco loop behind the hero.
 *
 * The poster is a separate, prioritised image, so the first paint never waits
 * on video. The source only joins the tree after hydration, and only where it
 * is wanted: on screens 768px and wider without reduced motion. Phones keep the
 * still image (the spec's image hero) and never fetch the file. Under reduced
 * motion the visitor can still opt in with the control. Nothing plays off
 * screen, and a visitor's own pause is respected when the hero comes back.
 */
export function HeroMedia({ posterSrc, imageAlt, videoSrc }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const wasActive = useRef(false)
  const manualPause = useRef(false)
  const reduced = usePrefersReducedMotion() === true
  const [optedIn, setOptedIn] = useState(false)
  const [eligible, setEligible] = useState(false)
  const [paused, setPaused] = useState(true)
  const [ready, setReady] = useState(false)
  const autoPlay = eligible && !reduced
  const active = autoPlay || optedIn

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(ambientVideoQuery)
    const update = () => setEligible(query.matches)
    update()
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', update)
      return () => query.removeEventListener('change', update)
    }
    query.addListener(update)
    return () => query.removeListener(update)
  }, [])

  const attemptPlay = useCallback((video: HTMLVideoElement) => {
    /* A refused play() (autoplay policy, Low Power Mode) leaves the control on play. */
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
    const onPlaying = () => setReady(true)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('playing', onPlaying)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('playing', onPlaying)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!active) {
      if (wasActive.current) {
        video.pause()
        video.load()
      }
      wasActive.current = false
      setPaused(true)
      setReady(false)
      return
    }
    wasActive.current = true
    video.load()
    attemptPlay(video)
  }, [active, attemptPlay])

  useEffect(() => {
    const video = videoRef.current
    const frame = frameRef.current
    if (!video || !frame || !active || typeof IntersectionObserver !== 'function') return
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
      <div ref={frameRef} className={styles.frame}>
        <Image
          src={posterSrc}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 767px) 100vw, 66vw"
          className={styles.poster}
        />
        <video
          ref={videoRef}
          className={styles.video}
          data-ready={ready ? 'true' : 'false'}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          preload={active ? 'auto' : 'none'}
          aria-hidden="true"
          tabIndex={-1}
        >
          {active ? <source src={videoSrc} type="video/mp4" /> : null}
        </video>
      </div>
      <button
        type="button"
        className={styles.playback}
        aria-label={paused ? 'Play background video' : 'Pause background video'}
        data-playback={paused ? 'paused' : 'playing'}
        onClick={toggle}
      >
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
          {paused ? (
            <path d="M5 3v10l8.5-5z" fill="currentColor" />
          ) : (
            <>
              <rect x="3.5" y="3" width="3" height="10" fill="currentColor" />
              <rect x="9.5" y="3" width="3" height="10" fill="currentColor" />
            </>
          )}
        </svg>
      </button>
    </>
  )
}
