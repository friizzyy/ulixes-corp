import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In production, integrate with your email service (SendGrid, Resend, etc.)
    // For now, log the submission and return success
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company || 'Not provided',
      message: data.message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Add email service integration
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@ulixescorp.com',
    //   to: 'contact@ulixescorp.com',
    //   subject: `New Contact Form: ${data.name}`,
    //   html: `<p>Name: ${data.name}</p><p>Email: ${data.email}</p><p>Company: ${data.company}</p><p>Message: ${data.message}</p>`,
    // })

    return NextResponse.json(
      { success: true, message: 'Message received successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
