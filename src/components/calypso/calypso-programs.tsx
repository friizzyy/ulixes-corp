'use client'

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion, type Variants } from 'framer-motion'
import { ArrowUpRight } from '@/components/ui/icons'
import {
  calypsoContent,
  calypsoDomains,
  calypsoProgramFamilies,
  calypsoPrograms,
  type CalypsoProgram,
} from '@/lib/calypso-content'
import styles from './calypso-programs.module.css'

/*
 * Eight programs without the long run.
 *
 * The previous version stacked all eight full width with two or three
 * sentences each, which came to more than twelve hundred pixels of unbroken
 * list. The copy was not the problem: showing every word of it at once was.
 *
 * So the eight are grouped into three families and only the selected one is
 * open. The grouping is the substance of the change. Three families is
 * something a reader can hold and enter from; eight equally weighted rows is
 * an inventory. The index stays complete, so nothing is hidden behind a
 * hover, and the detail carries the whole entry rather than a truncation.
 */

/*
 * The index is read family by family, so the rows are numbered and walked in
 * that order. Numbered by their position in the content array they came out
 * as 01, 07 and 08 under the first family, and ArrowDown from the first row
 * landed in the second family, two rows past where the eye was.
 */
const readingOrder: readonly CalypsoProgram[] = calypsoProgramFamilies.flatMap(
  (family) => calypsoPrograms.filter((program) => program.family === family.id),
)

const pad = (value: number) => String(value).padStart(2, '0')

const familyOf = (program: CalypsoProgram) =>
  calypsoProgramFamilies.find((family) => family.id === program.family)

/* Firm rather than springy: the mark settles, it does not bounce. */
const indicatorSpring = { type: 'spring' as const, stiffness: 260, damping: 30 }

/*
 * The swap. Each line of the card rises out of its own clip, the four of them
 * 40ms apart, and the outgoing lines leave the same way but faster: the reader
 * asked for the next entry, so the old one should not linger. Ease-out only.
 * A spring on text overshoots, and overshoot here reads as a toy.
 */
const enterEase = [0.22, 0.61, 0.36, 1] as const
const exitEase = [0.4, 0, 1, 1] as const

const curtain: Variants = {
  hidden: { y: '110%', opacity: 0 },
  shown: (order: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.36, ease: enterEase, delay: order * 0.04 },
  }),
  exit: (order: number) => ({
    y: '-60%',
    opacity: 0,
    transition: { duration: 0.18, ease: exitEase, delay: order * 0.02 },
  }),
}

/* The same three states with no travel and no wait, for readers who asked
   for less motion: the swap is a cut. */
const still: Variants = {
  hidden: { y: 0, opacity: 1 },
  shown: { y: 0, opacity: 1, transition: { duration: 0 } },
  exit: { y: 0, opacity: 1, transition: { duration: 0 } },
}

