import { Variants } from 'framer-motion'

// Shared easing curves
export const easing = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
} as const

// Fade up animation - primary reveal
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
}

// Fade down animation - for nav elements
export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
}

// Fade in animation - simple opacity
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
}

// Scale up animation - for cards and interactive elements
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
}

// Staggered children container
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Fast stagger for dense grids
export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// Variable stagger for 2-column grids (wave effect)
// Top-left: 0ms, Top-right: 50ms, Bottom-left: 100ms, Bottom-right: 150ms
export const staggerContainerGrid: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Grid item with position-aware delay
export const fadeUpGrid: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (index: number) => {
    // Calculate row and column for 2-column grid
    const row = Math.floor(index / 2)
    const col = index % 2
    // Wave effect: items further right and down get more delay
    const delay = (row * 0.05) + (col * 0.03)
    return {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easing.smooth,
        delay,
      },
    }
  },
}

// Terminal line animation with human typing cadence
export const terminalLine: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: 0.8 + i * 0.4,
      duration: 0.3,
    },
  }),
}

// Terminal line with variable timing based on line type
export const terminalLineTyping: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (params: { index: number; type: string }) => {
    const { index, type } = params
    // Different delays based on line type
    const baseDelay = 0.6
    const typeDelays: Record<string, number> = {
      prompt: 0.3,  // Commands appear fast (typing)
      output: 0.5,  // Output takes a moment to process
      success: 0.8, // Success message delayed for emphasis
    }
    const typeDelay = typeDelays[type] || 0.4
    const cumulativeDelay = baseDelay + (index * typeDelay)

    return {
      opacity: 1,
      transition: {
        delay: cumulativeDelay,
        duration: type === 'prompt' ? 0.2 : 0.3,
        ease: easing.smooth,
      },
    }
  },
}

// Card hover animation - border and shadow only, no transform
export const cardHover = {
  rest: {
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
  hover: {
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
}

// Button hover animation - subtle, no vertical movement
export const buttonHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1,
  },
  tap: {
    scale: 0.98,
  },
}

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
}

// Viewport settings for scroll animations
export const viewportOnce = {
  once: true,
  margin: '-50px',
}

export const viewportRepeating = {
  once: false,
  margin: '-100px',
}

// Reduced motion utilities
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
}

// Helper to check for reduced motion preference
export const getReducedMotionVariants = (
  normalVariants: Variants,
  prefersReducedMotion: boolean
): Variants => {
  return prefersReducedMotion ? reducedMotionVariants : normalVariants
}

// Parallax up animation - slower, smoother reveal
export const parallaxUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Scale in animation - for featured elements
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Hover lift animation - for cards
export const hoverLift: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 0 0 rgba(139, 92, 246, 0)',
  },
  hover: {
    y: -4,
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)',
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
}
