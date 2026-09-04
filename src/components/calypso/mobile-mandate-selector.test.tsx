import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { calypsoDelivery } from '@/lib/calypso-content'
import { MobileMandateSelector } from './mobile-mandate-selector'

describe('MobileMandateSelector', () => {
  it('shows four compact mandate triggers and mounts exactly one risk statement', () => {
    render(<MobileMandateSelector mandates={calypsoDelivery} />)

    const selector = screen.getByRole('region', {
      name: 'Mobile Calypso mandates',
    })
    const controls = within(selector).getAllByRole('button')

    expect(selector).toHaveAttribute('data-visible-through', '895px')
    expect(controls).toHaveLength(4)
    expect(controls.filter((control) => control.getAttribute('aria-pressed') === 'true'))
      .toHaveLength(1)
    calypsoDelivery.forEach((mandate, index) => {
      expect(controls[index]).toHaveTextContent(mandate.title)
      expect(controls[index]).toHaveTextContent(
        mandate.scope
          .split('·')
          .map((term) => term.trim().charAt(0).toUpperCase() + term.trim().slice(1))
          .join(' · '),
      )
    })

    const risk = within(selector).getByRole('region', {
      name: 'Selected mandate risk',
    })
    expect(risk).toHaveTextContent(calypsoDelivery[0].risk)
    expect(selector.querySelectorAll('[data-mandate-risk]')).toHaveLength(1)
  })

  it('replaces the selected risk without mounting the other three', async () => {
    const user = userEvent.setup()
    render(<MobileMandateSelector mandates={calypsoDelivery} />)

    const selector = screen.getByRole('region', {
      name: 'Mobile Calypso mandates',
    })
    const target = within(selector).getByRole('button', {
      name: new RegExp(calypsoDelivery[2].title, 'i'),
    })
    await user.click(target)

    expect(target).toHaveAttribute('aria-pressed', 'true')
    expect(within(selector).getByRole('region', {
      name: 'Selected mandate risk',
    })).toHaveTextContent(calypsoDelivery[2].risk)
    expect(within(selector).queryByText(calypsoDelivery[0].risk))
      .not.toBeInTheDocument()
    expect(selector.querySelectorAll('[data-mandate-risk]')).toHaveLength(1)
  })

  it('keeps the polite live-region node stable while its risk changes', async () => {
    const user = userEvent.setup()
    render(<MobileMandateSelector mandates={calypsoDelivery} />)
    const selector = screen.getByRole('region', {
      name: 'Mobile Calypso mandates',
    })
    const liveRegion = within(selector).getByRole('region', {
      name: 'Selected mandate risk',
    })

    await user.click(
      within(selector).getByRole('button', {
        name: new RegExp(calypsoDelivery[1].title, 'i'),
      }),
    )

    expect(
      within(selector).getByRole('region', {
        name: 'Selected mandate risk',
      }),
    ).toBe(liveRegion)
    expect(liveRegion).toHaveTextContent(calypsoDelivery[1].risk)
  })

  it('moves selected focus with arrow keys and respects the boundaries', () => {
    render(<MobileMandateSelector mandates={calypsoDelivery} />)
    const controls = within(
      screen.getByRole('region', { name: 'Mobile Calypso mandates' }),
    ).getAllByRole('button')

    controls[0].focus()
    fireEvent.keyDown(controls[0], { key: 'ArrowDown' })
    expect(controls[1]).toHaveFocus()
    expect(controls[1]).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(controls[1], { key: 'End' })
    expect(controls[3]).toHaveFocus()
    fireEvent.keyDown(controls[3], { key: 'ArrowDown' })
    expect(controls[3]).toHaveFocus()

    fireEvent.keyDown(controls[3], { key: 'Home' })
    expect(controls[0]).toHaveFocus()
  })
})
