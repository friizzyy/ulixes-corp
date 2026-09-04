import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  calypsoDomains,
  calypsoProgramFamilies,
  calypsoPrograms,
} from '@/lib/calypso-content'
import { CalypsoPrograms } from './calypso-programs'

/*
 * The index is read family by family, so this is the order the rows take, the
 * order they are numbered in, and the order the arrow keys walk.
 */
const readingOrder = calypsoProgramFamilies.flatMap((family) =>
  calypsoPrograms.filter((program) => program.family === family.id),
)

const pad = (value: number) => String(value).padStart(2, '0')

const rowFor = (name: string) =>
  screen.getByRole('tab', { name: new RegExp(name) })

const detailRegion = () =>
  screen.getByRole('tabpanel')

describe('CalypsoPrograms', () => {
  it('presents the three program families in published order on mobile', () => {
    render(<CalypsoPrograms />)

    const mobile = screen.getByRole('region', {
      name: 'Mobile Calypso programs',
    })
    const familySelector = within(mobile).getByRole('group', {
      name: 'Program families',
    })
    const familyControls = within(familySelector).getAllByRole('button')

    expect(familyControls).toHaveLength(calypsoProgramFamilies.length)
    calypsoProgramFamilies.forEach((family, index) => {
      expect(familyControls[index]).toHaveAccessibleName(family.label)
      expect(familyControls[index]).toHaveAttribute(
        'aria-pressed',
        index === 0 ? 'true' : 'false',
      )
    })

    const firstFamily = calypsoProgramFamilies[0]
    const expectedPrograms = readingOrder.filter(
      (program) => program.family === firstFamily.id,
    )
    const programList = within(mobile).getByRole('list', {
      name: `${firstFamily.label} programs`,
    })
    const programRows = within(programList).getAllByRole('listitem')

    expect(programRows).toHaveLength(expectedPrograms.length)
    expectedPrograms.forEach((program, index) => {
      expect(programRows[index]).toHaveTextContent(program.name)
    })

    const disclosures = within(programList).getAllByRole('button')
    expect(disclosures.filter((control) => control.getAttribute('aria-expanded') === 'true'))
      .toHaveLength(1)
    expect(disclosures[0]).toHaveAttribute('aria-expanded', 'true')
    expect(disclosures[0]).toHaveAttribute(
      'aria-controls',
      'mobile-program-panel-0',
    )
    expect(within(programRows[0]).getByRole('region')).toHaveAttribute(
      'id',
      'mobile-program-panel-0',
    )
  })

  it('opens the first program when a family changes and expands another program inline', async () => {
    const user = userEvent.setup()
    render(<CalypsoPrograms />)

    const mobile = screen.getByRole('region', {
      name: 'Mobile Calypso programs',
    })
    const familySelector = within(mobile).getByRole('group', {
      name: 'Program families',
    })
    const targetFamily = calypsoProgramFamilies[1]
    await user.click(
      within(familySelector).getByRole('button', { name: targetFamily.label }),
    )

    expect(
      within(familySelector).getByRole('button', { name: targetFamily.label }),
    ).toHaveAttribute('aria-pressed', 'true')

    const expectedPrograms = readingOrder.filter(
      (program) => program.family === targetFamily.id,
    )
    const programList = within(mobile).getByRole('list', {
      name: `${targetFamily.label} programs`,
    })
    const programControls = within(programList).getAllByRole('button')

    expect(programControls[0]).toHaveAttribute('aria-expanded', 'true')
    expect(programControls.slice(1).every((control) =>
      control.getAttribute('aria-expanded') === 'false')).toBe(true)

    await user.click(programControls[1])

    expect(programControls[0]).toHaveAttribute('aria-expanded', 'false')
    expect(programControls[1]).toHaveAttribute('aria-expanded', 'true')
    const openPanel = within(programList).getByRole('region')
    expect(openPanel).toHaveTextContent(expectedPrograms[1].note)
    expect(within(openPanel).getByRole('link', { name: 'Discuss this program' }))
      .toHaveAttribute(
        'href',
        `/contact?program=${encodeURIComponent(expectedPrograms[1].name)}`,
      )
  })

  it('opens on the first program with the indicator on its row', () => {
    render(<CalypsoPrograms />)

    const first = rowFor(readingOrder[0].name)
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('aria-controls', 'program-detail')
    expect(within(first).getByTestId('program-indicator')).toBeInTheDocument()
    // One mark travels; no row draws its own.
    expect(screen.getAllByTestId('program-indicator')).toHaveLength(1)

    expect(detailRegion()).toHaveAttribute('aria-live', 'polite')
    expect(
      within(detailRegion()).getByRole('heading', {
        level: 4,
        name: readingOrder[0].name,
      }),
    ).toBeInTheDocument()
  })

  it('moves the indicator and the detail with the selection', async () => {
    const user = userEvent.setup()
    render(<CalypsoPrograms />)

    const target = readingOrder[4]
    await user.click(rowFor(target.name))

    expect(rowFor(target.name)).toHaveAttribute('aria-selected', 'true')
    expect(rowFor(readingOrder[0].name)).toHaveAttribute('aria-selected', 'false')
    expect(
      within(rowFor(target.name)).getByTestId('program-indicator'),
    ).toBeInTheDocument()
    expect(screen.getAllByTestId('program-indicator')).toHaveLength(1)

    /*
     * The card swaps through an exit animation, so the new entry arrives a
     * beat after the click. The live region itself never remounts: that is
     * what lets it announce the change.
     */
    const detail = detailRegion()
    expect(
      await within(detail).findByRole('heading', { level: 4, name: target.name }),
    ).toBeInTheDocument()
    expect(within(detail).getByTestId('program-detail-body')).toHaveTextContent(
      target.note,
    )
    expect(detail).toHaveAttribute('id', 'program-detail')
  })

  it('carries the selected program into the contact link, encoded', async () => {
    const user = userEvent.setup()
    render(<CalypsoPrograms />)

    const link = within(detailRegion()).getByRole('link', {
      name: /Discuss this program/,
    })
    expect(link).toHaveAttribute(
      'href',
      `/contact?program=${encodeURIComponent(readingOrder[0].name)}`,
    )

    await user.click(rowFor(readingOrder[3].name))

    // The link is persistent chrome, so its href follows the selection at once.
    expect(link).toHaveAttribute(
      'href',
      `/contact?program=${encodeURIComponent(readingOrder[3].name)}`,
    )
    expect(link.getAttribute('href')).not.toContain(' ')
  })

  it('labels each family with its count and numbers rows in reading order', () => {
    render(<CalypsoPrograms />)

    for (const family of calypsoProgramFamilies) {
      const count = calypsoPrograms.filter(
        (program) => program.family === family.id,
      ).length
      const head = screen.getByRole('heading', { level: 3, name: family.label })
        .parentElement as HTMLElement
      expect(head).toHaveTextContent(`${pad(count)} program`)
      expect(head).toHaveTextContent(family.note)
    }

    readingOrder.forEach((program, index) => {
      const row = rowFor(program.name)
      expect(row).toHaveTextContent(pad(index + 1))
      expect(row.closest('li')).toHaveAttribute('role', 'presentation')
    })
  })

  it('renders the six domains as numbered rows with their notes in view', () => {
    render(<CalypsoPrograms />)

    const rows = within(
      screen.getByRole('list', { name: 'Product domains' }),
    ).getAllByRole('listitem')
    expect(rows).toHaveLength(calypsoDomains.length)

    calypsoDomains.forEach((domain, index) => {
      expect(rows[index]).toHaveTextContent(pad(index + 1))
      expect(within(rows[index]).getByText(domain.name)).toBeVisible()
      // Nothing waits behind a hover.
      expect(within(rows[index]).getByText(domain.note)).toBeVisible()
    })
  })

  it('walks the reading order with arrows, Home and End, and wraps', () => {
    render(<CalypsoPrograms />)

    const first = rowFor(readingOrder[0].name)
    const second = rowFor(readingOrder[1].name)
    const last = rowFor(readingOrder[readingOrder.length - 1].name)

    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(second).toHaveFocus()
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(second).toHaveAttribute('tabindex', '0')
    expect(first).toHaveAttribute('tabindex', '-1')

    fireEvent.keyDown(second, { key: 'End' })
    expect(last).toHaveFocus()

    fireEvent.keyDown(last, { key: 'ArrowDown' })
    expect(first).toHaveFocus()

    fireEvent.keyDown(first, { key: 'ArrowUp' })
    expect(last).toHaveFocus()

    fireEvent.keyDown(last, { key: 'Home' })
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('aria-selected', 'true')
  })
})
