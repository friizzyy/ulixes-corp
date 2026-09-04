import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { servicesContent } from '@/lib/services-content'
import { MobileProcessPager } from './mobile-process-pager'

const steps = servicesContent.approach.steps

describe('MobileProcessPager', () => {
  it('shows exactly one process phase and advances it with the next control', async () => {
    const user = userEvent.setup()
    render(<MobileProcessPager steps={steps} />)

    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1)
    expect(screen.getAllByRole('button', { expanded: true })[0])
      .toHaveAccessibleName('Phase 1: Architecture definition — 01')
    expect(screen.getByText(steps[0].description)).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Next phase' }))

    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1)
    expect(screen.getByText(steps[1].description)).toBeVisible()
    expect(screen.queryByText(steps[0].description)).not.toBeInTheDocument()
  })

  it('selects a phase directly and reports its position', async () => {
    const user = userEvent.setup()
    render(<MobileProcessPager steps={steps} />)

    await user.click(
      screen.getByRole('button', { name: /Phase 4: Control transfer/i }),
    )

    expect(screen.getByText(steps[3].description)).toBeVisible()
    expect(screen.getByText('Phase 4 of 4')).toBeVisible()
  })

  it('moves between phase controls with the horizontal arrow keys', async () => {
    const user = userEvent.setup()
    render(<MobileProcessPager steps={steps} />)
    const controls = screen.getAllByRole('button', { name: /Phase \d:/i })

    controls[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(controls[1]).toHaveFocus()
    expect(controls[1]).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(controls[0]).toHaveFocus()
    expect(controls[0]).toHaveAttribute('aria-expanded', 'true')
  })

  it('returns to the preceding phase with the previous control', async () => {
    const user = userEvent.setup()
    render(<MobileProcessPager steps={steps} />)

    await user.click(screen.getByRole('button', { name: 'Next phase' }))
    await user.click(screen.getByRole('button', { name: 'Previous phase' }))

    expect(screen.getByText(steps[0].description)).toBeVisible()
    expect(screen.getByText('Phase 1 of 4')).toBeVisible()
  })

  it('keeps every verified phase description reachable', async () => {
    const user = userEvent.setup()
    render(<MobileProcessPager steps={steps} />)

    for (const [index, step] of steps.entries()) {
      if (index > 0) {
        await user.click(
          screen.getByRole('button', {
            name: new RegExp(`Phase ${index + 1}:`, 'i'),
          }),
        )
      }
      expect(screen.getByText(step.description)).toBeVisible()
    }
  })
})
