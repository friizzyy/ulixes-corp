import { createRequire } from 'node:module'
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const createNextConfig = require('../../next.config.js')

describe('Next.js build output', () => {
  it('keeps the development server output separate from production builds', () => {
    expect(createNextConfig(PHASE_DEVELOPMENT_SERVER).distDir).toBe('.next-dev')
    expect(createNextConfig(PHASE_PRODUCTION_BUILD).distDir).toBe('.next')
  })

  it('keeps the local preview free of framework overlay chrome', () => {
    expect(createNextConfig(PHASE_DEVELOPMENT_SERVER).devIndicators).toBe(false)
  })
})
