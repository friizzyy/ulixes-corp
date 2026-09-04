import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { contactPageContent } from '@/lib/contact-content'
import { ContactPage } from './contact-page'

describe('ContactPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({}) })) as unknown as typeof fetch,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    window.history.replaceState(null, '', '/')
  })

  it('renders the inquiry form with the fields the API reads', () => {
    const { container } = render(<ContactPage />)

    const heading = screen.getByRole('heading', {
      level: 1,
      name: `${contactPageContent.header.headlineLead} ${contactPageContent.header.headlineRest}`,
    })

    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBe(
      `${contactPageContent.header.headlineLead} ${contactPageContent.header.headlineRest}`,
    )
    expect(
      screen.getByRole('textbox', {
        name: `${contactPageContent.form.companyLabel} ${contactPageContent.form.companyOptional}`,
      }),
    ).toBeInTheDocument()
    expect(container.querySelector('main')).not.toBeInTheDocument()

    /*
     * /api/contact destructures name, email, company, message, and
     * recaptchaToken. If a field is renamed here the request still succeeds and
     * the value silently arrives undefined, so the names are asserted directly.
     */
    for (const field of ['name', 'email', 'company', 'message']) {
      expect(container.querySelector(`[name="${field}"]`)).toBeInTheDocument()
    }
  })

  it('keeps direct contact options before the flat mobile form', () => {
    const { container } = render(<ContactPage />)

    const layout = container.querySelector('[data-mobile-layout="flat"]')
    const directChannels = screen.getByRole('region', {
      name: 'Direct contact options',
    })
    const inquiryForm = container.querySelector('form')

    expect(layout).toBeInTheDocument()
    expect(directChannels).toBeInTheDocument()
    expect(inquiryForm).toBeInTheDocument()
    expect(
      directChannels.compareDocumentPosition(inquiryForm as HTMLFormElement) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('provides the browser with contact-field autocomplete hints', () => {
    const { container } = render(<ContactPage />)

    expect(container.querySelector('[name="name"]')).toHaveAttribute(
      'autocomplete',
      'name',
    )
    expect(container.querySelector('[name="email"]')).toHaveAttribute(
      'autocomplete',
      'email',
    )
    expect(container.querySelector('[name="company"]')).toHaveAttribute(
      'autocomplete',
      'organization',
    )
  })

  it('blocks submission and reports per-field errors', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Message is required')).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.getByLabelText(contactPageContent.form.nameLabel),
      ).toHaveFocus(),
    )
    expect(
      screen.getByLabelText(contactPageContent.form.nameLabel),
    ).toHaveAttribute(
      'aria-describedby',
      'name-error',
    )
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a malformed email and a message under ten characters', async () => {
    const user = userEvent.setup()
    const { container } = render(<ContactPage />)

    await user.type(container.querySelector('[name="name"]')!, 'Ada Lovelace')
    await user.type(container.querySelector('[name="email"]')!, 'not-an-email')
    await user.type(container.querySelector('[name="message"]')!, 'too short')
    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))

    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument()
    expect(
      screen.getByText('Message must be at least 10 characters'),
    ).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('posts the expected payload and confirms', async () => {
    const user = userEvent.setup()
    const { container } = render(<ContactPage />)

    await user.type(container.querySelector('[name="name"]')!, 'Ada Lovelace')
    await user.type(container.querySelector('[name="email"]')!, 'ada@institution.com')
    await user.type(container.querySelector('[name="company"]')!, 'Institution')
    await user.type(
      container.querySelector('[name="message"]')!,
      'Platform migration cutover is scheduled and the first close worries me.',
    )
    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@institution.com',
      company: 'Institution',
    })
    expect(JSON.parse(init.body)).toHaveProperty('recaptchaToken')

    expect(
      await screen.findByText(contactPageContent.success.title),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: contactPageContent.success.title,
        }),
      ).toHaveFocus(),
    )
  })

  it('surfaces a failed send without losing what was typed', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })) as unknown as typeof fetch)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    const { container } = render(<ContactPage />)

    await user.type(container.querySelector('[name="name"]')!, 'Ada Lovelace')
    await user.type(container.querySelector('[name="email"]')!, 'ada@institution.com')
    await user.type(
      container.querySelector('[name="message"]')!,
      'Platform migration cutover is scheduled and the first close worries me.',
    )
    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText(contactPageContent.error.title)).toBeInTheDocument()
    // The form stays populated so a retry does not mean retyping.
    expect(container.querySelector('[name="name"]')).toHaveValue('Ada Lovelace')
  })

  it('pre-fills an empty message from the program a Calypso link names', () => {
    /*
     * "Discuss this program" on /nasdaq-calypso arrives as
     * /contact?program=<encoded name>. The message opens with the program and
     * nothing else, so the visitor writes the rest.
     */
    window.history.replaceState(
      null,
      '',
      '/contact?program=Hedge%20accounting%20framework%20design',
    )
    const { container } = render(<ContactPage />)

    expect(container.querySelector('[name="message"]')).toHaveValue(
      'Regarding: Hedge accounting framework design. ',
    )
    // Only the message is touched.
    expect(container.querySelector('[name="name"]')).toHaveValue('')
    expect(container.querySelector('[name="company"]')).toHaveValue('')
  })

  it('leaves the message empty when no program is named', () => {
    const { container } = render(<ContactPage />)

    expect(container.querySelector('[name="message"]')).toHaveValue('')
  })

  it('keeps published copy free of company-wide voice and em dashes', () => {
    const published = JSON.stringify(contactPageContent)
    expect(published).not.toContain('—')
    for (const form of [' we ', "We're", ' our ', ' us ', 'a partner will']) {
      expect(published.toLowerCase()).not.toContain(form.toLowerCase())
    }
  })
})
