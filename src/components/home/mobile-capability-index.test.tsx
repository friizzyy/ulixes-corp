import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { serviceModules } from '@/lib/homepage-content'
import { MobileCapabilityIndex } from './mobile-capability-index'

describe('MobileCapabilityIndex', () => {
  it('opens one capability brief without rendering four descriptions at rest', async () => {
    const user = userEvent.setup()
    render(<MobileCapabilityIndex items={serviceModules} />)

    for (const service of serviceModules) {
      expect(screen.queryByText(service.description)).not.toBeInTheDocument()
    }

    await user.click(
      screen.getByRole('button', { name: /transformation and solution architecture/i }),
    )

    const dialog = screen.getByRole('dialog', {
      name: serviceModules[0].title,
    })
    expect(dialog).toHaveTextContent(serviceModules[0].description)
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })

  it('keeps every scope, verified description, and service destination reachable', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(<MobileCapabilityIndex items={serviceModules} />)

    const index = screen.getByRole('list', { name: 'Mobile capability index' })
    expect(within(index).getAllByRole('listitem')).toHaveLength(4)

    for (const service of serviceModules) {
      const trigger = within(index).getByRole('button', {
        name: new RegExp(service.title, 'i'),
      })
      expect(trigger).toHaveTextContent(service.scope)
      await user.click(trigger)

      const dialog = screen.getByRole('dialog', { name: service.title })
      expect(dialog).toHaveTextContent(service.description)
      expect(
        within(dialog).getByRole('link', { name: 'Discuss this capability' }),
      ).toHaveAttribute('href', service.href)

      await user.click(within(dialog).getByRole('button', { name: 'Close detail' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
  })
})
