import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { composeInquiryMessage, contactPageContent } from '@/lib/contact-content'
import { ContactPage } from './contact-page'

const { intro, you, platform, decision, actions, sent, failure, errors } = contactPageContent

type FetchMock = ReturnType<typeof vi.fn>

const stepIndex: Record<string, number> = {
  [contactPageContent.you.title]: 0,
  [contactPageContent.platform.title]: 1,
  [contactPageContent.decision.title]: 2,
  [contactPageContent.sent.title]: 3,
}

/* Inactive steps are inert, so they are found by position, not by role. */
function stepOf(heading: string) {
  const step = document.querySelector(`[data-step="${stepIndex[heading]}"]`) as HTMLElement
  expect(step).toBeInTheDocument()
  return step
}

async function fillStepOne(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(you.nameLabel), 'Ada Lovelace')
  await user.type(screen.getByLabelText(you.companyLabel), 'Analytical Bank')
  await user.type(screen.getByLabelText(you.emailLabel), 'ada@institution.com')
  await user.click(screen.getByRole('button', { name: /Continue/ }))
}

async function fillStepTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: /Migration/ }))
  await user.type(screen.getByLabelText(platform.platformLabel), 'Front to back')
  await user.click(screen.getByRole('button', { name: /Continue/ }))
}

async function fillStepThree(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText(decision.decisionLabel),
    'Whether the cutover can hold the first quarter close.',
  )
  await user.type(screen.getByLabelText(new RegExp(decision.whenLabel)), 'Q3')
}

