'use client'

import styles from './homepage.module.css'

type HomeHeroPlaybackProps = {
  paused: boolean
  /* Absent when the hero has a poster only, so the mark renders alone. */
  onToggle?: () => void
}

/*
 * The WCAG 2.2.2 control for the hero loop. It shares one absolutely
 * positioned row with the San Francisco location mark so the pair moves
 * together at every viewport instead of each carrying its own coordinates.
 * The mark is decorative; the button is not.
 *
 * The accessible action follows the actual state. This matters on narrow or
 * reduced-motion screens, where the still image is the initial experience and
 * the visitor may explicitly opt into the loop.
 */
export function HomeHeroPlayback({ paused, onToggle }: HomeHeroPlaybackProps) {
  return (
    <div className={styles.heroControls}>
      <span className={styles.locationMark} aria-hidden="true">
        <span className={styles.locationDot} />
        <span>San Francisco</span>
      </span>
      {onToggle ? (
        <button
          type="button"
          className={styles.playbackControl}
          aria-label={paused ? 'Play background video' : 'Pause background video'}
          data-playback={paused ? 'paused' : 'playing'}
          onClick={onToggle}
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            aria-hidden="true"
            focusable="false"
          >
            {paused ? (
              <path d="M5.6 3.2v9.6L13 8z" />
            ) : (
              <>
                <rect x="3.6" y="3" width="3.2" height="10" rx="0.6" />
                <rect x="9.2" y="3" width="3.2" height="10" rx="0.6" />
              </>
            )}
          </svg>
        </button>
      ) : null}
    </div>
  )
}
