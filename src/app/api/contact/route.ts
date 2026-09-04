import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { contactPageContent } from '@/lib/contact-content'
import { siteConfig } from '@/lib/content'

export const dynamic = 'force-dynamic'

let resend: Resend

const productionRecaptchaHostnames = new Set([
  'www.ulixescorp.com',
  'ulixescorp.com',
  'ulixes-corp.vercel.app',
])

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) return true // Skip verification if not configured

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }).toString(),
    })
    const data = await response.json()
    const validHostname = process.env.NODE_ENV !== 'production'
      || productionRecaptchaHostnames.has(data.hostname)
    return data.success === true
      && typeof data.score === 'number'
      && data.score >= 0.5
      && data.action === 'contact_form'
      && validHostname
  } catch {
    return false
  }
}

/*
 * Field limits. The form is a short inquiry, not a document: anything past
 * these is either an accident or an attempt to use the notification as a
 * relay, and both get a 400 rather than a truncated send.
 */
const limits = {
  name: 120,
  email: 254,
  company: 160,
  message: 4000,
} as const

type Field = keyof typeof limits

const labels: Record<Field, string> = {
  name: 'Name',
  email: 'Email',
  company: 'Institution',
  message: 'Message',
}

/* The same shape the form checks client side, so an address that passed there
   is not refused here for a different idea of what one looks like. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*
 * Every submitted value lands inside HTML, so the five characters that can
 * open a tag or close an attribute are replaced. The message keeps its line
 * breaks through white-space: pre-wrap on the paragraph that carries it.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* Header values stay on one line whatever the field carried. */
function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

/*
 * A small in-memory limit: five submissions per address per ten minutes. It
 * lives in the process, so on serverless hosting it is per instance and
 * resets on a cold start, which is still enough to stop one client draining
 * the email quota in a loop. Anything stricter belongs in front of the app.
 */
const rateWindowMs = 10 * 60 * 1000
const rateLimit = 5
const maxRateLimitAddresses = 1000
const submissions = new Map<string, number[]>()

function clientAddress(request: Request): string {
  /* Vercel supplies this as the same spoof-resistant client value it writes
     to X-Forwarded-For, so prefer the platform header on this deployment. */
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for')
  const vercelAddress = vercelForwarded?.split(',')[0]?.trim()
  if (vercelAddress) return vercelAddress

  const forwarded = request.headers.get('x-forwarded-for')
  const forwardedAddress = forwarded?.split(',')[0]?.trim()
  if (forwardedAddress) return forwardedAddress

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  return 'unknown'
}

function pruneExpiredBuckets(now: number): void {
  submissions.forEach((stamps, address) => {
    const recent = stamps.filter((at) => now - at < rateWindowMs)
    if (recent.length === 0) {
      submissions.delete(address)
    } else if (recent.length !== stamps.length) {
      submissions.set(address, recent)
    }
  })
}

function evictOldestBucket(): void {
  let oldestAddress: string | undefined
  let oldestAttempt = Number.POSITIVE_INFINITY

  submissions.forEach((stamps, address) => {
    const latestAttempt = stamps[stamps.length - 1]
    if (latestAttempt < oldestAttempt) {
      oldestAddress = address
      oldestAttempt = latestAttempt
    }
  })

  if (oldestAddress !== undefined) submissions.delete(oldestAddress)
}

/* Records the attempt and returns the seconds to wait when the address is
   over its limit, else 0. */
function secondsUntilAllowed(address: string, now: number): number {
  pruneExpiredBuckets(now)

  const existing = submissions.get(address)
  if (!existing && submissions.size >= maxRateLimitAddresses) {
    /* Equal timestamps retain Map insertion order, making ties deterministic. */
    evictOldestBucket()
  }

  const recent = existing ?? []

  if (recent.length >= rateLimit) {
    return Math.max(1, Math.ceil((recent[0] + rateWindowMs - now) / 1000))
  }

  recent.push(now)
  submissions.set(address, recent)

  return 0
}

/* Absent fields read as empty; anything that is not a string is refused. */
function readField(source: Record<string, unknown>, field: Field): string | null {
  const value = source[field]
  if (value === undefined || value === null) return ''
  return typeof value === 'string' ? value.trim() : null
}

/*
 * A fixed note that repeats nothing the visitor typed. The earlier version
 * echoed the whole submission back, which turned the form into a way of
 * delivering any text to any address that never asked for it.
 */
const confirmationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0b;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0b;">

            <!-- Header with accent line -->
            <div style="padding: 40px 32px 0 32px;">
              <div style="height: 2px; background: linear-gradient(90deg, #8B5CF6 0%, rgba(139,92,246,0.3) 50%, transparent 100%); margin-bottom: 32px;"></div>

              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="color: #8B5CF6; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px 0;">
                      ULIXES CORPORATION
                    </p>
                    <h1 style="color: #fafafa; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.02em; line-height: 1.2;">
                      Inquiry received
                    </h1>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Main content -->
            <div style="padding: 32px;">
              <p style="color: #fafafa; font-size: 16px; font-weight: 500; margin: 0 0 16px 0; line-height: 1.5;">
                Thank you for writing to ${siteConfig.name}.
              </p>
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0;">
                ${contactPageContent.practitioner.name} has received your inquiry and will respond directly, usually within one business day.
              </p>
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.7; margin: 0;">
                If it cannot wait, write to <a href="mailto:${siteConfig.email}" style="color: #A78BFA; text-decoration: none;">${siteConfig.email}</a> or call ${siteConfig.phone}.
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 24px 32px 40px 32px; border-top: 1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="color: #71717a; font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">
                      ${siteConfig.name}
                    </p>
                    <p style="color: #71717a; font-size: 12px; margin: 0 0 16px 0;">
                      ${siteConfig.tagline}
                    </p>
                    <p style="color: #71717a; font-size: 11px; margin: 0;">
                      <a href="${siteConfig.url}" style="color: #8B5CF6; text-decoration: none;">ulixescorp.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </body>
        </html>
      `

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    const source = body as Record<string, unknown>

    const name = readField(source, 'name')
    const email = readField(source, 'email')
    const company = readField(source, 'company')
    const message = readField(source, 'message')
    const { recaptchaToken } = source

    if (name === null || email === null || company === null || message === null) {
      return NextResponse.json(
        { error: 'Invalid field values' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const values: Record<Field, string> = { name, email, company, message }
    for (const field of Object.keys(limits) as Field[]) {
      if (values[field].length > limits[field]) {
        return NextResponse.json(
          { error: `${labels[field]} must be ${limits[field]} characters or fewer` },
          { status: 400 }
        )
      }
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email' },
        { status: 400 }
      )
    }

    if (process.env.NODE_ENV === 'production' && !process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Contact form protection is unavailable' },
        { status: 503 }
      )
    }

    // Verify reCAPTCHA token
    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(String(recaptchaToken))
      if (!isHuman) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 403 }
        )
      }
    } else if (process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      )
    }

    /* Invalid fields and failed CAPTCHA checks do not spend a legitimate
       visitor's shared address allowance. */
    const wait = secondsUntilAllowed(clientAddress(request), Date.now())
    if (wait > 0) {
      return NextResponse.json(
        { error: 'Too many submissions from this address. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(wait) } }
      )
    }

    const safe = {
      name: escapeHtml(singleLine(name)),
      email: escapeHtml(email),
      company: escapeHtml(singleLine(company)),
      message: escapeHtml(message),
    }

    // Send notification email to admin
    const adminEmail = await getResend().emails.send({
      from: 'Ulixes Contact Form <noreply@ulixescorp.com>',
      to: 'admin@ulixescorp.com',
      replyTo: email,
      subject: `New inquiry from ${singleLine(name)} - Ulixes Corporation`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0b;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0b;">

            <!-- Header with accent line -->
            <div style="padding: 40px 32px 0 32px;">
              <div style="height: 2px; background: linear-gradient(90deg, #8B5CF6 0%, rgba(139,92,246,0.3) 50%, transparent 100%); margin-bottom: 32px;"></div>

              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="color: #8B5CF6; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px 0;">
                      ULIXES CORPORATION
                    </p>
                    <h1 style="color: #fafafa; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.02em; line-height: 1.2;">
                      New Inquiry Received
                    </h1>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Main content -->
            <div style="padding: 32px;">
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
                A new contact form submission has been received. Details below.
              </p>

              <!-- Submission details card -->
              <div style="background: #111113; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; margin-bottom: 32px;">

                <!-- Card header -->
                <div style="background: #18181b; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <p style="color: #71717a; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">
                    Contact Details
                  </p>
                </div>

                <!-- Card content -->
                <div style="padding: 20px;">
                  <!-- Name -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td style="width: 100px; vertical-align: top;">
                        <p style="color: #71717a; font-size: 12px; margin: 0;">Name</p>
                      </td>
                      <td>
                        <p style="color: #fafafa; font-size: 14px; margin: 0; font-weight: 500;">${safe.name}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Email -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td style="width: 100px; vertical-align: top;">
                        <p style="color: #71717a; font-size: 12px; margin: 0;">Email</p>
                      </td>
                      <td>
                        <p style="margin: 0;">
                          <a href="mailto:${safe.email}" style="color: #A78BFA; font-size: 14px; text-decoration: none;">${safe.email}</a>
                        </p>
                      </td>
                    </tr>
                  </table>

                  ${safe.company ? `
                  <!-- Institution -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td style="width: 100px; vertical-align: top;">
                        <p style="color: #71717a; font-size: 12px; margin: 0;">Institution</p>
                      </td>
                      <td>
                        <p style="color: #fafafa; font-size: 14px; margin: 0;">${safe.company}</p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- Message -->
                  <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; margin-top: 8px;">
                    <p style="color: #71717a; font-size: 12px; margin: 0 0 8px 0;">Message</p>
                    <p style="color: #fafafa; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safe.message}</p>
                  </div>
                </div>
              </div>

              <!-- Quick action -->
              <div style="text-align: center;">
                <a href="mailto:${safe.email}" style="display: inline-block; background: #8B5CF6; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px;">Reply to ${safe.name}</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 24px 32px 40px 32px; border-top: 1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="color: #52525b; font-size: 12px; margin: 0;">
                      This message was sent via the contact form at ulixescorp.com
                    </p>
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    if (adminEmail.error || !adminEmail.data?.id) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 502 }
      )
    }

    // Send confirmation email to the submitter
    try {
      const confirmationEmail = await getResend().emails.send({
        from: 'Ulixes Corporation <noreply@ulixescorp.com>',
        to: email,
        subject: 'Thank you for contacting Ulixes Corporation',
        html: confirmationHtml,
      })

      if (confirmationEmail.error || !confirmationEmail.data?.id) {
        /* The inquiry already reached Ulixes. A confirmation failure must not
           tell the visitor to retry and create a duplicate admin notification. */
        console.error('Contact confirmation email failed', confirmationEmail.error)
      }
    } catch (error) {
      console.error('Contact confirmation email failed', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
