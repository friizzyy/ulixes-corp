// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type SentEmail = {
  from: string
  to: string
  replyTo?: string
  subject: string
  html: string
}

type SendResult = {
  data: { id: string } | null
  error: { message: string } | null
}

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn<(email: SentEmail) => Promise<SendResult>>((email) =>
    Promise.resolve({ data: { id: `email-id:${email.to}` }, error: null }),
  ),
}))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock }
  },
}))

import { POST } from './route'

/* Each call comes from a fresh address unless a test says otherwise, so the
   rate limit only bites where it is under test. */
let addressCounter = 0

function submit(body: unknown, headers: Record<string, string> = {}) {
  addressCounter += 1
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': `203.0.113.${addressCounter}`,
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )
}

function captchaReply(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
  })
}

const inquiry = {
  name: 'Ada Lovelace',
  email: 'ada@institution.com',
  company: 'Institution',
  message: 'Platform migration cutover is scheduled and the first close worries me.',
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockClear()
    vi.stubEnv('RECAPTCHA_SECRET_KEY', '')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('sends the notification and confirmation with a generic success response', async () => {
    const response = await submit(inquiry)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(2)
    const [admin, confirmation] = sendMock.mock.calls.map((call) => call[0])
    expect(admin.to).toBe('admin@ulixescorp.com')
    expect(admin.replyTo).toBe(inquiry.email)
    expect(admin.subject).toBe('New inquiry from Ada Lovelace - Ulixes Corporation')
    expect(admin.html).toContain(inquiry.message)
    expect(confirmation.to).toBe(inquiry.email)
  })

  it('returns an error instead of a false success when the admin notification is rejected', async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: 'Sender is not verified' },
    })

    const response = await submit(inquiry)

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to send message' })
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it('reports success when the inquiry arrives but its confirmation is rejected', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    sendMock
      .mockResolvedValueOnce({
        data: { id: 'admin-email-id' },
        error: null,
      })
      .mockResolvedValueOnce({
        data: null,
        error: { message: 'Recipient is not verified' },
      })

    const response = await submit(inquiry)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(2)
    expect(consoleError).toHaveBeenCalledWith(
      'Contact confirmation email failed',
      { message: 'Recipient is not verified' },
    )
  })

  it('reports success when the inquiry arrives but confirmation delivery throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const confirmationFailure = new Error('Confirmation transport unavailable')
    sendMock
      .mockResolvedValueOnce({
        data: { id: 'admin-email-id' },
        error: null,
      })
      .mockRejectedValueOnce(confirmationFailure)

    const response = await submit(inquiry)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(2)
    expect(consoleError).toHaveBeenCalledWith(
      'Contact confirmation email failed',
      confirmationFailure,
    )
  })

  it('fails closed when CAPTCHA is not configured in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', '')

    const response = await submit(inquiry)

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'Contact form protection is unavailable',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('does not spend the rate limit when configured CAPTCHA verification fails', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    const fetchMock = vi.fn(async () => captchaReply({
      success: false,
      'error-codes': ['invalid-input-response'],
    }))
    vi.stubGlobal('fetch', fetchMock)
    const headers = { 'x-vercel-forwarded-for': '192.0.2.40' }
    const protectedInquiry = { ...inquiry, recaptchaToken: 'test-token' }

    for (let attempt = 0; attempt < 6; attempt += 1) {
      expect((await submit(protectedInquiry, headers)).status).toBe(403)
    }

    fetchMock.mockImplementation(async () => captchaReply({
      success: true,
      score: 0.9,
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'www.ulixescorp.com',
    }))

    expect((await submit(protectedInquiry, headers)).status).toBe(200)
  })

  it('rejects a successful CAPTCHA issued for a different action', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: true,
      score: 0.9,
      action: 'newsletter_signup',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'www.ulixescorp.com',
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: 'reCAPTCHA verification failed',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('rejects a CAPTCHA issued for an unexpected hostname in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: true,
      score: 0.9,
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'attacker.example',
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: 'reCAPTCHA verification failed',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('rejects a CAPTCHA score below 0.5 outside production too', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: true,
      score: 0.49,
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'localhost',
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(403)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('requires CAPTCHA success to be a boolean true value', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: 'true',
      score: 0.9,
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'www.ulixescorp.com',
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(403)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('requires the CAPTCHA score to be numeric', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: true,
      score: '0.9',
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'www.ulixescorp.com',
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(403)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it.each([
    'www.ulixescorp.com',
    'ulixescorp.com',
    'ulixes-corp.vercel.app',
  ])('accepts a production CAPTCHA issued for %s', async (hostname) => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: true,
      score: 0.5,
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname,
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(200)
  })

  it('does not constrain the CAPTCHA hostname outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn(async () => captchaReply({
      success: true,
      score: 0.9,
      action: 'contact_form',
      challenge_ts: '2026-09-03T20:00:00Z',
      hostname: 'preview.internal',
    })))

    const response = await submit({ ...inquiry, recaptchaToken: 'test-token' })

    expect(response.status).toBe(200)
  })

  it('escapes every submitted value before it reaches the notification email', async () => {
    await submit({
      ...inquiry,
      name: 'Ada <script>alert(1)</script>',
      company: '"Institution" & Co',
      message: '<img src=x onerror=alert(1)>',
    })

    const admin = sendMock.mock.calls[0][0]
    expect(admin.html).not.toContain('<script>')
    expect(admin.html).toContain('Ada &lt;script&gt;alert(1)&lt;/script&gt;')
    expect(admin.html).toContain('&quot;Institution&quot; &amp; Co')
    expect(admin.html).not.toContain('<img src=x')
    expect(admin.html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('confirms with a fixed note that repeats nothing the visitor typed', async () => {
    await submit({ ...inquiry, message: 'CONFIDENTIAL BODY TEXT' })

    const confirmation = sendMock.mock.calls[1][0]
    expect(confirmation.subject).toBe('Thank you for contacting Ulixes Corporation')
    expect(confirmation.html).not.toContain('CONFIDENTIAL BODY TEXT')
    expect(confirmation.html).not.toContain('Ada Lovelace')
    expect(confirmation.html).not.toContain(inquiry.company)
    expect(confirmation.html).toContain('Ulysses Williams')
  })

  it('refuses a malformed address, an over-length field and a non-string value', async () => {
    const badEmail = await submit({ ...inquiry, email: 'not-an-email' })
    expect(badEmail.status).toBe(400)
    await expect(badEmail.json()).resolves.toEqual({ error: 'Please enter a valid email' })

    const longMessage = await submit({ ...inquiry, message: 'x'.repeat(4001) })
    expect(longMessage.status).toBe(400)
    await expect(longMessage.json()).resolves.toEqual({
      error: 'Message must be 4000 characters or fewer',
    })

    const longName = await submit({ ...inquiry, name: 'x'.repeat(121) })
    expect(longName.status).toBe(400)

    const longEmail = await submit({ ...inquiry, email: `${'x'.repeat(250)}@a.io` })
    expect(longEmail.status).toBe(400)

    const wrongType = await submit({ ...inquiry, name: { $gt: '' } })
    expect(wrongType.status).toBe(400)

    const notJson = await submit('not json')
    expect(notJson.status).toBe(400)

    expect(sendMock).not.toHaveBeenCalled()
  })

  it('keeps the existing required-field response', async () => {
    const response = await submit({ name: '', email: '', message: '' })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Missing required fields' })
  })

  it('limits one address to five submissions in ten minutes', async () => {
    const headers = { 'x-forwarded-for': '198.51.100.7, 10.0.0.1' }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await submit(inquiry, headers)).status).toBe(200)
    }

    const blocked = await submit(inquiry, headers)
    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0)
    await expect(blocked.json()).resolves.toEqual({
      error: 'Too many submissions from this address. Please try again later.',
    })
    expect(sendMock).toHaveBeenCalledTimes(10)

    // Another address is unaffected.
    expect((await submit(inquiry)).status).toBe(200)
  })

  it('prefers Vercel\'s platform address over forwarded client input', async () => {
    const forwarded = '198.51.100.88'

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await submit(inquiry, {
        'x-vercel-forwarded-for': '192.0.2.10',
        'x-forwarded-for': forwarded,
      })
      expect(response.status).toBe(200)
    }

    const differentPlatformAddress = await submit(inquiry, {
      'x-vercel-forwarded-for': '192.0.2.11',
      'x-forwarded-for': forwarded,
    })
    expect(differentPlatformAddress.status).toBe(200)
  })

  it('bounds active address buckets and evicts the oldest at capacity', async () => {
    vi.useFakeTimers()
    const baseTime = new Date('2035-01-01T00:00:00Z').getTime()
    const oldest = { 'x-vercel-forwarded-for': '192.0.2.200' }
    const nextOldest = { 'x-vercel-forwarded-for': '192.0.2.201' }

    vi.setSystemTime(baseTime)
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await submit(inquiry, oldest)).status).toBe(200)
    }

    vi.setSystemTime(baseTime + 1)
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await submit(inquiry, nextOldest)).status).toBe(200)
    }

    vi.setSystemTime(baseTime + 2)
    for (let index = 0; index < 998; index += 1) {
      const address = `198.18.${Math.floor(index / 256)}.${index % 256}`
      expect((await submit(inquiry, { 'x-vercel-forwarded-for': address })).status).toBe(200)
    }

    vi.setSystemTime(baseTime + 3)
    expect((await submit(inquiry, {
      'x-vercel-forwarded-for': '192.0.2.202',
    })).status).toBe(200)

    expect((await submit(inquiry, nextOldest)).status).toBe(429)
    expect((await submit(inquiry, oldest)).status).toBe(200)
  })
})