describe('ContactPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ success: true }) })) as unknown as typeof fetch,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    window.history.replaceState(null, '', '/')
  })

  it('renders one headline, the lede, Ulysses and the direct lines', () => {
    const { container } = render(<ContactPage />)

    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(`${intro.headlineLead} ${intro.headlineTurn}`)
    expect(within(h1).getByText(intro.headlineTurn)).toHaveClass('s')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText(intro.eyebrow)).toBeInTheDocument()

    const direct = container.querySelector('dl') as HTMLElement
    expect(within(direct).getByRole('link', { name: /admin@ulixescorp\.com/ })).toHaveAttribute(
      'href',
      'mailto:admin@ulixescorp.com',
    )
    expect(within(direct).getByRole('link', { name: /283-9983/ })).toHaveAttribute('href', 'tel:+14152839983')
    expect(within(direct).getByText('San Francisco, California')).toBeInTheDocument()
    expect(container.querySelector('main')).not.toBeInTheDocument()
  })

  it('draws the phone hero with the light brand and the addressee row', () => {
    render(<ContactPage />)

    /* Phone-only pieces are display:none at jsdom's 1024px. */
    expect(screen.getByRole('link', { name: 'Ulixes Corporation, home', hidden: true })).toBeInTheDocument()
    expect(screen.getByText(contactPageContent.practitioner.toNote)).toBeInTheDocument()
  })

  it('shows step one only, with the three-step progress and the API field names', () => {
    const { container } = render(<ContactPage />)

    const progress = screen.getByRole('list', { name: 'Inquiry steps' })
    expect(within(progress).getAllByRole('button', { hidden: true })).toHaveLength(3)
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()

    expect(stepOf(you.title)).not.toHaveAttribute('inert')
    expect(stepOf(platform.title)).toHaveAttribute('inert')
    expect(stepOf(decision.title)).toHaveAttribute('inert')

    for (const field of ['name', 'email', 'company']) {
      expect(container.querySelector(`[name="${field}"]`)).toBeInTheDocument()
    }
    expect(container.querySelector('[name="name"]')).toHaveAttribute('autocomplete', 'name')
    expect(container.querySelector('[name="email"]')).toHaveAttribute('autocomplete', 'email')
    expect(container.querySelector('[name="company"]')).toHaveAttribute('autocomplete', 'organization')
  })

  it('will not leave step one until name, institution and a valid email are given', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await user.click(screen.getByRole('button', { name: /Continue/ }))
    expect(screen.getByText(errors.name)).toBeInTheDocument()
    expect(screen.getByText(errors.company)).toBeInTheDocument()
    expect(screen.getByText(errors.email)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText(you.nameLabel)).toHaveFocus())
    expect(screen.getByLabelText(you.nameLabel)).toHaveAttribute('aria-describedby', 'inquiry-name-error')

    await user.type(screen.getByLabelText(you.nameLabel), 'Ada')
    await user.type(screen.getByLabelText(you.companyLabel), 'Bank')
    await user.type(screen.getByLabelText(you.emailLabel), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /Continue/ }))
    expect(screen.getByText(errors.emailInvalid)).toBeInTheDocument()
    expect(stepOf(you.title)).not.toHaveAttribute('inert')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('moves forward, focuses each step heading, and goes back', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await fillStepOne(user)
    expect(stepOf(platform.title)).not.toHaveAttribute('inert')
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('heading', { name: platform.title })).toHaveFocus())

    /* The first step is now done and can be revisited from the progress. */
    const progressYou = within(screen.getByRole('list', { name: 'Inquiry steps' })).getAllByRole('button')[0]
    expect(progressYou).toHaveAttribute('tabindex', '0')

    await user.click(screen.getByRole('button', { name: /Back/ }))
    expect(stepOf(you.title)).not.toHaveAttribute('inert')
    expect(screen.getByLabelText(you.nameLabel)).toHaveValue('Ada Lovelace')
  })

  it('runs the delivery stage as a roving radio group', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)
    await fillStepOne(user)

    const group = screen.getByRole('radiogroup', { name: platform.stageLabel })
    const radios = within(group).getAllByRole('radio')
    expect(radios).toHaveLength(6)
    expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveAttribute('tabindex', '-1')

    radios[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(radios[5]).toHaveAttribute('aria-checked', 'true')
    expect(radios[5]).toHaveAttribute('tabindex', '0')
  })

  it('posts every answer to /api/contact and only then shows the sent state', async () => {
    let resolveFetch: (value: unknown) => void = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      ) as unknown as typeof fetch,
    )
    const user = userEvent.setup()
    render(<ContactPage />)

    await fillStepOne(user)
    await fillStepTwo(user)
    await fillStepThree(user)
    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))

    /* Waiting on the API: no sent state yet. */
    expect(await screen.findByRole('button', { name: /Sending/ })).toBeDisabled()
    expect(stepOf(sent.title)).toHaveAttribute('inert')

    const [url, init] = (fetch as unknown as FetchMock).mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')
    const body = JSON.parse(init.body)
    expect(body).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@institution.com',
      company: 'Analytical Bank',
      message: composeInquiryMessage({
        stage: 'Migration',
        platform: 'Front to back',
        decision: 'Whether the cutover can hold the first quarter close.',
        when: 'Q3',
      }),
      recaptchaToken: null,
    })
    expect(body.message).toContain('Delivery stage: Migration')
    expect(body.message).toContain('By when: Q3')

    resolveFetch({ ok: true, json: async () => ({ success: true }) })

    const thanks = await screen.findByRole('heading', { name: 'Thank you, Ada.' })
    await waitFor(() => expect(thanks).toHaveFocus())
    expect(screen.getByText(sent.status, { selector: '[aria-live]' })).toBeInTheDocument()
    for (const line of sent.next) expect(screen.getByText(line)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Send inquiry/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: sent.again }))
    expect(stepOf(you.title)).not.toHaveAttribute('inert')
    expect(screen.getByLabelText(you.nameLabel)).toHaveValue('')
  })

  it('requires the decision, and keeps the answers when the send fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })) as unknown as typeof fetch)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<ContactPage />)

    await fillStepOne(user)
    await fillStepTwo(user)
    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))
    expect(screen.getByText(errors.decision)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()

    await fillStepThree(user)
    await user.click(screen.getByRole('button', { name: /Send inquiry/ }))

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText(failure.title)).toBeInTheDocument()
    expect(stepOf(decision.title)).not.toHaveAttribute('inert')
    expect(screen.getByLabelText(decision.decisionLabel)).toHaveValue(
      'Whether the cutover can hold the first quarter close.',
    )
    expect(screen.getByRole('button', { name: /Send inquiry/ })).toBeEnabled()
  })

  it('pre-fills an empty decision from the program a Calypso link names', () => {
    window.history.replaceState(null, '', '/contact?program=Hedge%20accounting%20framework%20design')
    const { container } = render(<ContactPage />)

    expect(container.querySelector('[name="decision"]')).toHaveValue('Regarding: Hedge accounting framework design. ')
    expect(container.querySelector('[name="name"]')).toHaveValue('')
  })

  it('keeps published copy free of company-wide voice and em dashes', () => {
    const published = JSON.stringify(contactPageContent)
    expect(published).not.toContain('—')
    for (const form of [' we ', "We're", ' our ', ' us ']) {
      expect(published.toLowerCase()).not.toContain(form.toLowerCase())
    }
    expect(actions.send).toBe('Send inquiry')
  })
})
