import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Header = { key: string; value: string }
type VercelConfig = { headers: Array<{ source: string; headers: Header[] }> }

const config = JSON.parse(
  readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'),
) as VercelConfig

const allRoutes = config.headers.find((rule) => rule.source === '/(.*)')
const headers = new Map(allRoutes?.headers.map((header) => [header.key, header.value]))

describe('Vercel publication headers', () => {
  it('sets a CSP that permits Next.js assets and Google reCAPTCHA without allowing plugins', () => {
    expect(headers.get('Content-Security-Policy')).toBe(
      "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google.com https://www.gstatic.com; font-src 'self' data:; connect-src 'self' https://www.google.com https://www.gstatic.com; frame-src https://www.google.com; media-src 'self'; upgrade-insecure-requests",
    )
  })

  it('disables browser capabilities the site does not use', () => {
    expect(headers.get('Permissions-Policy')).toBe(
      'accelerometer=(), autoplay=(self), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), web-share=(), xr-spatial-tracking=()',
    )
  })

  it('preserves the existing baseline protections and disables legacy XSS filtering', () => {
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(headers.get('X-Frame-Options')).toBe('DENY')
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(headers.get('X-XSS-Protection')).toBe('0')
  })
})
