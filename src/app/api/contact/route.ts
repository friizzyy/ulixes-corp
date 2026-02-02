import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send notification email to admin
    const adminEmail = await resend.emails.send({
      from: 'Ulixes Contact Form <noreply@ulixescorp.com>',
      to: 'admin@ulixescorp.com',
      replyTo: email,
      subject: `New inquiry from ${name} - Ulixes Corporation`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #0a0a0a; font-size: 24px; margin: 0;">New Contact Form Submission</h1>
          </div>

          <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">From</p>
            <p style="margin: 0 0 20px 0; color: #0a0a0a; font-size: 16px; font-weight: 600;">${name}</p>

            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Email</p>
            <p style="margin: 0 0 20px 0; color: #0a0a0a; font-size: 16px;">
              <a href="mailto:${email}" style="color: #8B5CF6; text-decoration: none;">${email}</a>
            </p>

            ${company ? `
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Institution</p>
              <p style="margin: 0 0 20px 0; color: #0a0a0a; font-size: 16px;">${company}</p>
            ` : ''}

            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Message</p>
            <p style="margin: 0; color: #0a0a0a; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              This message was sent via the contact form at ulixescorp.com
            </p>
          </div>
        </div>
      `,
    })

    // Send confirmation email to the submitter
    const confirmationEmail = await resend.emails.send({
      from: 'Ulixes Corporation <noreply@ulixescorp.com>',
      to: email,
      subject: 'Thank you for contacting Ulixes Corporation',
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
                      Message Received
                    </h1>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Main content -->
            <div style="padding: 32px;">
              <p style="color: #fafafa; font-size: 16px; font-weight: 500; margin: 0 0 16px 0; line-height: 1.5;">
                Thank you for reaching out, ${name}.
              </p>
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
                We've received your inquiry and a partner will respond within one business day. At Ulixes, we take every conversation seriously—your message is now with our team.
              </p>

              <!-- Submission details card -->
              <div style="background: #111113; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; margin-bottom: 32px;">

                <!-- Card header -->
                <div style="background: #18181b; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <p style="color: #71717a; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">
                    Your Submission
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
                        <p style="color: #fafafa; font-size: 14px; margin: 0; font-weight: 500;">${name}</p>
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
                        <p style="color: #A78BFA; font-size: 14px; margin: 0;">${email}</p>
                      </td>
                    </tr>
                  </table>

                  ${company ? `
                  <!-- Institution -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td style="width: 100px; vertical-align: top;">
                        <p style="color: #71717a; font-size: 12px; margin: 0;">Institution</p>
                      </td>
                      <td>
                        <p style="color: #fafafa; font-size: 14px; margin: 0;">${company}</p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- Message -->
                  <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; margin-top: 8px;">
                    <p style="color: #71717a; font-size: 12px; margin: 0 0 8px 0;">Message</p>
                    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>
                </div>
              </div>

              <!-- What happens next -->
              <div style="background: linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.02) 100%); border: 1px solid rgba(139,92,246,0.2); border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <p style="color: #8B5CF6; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 8px 0;">
                  What Happens Next
                </p>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
                  A senior practitioner will review your inquiry and reach out directly. We're selective about the work we take on. If your challenge involves the intersection of accounting, risk, and infrastructure, we should connect.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 24px 32px 40px 32px; border-top: 1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="color: #71717a; font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">
                      Ulixes Corporation
                    </p>
                    <p style="color: #71717a; font-size: 12px; margin: 0 0 16px 0;">
                      Capital Markets Infrastructure. Engineered for Control.
                    </p>
                    <p style="color: #71717a; font-size: 11px; margin: 0;">
                      <a href="https://ulixescorp.com" style="color: #8B5CF6; text-decoration: none;">ulixescorp.com</a>
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

    return NextResponse.json({
      success: true,
      adminEmailId: adminEmail.data?.id,
      confirmationEmailId: confirmationEmail.data?.id
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