/*
 * framer's own useReducedMotion reads the media query during the first client
 * render, which differs from the server's null and trips hydration for the
 * readers it is meant to serve. Reading it after mount keeps both renders the
 * same, and the preference lands before anything can be selected.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

/* One line of the card in its clip. Static in the sizer, animated when live. */
function Line({
  order,
  variants,
  children,
}: {
  order: number
  variants?: Variants
  children: ReactNode
}) {
  return (
    <div className={styles.line}>
      {variants ? (
        <motion.div variants={variants} custom={order}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </div>
  )
}

/*
 * The three lines an entry is made of. Rendered once live, with the heading,
 * and once per program in the sizer, where the title is a plain block so the
 * outline does not gain eight hidden headings.
 */
function Entry({
  program,
  variants,
  heading = false,
}: {
  program: CalypsoProgram
  variants?: Variants
  heading?: boolean
}) {
  return (
    <>
      <Line order={0} variants={variants}>
        <p className={styles.detailFamily}>{familyOf(program)?.label}</p>
      </Line>
      <Line order={1} variants={variants}>
        {heading ? (
          <h4 className={styles.detailTitle}>{program.name}</h4>
        ) : (
          <div className={styles.detailTitle}>{program.name}</div>
        )}
      </Line>
      <Line order={2} variants={variants}>
        <p className={styles.detailNote}>{program.note}</p>
      </Line>
    </>
  )
}

export function CalypsoPrograms() {
  const [active, setActive] = useState(0)
  const [mobileFamilyId, setMobileFamilyId] = useState<CalypsoProgram['family']>(
    calypsoProgramFamilies[0].id,
  )
  const [mobileActive, setMobileActive] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const reduced = usePrefersReducedMotion()
  const variants = reduced ? still : curtain

  const select = (index: number, moveFocus = false) => {
    setActive(index)
    if (moveFocus) refs.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (index + 1) % readingOrder.length
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (index - 1 + readingOrder.length) % readingOrder.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = readingOrder.length - 1
    }
    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  const current = readingOrder[active]
  const mobileFamily = calypsoProgramFamilies.find(
    (family) => family.id === mobileFamilyId,
  ) ?? calypsoProgramFamilies[0]
  const mobilePrograms = readingOrder
    .map((program, index) => ({ program, index }))
    .filter(({ program }) => program.family === mobileFamily.id)

  const selectMobileFamily = (familyId: CalypsoProgram['family']) => {
    const first = readingOrder.findIndex((program) => program.family === familyId)
    setMobileFamilyId(familyId)
    setMobileActive(first)
  }

  return (
    <div className={styles.programs} data-testid="calypso-programs">
      <section
        className={styles.mobile}
        role="region"
        aria-label="Mobile Calypso programs"
        data-mobile-layout="family-disclosure"
        data-visible-through="767px"
      >
        <div className={styles.mobileFamilySelector} role="group" aria-label="Program families">
          {calypsoProgramFamilies.map((family) => (
            <button
              key={family.id}
              type="button"
              className={styles.mobileFamilyControl}
              aria-label={family.label}
              aria-pressed={family.id === mobileFamily.id}
              onClick={() => selectMobileFamily(family.id)}
            >
              {family.label}
            </button>
          ))}
        </div>

        <header className={styles.mobileFamilyIntro} data-material={mobileFamily.material}>
          <p className={styles.mobileFamilyLabel}>{mobileFamily.label}</p>
          <p className={styles.mobileFamilyNote}>{mobileFamily.note}</p>
        </header>

        <ul
          className={styles.mobileProgramList}
          aria-label={`${mobileFamily.label} programs`}
        >
          {mobilePrograms.map(({ program, index }) => {
            const isOpen = index === mobileActive
            const controlId = `mobile-program-control-${index}`
            const panelId = `mobile-program-panel-${index}`

            return (
              <li
                key={program.name}
                className={styles.mobileProgram}
                data-active={isOpen ? 'true' : 'false'}
                data-material={mobileFamily.material}
              >
                <button
                  type="button"
                  id={controlId}
                  className={styles.mobileProgramControl}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setMobileActive(index)}
                >
                  <span className={styles.mobileProgramIndex}>
                    {pad(index + 1)} / {pad(readingOrder.length)}
                  </span>
                  <span className={styles.mobileProgramName}>{program.name}</span>
                  <span className={styles.mobileProgramToggle} aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen ? (
                  <div
                    id={panelId}
                    className={styles.mobileProgramPanel}
                    role="region"
                    aria-labelledby={controlId}
                  >
                    <p className={styles.mobileProgramNote}>{program.note}</p>
                    <Link
                      href={`/contact?program=${encodeURIComponent(program.name)}`}
                      className={styles.mobileDiscuss}
                    >
                      <span>Discuss this program</span>
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>
      <LayoutGroup id="calypso-programs">
        <div className={styles.index}>
          {calypsoProgramFamilies.map((family) => {
            const members = readingOrder
              .map((program, index) => ({ program, index }))
              .filter(({ program }) => program.family === family.id)

            return (
              <section
                key={family.id}
                className={styles.family}
                data-material={family.material}
              >
                <header className={styles.familyHead}>
                  <h3>{family.label}</h3>
                  <span className={styles.familyCount}>
                    {pad(members.length)}{' '}
                    {members.length === 1 ? 'program' : 'programs'}
                  </span>
                  <p>{family.note}</p>
                </header>

                <ul role="tablist" aria-label={family.label}>
                  {members.map(({ program, index }) => (
                    <li key={program.name} role="presentation">
                      <button
                        ref={(node) => {
                          refs.current[index] = node
                        }}
                        type="button"
                        role="tab"
                        id={`program-tab-${index}`}
                        className={styles.row}
                        aria-selected={index === active}
                        aria-controls="program-detail"
                        tabIndex={index === active ? 0 : -1}
                        data-active={index === active || undefined}
                        onClick={() => select(index)}
                        onKeyDown={(event) => onKeyDown(event, index)}
                      >
                        {/* The one mark. It leaves this row and arrives at the
                            next rather than blinking off and on. */}
                        {index === active ? (
                          <motion.span
                            className={styles.indicator}
                            layoutId="calypso-program-indicator"
                            transition={reduced ? { duration: 0 } : indicatorSpring}
                            aria-hidden="true"
                            data-testid="program-indicator"
                          />
                        ) : null}
                        <span className={styles.rowIndex}>{pad(index + 1)}</span>
                        <span className={styles.rowName}>{program.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </LayoutGroup>

      <div className={styles.detailColumn} data-visible-from="768px">
        {/*
          The region never remounts. It used to take the program name as its
          key, which replaced the live region on every selection, and a live
          region that has just been inserted has nothing to announce.
        */}
        <div
          className={styles.detail}
          id="program-detail"
          role="tabpanel"
          aria-live="polite"
          aria-labelledby={`program-tab-${active}`}
        >
          <div className={styles.detailStack}>
            <div className={styles.detailSizer} aria-hidden="true">
              {readingOrder.map((program) => (
                <div key={program.name}>
                  <Entry program={program} />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.name}
                className={styles.detailBody}
                data-testid="program-detail-body"
                initial="hidden"
                animate="shown"
                exit="exit"
              >
                <Entry program={current} variants={variants} heading />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.detailFoot}>
            <Link
              href={`/contact?program=${encodeURIComponent(current.name)}`}
              className={styles.discuss}
            >
              <span>Discuss this program</span>
              <ArrowUpRight size={15} />
            </Link>

            <div className={styles.line} aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current.name}
                  className={styles.detailCount}
                  variants={variants}
                  custom={3}
                  initial="hidden"
                  animate="shown"
                  exit="exit"
                >
                  {pad(active + 1)}
                  <i>/</i>
                  {pad(readingOrder.length)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      <div className={styles.domains}>
        <p className={styles.domainsHead}>
          <span>{calypsoContent.domains.label}</span>
          <strong>Six product domains</strong>
        </p>
        <ul className={styles.domainList} aria-label="Product domains">
          {calypsoDomains.map((domain, index) => (
            <li key={domain.name} className={styles.domain}>
              <span className={styles.domainIndex}>{pad(index + 1)}</span>
              <div className={styles.domainCore}>
                <strong className={styles.domainName}>{domain.name}</strong>
                <p className={styles.domainNote}>{domain.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
