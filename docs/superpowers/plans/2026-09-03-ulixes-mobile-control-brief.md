# Ulixes Mobile Control Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn every dense Ulixes route into a deliberately edited, company-ready mobile briefing experience while preserving verified content and the full desktop site.

**Architecture:** Existing typed content remains the single source of truth. Desktop compositions stay intact, while small client leaves render mobile selectors, pagers, and an accessible detail sheet through `895px`; the same mobile leaves receive two-pane tablet styling from `768px` through `895px`. Shared behavior lives in focused UI primitives, and route modules own their content hierarchy and art direction.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Tailwind CSS 3, existing Framer Motion 11, Vitest, Testing Library, Playwright-compatible browser verification tooling.

**Spec:** `docs/superpowers/specs/2026-09-03-ulixes-mobile-control-brief-design.md`

## Global Constraints

- Mobile composition is authoritative through `895px`; full desktop composition begins at `896px` unless a verified narrow-desktop exception is documented in the task report.
- Use a `20px` phone gutter, `16px` below `360px`, `48px` to `64px` section rhythm, `38px` to `44px` h1, `28px` to `34px` h2, and `16px` minimum body copy.
- Important controls are at least `44px` in both dimensions and account for safe-area insets.
- Do not add dependencies, animate layout dimensions, attach unthrottled scroll handlers, or introduce swipe-only navigation.
- Preserve verified copy, contact API behavior, existing URLs, reduced-motion behavior, and the mobile video opt-in.
- Keep all hidden desktop or mobile variants out of the opposing breakpoint's focus order through CSS `display: none`.
- Use no generic card grids, decorative glow, content-free motion, or repeated rounded containers.
- Preserve unrelated untracked files. Stage and commit only files named by the active task.

---

### Task 1: Shared detail sheet, strict disclosure mode, and mobile breakpoint contract

**Files:**
- Create: `src/components/ui/mobile-detail-sheet.tsx`
- Create: `src/components/ui/mobile-detail-sheet.module.css`
- Create: `src/components/ui/mobile-detail-sheet.test.tsx`
- Modify: `src/components/ui/mobile-disclosure.tsx`
- Modify: `src/components/ui/mobile-disclosure.module.css`
- Modify: `src/components/ui/mobile-disclosure.test.tsx`
- Modify: `src/components/ui/index.ts`
- Modify: `src/styles/editorial.css`

**Interfaces:**
- Produces `MobileDetailSheet({ open, onClose, eyebrow, title, children, footer, className })`.
- Adds `allowCollapse?: boolean` to `MobileDisclosure`, defaulting to `true`.
- `allowCollapse={false}` guarantees exactly one selected item while items are present.
- Mobile primitives display through `895px` and disappear at `896px`.

- [ ] **Step 1: Write failing primitive tests**

  Add behavior tests that name the failures they prevent:

  ```tsx
  it('moves focus into the sheet and restores it to the trigger on close', async () => {
    const user = userEvent.setup()
    render(<SheetHarness />)
    const trigger = screen.getByRole('button', { name: 'View control detail' })
    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Close detail' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('keeps one disclosure selected when collapse is disabled', async () => {
    const user = userEvent.setup()
    render(<MobileDisclosure ariaLabel="Phases" items={items} allowCollapse={false} />)
    const first = screen.getByRole('button', { name: /first/i })
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
  })
  ```

- [ ] **Step 2: Run the focused tests and verify red**

  Run: `npx vitest run src/components/ui/mobile-detail-sheet.test.tsx src/components/ui/mobile-disclosure.test.tsx`

  Expected: the sheet import fails and `MobileDisclosure` does not accept or enforce `allowCollapse`.

- [ ] **Step 3: Implement the shared behavior**

  Use this public type contract:

  ```tsx
  export type MobileDetailSheetProps = {
    open: boolean
    onClose: () => void
    eyebrow?: string
    title: string
    children: ReactNode
    footer?: ReactNode
    className?: string
  }
  ```

  The sheet must save the opening element, lock body scrolling without losing the previous scroll position, focus its close button, trap Tab within its controls, close on Escape or backdrop activation, clean up every listener, and restore focus. The surface is capped at `84dvh`; animation uses only opacity and translate and becomes immediate under reduced motion.

  Update `MobileDisclosure` so active-control click and Escape collapse only when `allowCollapse` is true. Change its hash media query and CSS visibility ceiling from `767px` to `895px`.

- [ ] **Step 4: Run focused tests and static checks**

  Run: `npx vitest run src/components/ui/mobile-detail-sheet.test.tsx src/components/ui/mobile-disclosure.test.tsx && npx tsc --noEmit --incremental false`

  Expected: pass with no leaked body styles or listeners after close/unmount.

- [ ] **Step 5: Commit Task 1**

  ```bash
  git add src/components/ui/mobile-detail-sheet.tsx src/components/ui/mobile-detail-sheet.module.css src/components/ui/mobile-detail-sheet.test.tsx src/components/ui/mobile-disclosure.tsx src/components/ui/mobile-disclosure.module.css src/components/ui/mobile-disclosure.test.tsx src/components/ui/index.ts src/styles/editorial.css
  git commit -m "feat: add mobile control brief primitives"
  ```

---

### Task 2: Mobile shell and homepage editorial reduction

**Files:**
- Modify: `src/components/layout/navigation.tsx`
- Modify: `src/components/layout/navigation.test.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/components/layout/footer.test.tsx`
- Create: `src/components/home/mobile-capability-index.tsx`
- Create: `src/components/home/mobile-capability-index.test.tsx`
- Modify: `src/components/home/homepage.tsx`
- Modify: `src/components/home/homepage.module.css`
- Modify: `src/components/home/homepage.test.tsx`

**Interfaces:**
- `MobileCapabilityIndex` consumes `serviceModules` and opens the shared detail sheet for one capability.
- Homepage retains one desktop capability ledger at `896px` and wider and one mobile capability index below it.
- The navigation keeps its existing public API and focus behavior.

- [ ] **Step 1: Write failing shell and homepage tests**

  Require a mobile header action, menu availability through the touch breakpoint, four capability triggers, one sheet at a time, all four verified descriptions reachable, and all service links preserved.

  ```tsx
  it('opens one capability brief without rendering four descriptions at rest', async () => {
    const user = userEvent.setup()
    render(<MobileCapabilityIndex items={serviceModules} />)
    expect(screen.queryByText(serviceModules[0].description)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /implementation oversight/i }))
    expect(screen.getByRole('dialog')).toHaveTextContent(serviceModules[0].description)
  })
  ```

- [ ] **Step 2: Run the focused tests and verify red**

  Run: `npx vitest run src/components/layout/navigation.test.tsx src/components/layout/footer.test.tsx src/components/home/mobile-capability-index.test.tsx src/components/home/homepage.test.tsx`

  Expected: missing mobile index and missing touch-breakpoint shell contracts.

- [ ] **Step 3: Implement the dedicated mobile capability index**

  The collapsed row shows only index, title, scope, and a clear detail affordance. The sheet shows description and a `Discuss this capability` link. Keep the existing desktop ledger untouched and render the mobile index beside it with breakpoint-exclusive CSS.

- [ ] **Step 4: Recompose the mobile homepage**

  Keep the skyline threshold and proof register, but reduce their combined height. Remove service descriptions from the main scroll. Compress the Calypso signal to a three-office continuity statement and one action. Reduce practitioner copy to the headline, one proof paragraph, two checkpoint rows, and the profile link. Keep the full copy in its deeper route or capability sheet.

  Change only the mobile and touch blocks in `homepage.module.css`; do not alter the verified desktop composition without a captured regression reason. Target a collapsed `375px` document height at least `35%` shorter than the recorded pre-redesign `4305px` baseline, excluding the shared footer.

- [ ] **Step 5: Extend the shell through the touch breakpoint**

  Replace Tailwind `md:` visibility switches in Navigation with explicit `min-[896px]:` switches. Keep the sheet below the header, current-route marker, focus trap, body lock, and safe-area action. Ensure the footer remains compact and readable at `768px` without forcing the wide desktop row.

- [ ] **Step 6: Run focused tests and checks**

  Run: `npx vitest run src/components/layout/navigation.test.tsx src/components/layout/footer.test.tsx src/components/home/mobile-capability-index.test.tsx src/components/home/homepage.test.tsx src/components/home/home-primitives.test.tsx && npm run lint`

  Expected: pass.

- [ ] **Step 7: Commit Task 2**

  ```bash
  git add src/components/layout/navigation.tsx src/components/layout/navigation.test.tsx src/components/layout/footer.tsx src/components/layout/footer.test.tsx src/components/home/mobile-capability-index.tsx src/components/home/mobile-capability-index.test.tsx src/components/home/homepage.tsx src/components/home/homepage.module.css src/components/home/homepage.test.tsx
  git commit -m "feat: recompose the mobile homepage"
  ```

---

### Task 3: Services capability focus and process pager

**Files:**
- Create: `src/components/services/mobile-process-pager.tsx`
- Create: `src/components/services/mobile-process-pager.module.css`
- Create: `src/components/services/mobile-process-pager.test.tsx`
- Modify: `src/components/services/services-page.tsx`
- Modify: `src/components/services/services-page.module.css`
- Modify: `src/components/services/services-page.test.tsx`

**Interfaces:**
- `MobileProcessPager` consumes `servicesContent.approach.steps` and maintains one active phase.
- Services capability disclosure uses `allowCollapse={false}`.
- Desktop `ApproachLine` stays intact and breakpoint-exclusive.

- [ ] **Step 1: Write failing service interaction tests**

  Assert four capability controls always retain one open item, four phase controls expose one selected phase, ArrowLeft/ArrowRight and direct selection work, and all descriptions remain reachable.

  ```tsx
  it('shows exactly one process phase and advances it with the next control', async () => {
    const user = userEvent.setup()
    render(<MobileProcessPager steps={servicesContent.approach.steps} />)
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Next phase' }))
    expect(screen.getByText(servicesContent.approach.steps[1].description)).toBeVisible()
  })
  ```

- [ ] **Step 2: Run the focused tests and verify red**

  Run: `npx vitest run src/components/services/mobile-process-pager.test.tsx src/components/services/services-page.test.tsx`

  Expected: missing pager module and collapsible-to-zero capability behavior.

- [ ] **Step 3: Implement the process pager and route composition**

  Render four `44px` numbered phase controls, one active title and concise description, position text, and previous/next controls. Use a directional `200ms` transform/opacity transition. Place full phase detail in the shared sheet only if the source contains supporting detail beyond the visible description.

  Hide `ApproachLine` below `896px`; show the pager. Extend capability disclosure and route-specific phone styling through `895px`, with a two-column active-detail layout at tablet widths where it reduces height.

- [ ] **Step 4: Run focused tests and checks**

  Run: `npx vitest run src/components/services/mobile-process-pager.test.tsx src/components/services/services-page.test.tsx && npx tsc --noEmit --incremental false && npm run lint`

  Expected: pass.

- [ ] **Step 5: Commit Task 3**

  ```bash
  git add src/components/services/mobile-process-pager.tsx src/components/services/mobile-process-pager.module.css src/components/services/mobile-process-pager.test.tsx src/components/services/services-page.tsx src/components/services/services-page.module.css src/components/services/services-page.test.tsx
  git commit -m "feat: focus the mobile services journey"
  ```

---

### Task 4: Institutional Experience mobile readers

**Files:**
- Create: `src/components/experience/mobile-institution-reader.tsx`
- Create: `src/components/experience/mobile-institution-reader.module.css`
- Create: `src/components/experience/mobile-institution-reader.test.tsx`
- Modify: `src/components/experience/institution-carousel.tsx`
- Modify: `src/components/experience/institution-carousel.module.css`
- Modify: `src/components/experience/institution-carousel.test.tsx`
- Modify: `src/app/institutional-experience/page.tsx`
- Modify: `src/app/institutional-experience/institutional-experience.module.css`
- Modify: `src/app/institutional-experience/page.test.tsx`
- Delete if unused after source search: `src/components/ui/mobile-rail-progress.tsx`
- Delete if unused after source search: `src/components/ui/mobile-rail-progress.module.css`
- Delete if unused after source search: `src/components/ui/mobile-rail-progress.test.tsx`

**Interfaces:**
- Mobile institution reader consumes `institutionalExperienceContent.institutions.categories`.
- Desktop carousel and its motion stay unchanged at `896px` and wider.
- Working positions use `allowCollapse={false}` and show one active principle.

- [ ] **Step 1: Write failing reader tests**

  Require seven compact institution controls, only one mounted description, direct and previous/next selection, visible position text, and all seven descriptions reachable. Preserve existing desktop-carousel tests separately.

  ```tsx
  it('keeps the institution index complete while mounting one brief', async () => {
    const user = userEvent.setup()
    render(<MobileInstitutionReader categories={categories} />)
    expect(screen.getAllByRole('button', { name: /institution/i })).toHaveLength(7)
    expect(screen.getAllByTestId('institution-description')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: categories[3].name }))
    expect(screen.getByTestId('institution-description')).toHaveTextContent(categories[3].description)
  })
  ```

- [ ] **Step 2: Run the focused tests and verify red**

  Run: `npx vitest run src/components/experience/mobile-institution-reader.test.tsx src/components/experience/institution-carousel.test.tsx src/app/institutional-experience/page.test.tsx`

  Expected: missing reader module and seven full descriptions still mounted in the phone rail.

- [ ] **Step 3: Implement the dedicated reader**

  Use a compact selector with a visible selected state and one active institution brief. At narrow phone widths, show a short horizontal name selector with visible previous/next buttons; at tablet widths, use a narrow index beside the active brief. Do not carry desktop drift or card transforms into the mobile reader.

- [ ] **Step 4: Recompose the route**

  Keep copy before portrait and retain the architectural threshold. Reduce portrait and proof height where needed. Replace the phone carousel with the reader and keep the desktop carousel separate. Set Working Positions to exact-one mode, showing only the selected description. Remove `MobileRailProgress` only after `rg` proves no consumer remains.

- [ ] **Step 5: Run focused tests and checks**

  Run: `npx vitest run src/components/experience/mobile-institution-reader.test.tsx src/components/experience/institution-carousel.test.tsx src/app/institutional-experience/page.test.tsx && npm run lint`

  Expected: pass.

- [ ] **Step 6: Commit Task 4**

  ```bash
  git add src/components/experience src/app/institutional-experience src/components/ui/index.ts
  git add -u src/components/ui/mobile-rail-progress.tsx src/components/ui/mobile-rail-progress.module.css src/components/ui/mobile-rail-progress.test.tsx
  git commit -m "feat: build mobile institutional readers"
  ```

---

### Task 5: Nasdaq Calypso stage pager and compact program book

**Files:**
- Create: `src/components/calypso/mobile-lifecycle-pager.tsx`
- Create: `src/components/calypso/mobile-lifecycle-pager.module.css`
- Create: `src/components/calypso/mobile-lifecycle-pager.test.tsx`
- Modify: `src/components/calypso/lifecycle-blotter.tsx`
- Modify: `src/components/calypso/lifecycle-blotter.module.css`
- Modify: `src/components/calypso/lifecycle-blotter.test.tsx`
- Modify: `src/components/calypso/calypso-programs.tsx`
- Modify: `src/components/calypso/calypso-programs.module.css`
- Modify: `src/components/calypso/calypso-programs.test.tsx`
- Modify: `src/components/calypso/calypso-hero.module.css`
- Create: `src/components/calypso/mobile-mandate-selector.tsx`
- Create: `src/components/calypso/mobile-mandate-selector.module.css`
- Create: `src/components/calypso/mobile-mandate-selector.test.tsx`
- Modify: `src/app/nasdaq-calypso/page.tsx`
- Modify: `src/app/nasdaq-calypso/nasdaq-calypso.module.css`
- Modify: `src/app/nasdaq-calypso/page.test.tsx`
- Modify: `src/app/nasdaq-calypso/nasdaq-calypso-responsive.test.ts`

**Interfaces:**
- `MobileLifecyclePager` receives existing `chainStages` and `calypsoContent.schematic` data.
- Stage selection keeps `?stage=<id>` deep links and browser history behavior.
- Desktop `LifecycleBlotter` keeps its current master-detail workbench at `896px` and wider.
- Mobile Programs keeps three family controls, one selected program, and a sheet for six product domains.

- [ ] **Step 1: Write failing lifecycle tests**

  Test seven direct stage controls, one active summary, previous/next boundaries, arrow-key selection, URL initialization, URL updates, popstate restoration, sheet detail content, focus return, and reduced-motion behavior.

  ```tsx
  it('keeps deep evidence out of the page until the active stage sheet opens', async () => {
    const user = userEvent.setup()
    render(<MobileLifecyclePager />)
    expect(screen.queryByText(/Built from/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View control detail' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Built from')
    expect(screen.getByRole('dialog')).toHaveTextContent('Depends on')
    expect(screen.getByRole('dialog')).toHaveTextContent('Hands on')
  })
  ```

- [ ] **Step 2: Run lifecycle tests and verify red**

  Run: `npx vitest run src/components/calypso/mobile-lifecycle-pager.test.tsx src/components/calypso/lifecycle-blotter.test.tsx`

  Expected: missing mobile pager and deep evidence still mounted in the primary mobile workbench.

- [ ] **Step 3: Implement the lifecycle pager**

  Render a seven-segment scrubber, one active stage identity, office, `What happens here`, `Where it breaks`, position, previous/next actions, and `View control detail`. Put object list, dependencies, and hands-on detail in `MobileDetailSheet`. Keep selection logic in the new client leaf and preserve URL history. Use a stable fixed minimum content area so stage changes do not jump the surrounding page.

  Render the new pager only through `895px`. Render the existing desktop workbench only at `896px` and above. The compact pager after its introduction must remain near `520px` at `375px` without clipping.

- [ ] **Step 4: Write failing program and mandate tests**

  Require one selected program note, eight reachable programs, three family controls, domains absent from the main phone flow until the domain sheet opens, all six domains in the sheet, and four compact mandate triggers with only one risk statement mounted.

- [ ] **Step 5: Run content tests and verify red**

  Run: `npx vitest run src/components/calypso/calypso-programs.test.tsx src/components/calypso/mobile-mandate-selector.test.tsx src/app/nasdaq-calypso/page.test.tsx src/app/nasdaq-calypso/nasdaq-calypso-responsive.test.ts`

  Expected: six domains and all four mandate risks remain visible in the primary phone flow.

- [ ] **Step 6: Implement the compact program and mandate layers**

  Keep three family controls and compact program rows. Mount one program note. Replace the phone domain register with a `View product domains` trigger and sheet. Keep the desktop domain register unchanged. Implement `MobileMandateSelector` so all four titles and scopes remain visible while exactly one selected risk statement is mounted. Preserve every existing contact link.

  Tighten only the Calypso mobile hero, program-book, mandate, and close spacing. Preserve the desktop visual system.

- [ ] **Step 7: Run focused tests and checks**

  Run: `npx vitest run src/components/calypso/mobile-lifecycle-pager.test.tsx src/components/calypso/lifecycle-blotter.test.tsx src/components/calypso/calypso-programs.test.tsx src/components/calypso/mobile-mandate-selector.test.tsx src/app/nasdaq-calypso/page.test.tsx src/app/nasdaq-calypso/nasdaq-calypso-responsive.test.ts && npx tsc --noEmit --incremental false && npm run lint`

  Expected: pass.

- [ ] **Step 8: Commit Task 5**

  ```bash
  git add src/components/calypso src/app/nasdaq-calypso
  git commit -m "feat: rebuild Calypso for mobile"
  ```

---

### Task 6: Contact target polish and whole-site breakpoint sweep

**Files:**
- Modify only if rendered evidence identifies a defect: `src/components/contact/contact-page.tsx`
- Modify only if rendered evidence identifies a defect: `src/components/contact/contact.module.css`
- Modify only if rendered evidence identifies a defect: `src/components/contact/contact-page.test.tsx`
- Modify only if rendered evidence identifies a defect: `src/components/legal/legal.module.css`
- Modify: route CSS files touched in Tasks 2 through 5 as required by the sweep

**Interfaces:**
- Contact API and submission state machine remain unchanged.
- Direct contact rows become full-row targets only if the rendered sweep confirms the current text-only target is materially hard to use.

- [ ] **Step 1: Run the existing contact and legal safety tests**

  Run: `npx vitest run src/components/contact/contact-page.test.tsx src/components/contact/contact-responsive.test.ts src/components/legal/legal-page.test.tsx src/components/legal/status-page.test.tsx src/app/api/contact/route.test.ts`

  Expected: pass before responsive-only edits.

- [ ] **Step 2: Inspect every route at boundary widths**

  Verify `320`, `375`, `390`, `430`, `768`, `895`, `896`, `1024`, and `1440` widths. Record page height, page `scrollWidth`, clipped text, fixed-element overlap, breakpoint double-rendering, 44px target compliance, and focus-ring clipping.

- [ ] **Step 3: Fix only observed breakpoint defects**

  Keep fixes inside existing route media blocks or the shared tokens. Do not change contact submission code. Add a regression test before every behavioral fix and a source contract only when the failure is purely CSS and cannot be observed in jsdom.

- [ ] **Step 4: Run route safety tests**

  Run: `npx vitest run src/components/contact/contact-page.test.tsx src/components/contact/contact-responsive.test.ts src/components/legal/legal-page.test.tsx src/components/legal/status-page.test.tsx src/components/layout/navigation.test.tsx src/components/layout/footer.test.tsx`

  Expected: pass.

- [ ] **Step 5: Commit Task 6 if files changed**

  ```bash
  git add src/components/contact src/components/legal src/components/layout src/styles src/components/home src/components/services src/components/experience src/components/calypso src/app/institutional-experience src/app/nasdaq-calypso
  git commit -m "fix: refine responsive route boundaries"
  ```

---

### Task 6.5: Editorial heading rhythm and first-pass verification fixes

**Files:**
- Modify: `src/components/home/homepage.tsx`
- Modify: `src/components/home/homepage.module.css`
- Modify: `src/components/home/homepage.test.tsx`
- Modify: `src/components/services/services-page.tsx`
- Modify: `src/components/services/services-page.module.css`
- Modify: `src/components/services/services-page.test.tsx`
- Modify: `src/components/services/approach-line.module.css`
- Modify: `src/app/institutional-experience/page.tsx`
- Modify: `src/app/institutional-experience/institutional-experience.module.css`
- Modify: `src/app/institutional-experience/page.test.tsx`
- Modify: `src/components/experience/mobile-institution-reader.module.css`
- Modify: `src/components/experience/mobile-institution-reader.test.tsx`
- Modify: `src/app/nasdaq-calypso/page.tsx`
- Modify: `src/app/nasdaq-calypso/nasdaq-calypso.module.css`
- Modify: `src/app/nasdaq-calypso/nasdaq-calypso-responsive.test.ts`
- Modify: `src/components/calypso/mobile-lifecycle-pager.tsx`
- Modify: `src/components/calypso/mobile-lifecycle-pager.module.css`
- Modify: `src/components/calypso/mobile-lifecycle-pager.test.tsx`
- Modify: `src/components/calypso/calypso-programs.module.css`

**Interfaces:**
- Centered editorial title groups are explicitly marked while nearby long-form copy and operational controls retain a left reading edge.
- The mobile and desktop composition boundary remains `895/896px`.
- URL-selected lifecycle segments reveal horizontally without changing vertical page position.

- [ ] **Step 1: Add red regression coverage**

  Cover the approved heading-composition map, forbid stale `899px` seams, require compliant dark-surface contrast, require URL-selected lifecycle visibility at `320px`, and require the Experience reader to remain height-stable across every category.

- [ ] **Step 2: Implement the composition map**

  Center the Home Capabilities title group, Services dark-chapter thesis, Experience Working Positions title group, and Calypso Programs title group. Keep adjacent ledes, ledgers, selectors, and long-form copy left-aligned. Mirror the Calypso Mandates introduction only on desktop.

- [ ] **Step 3: Resolve first-pass browser findings**

  Raise only the failing Services and Calypso text colors to WCAG AA, reveal selected lifecycle segments within their horizontal rail, stabilize the Experience reader, and normalize route seams to `895px`.

- [ ] **Step 4: Verify and commit**

  Run focused tests, the full suite, TypeScript, lint, link verification, build, diff checks, axe, and rendered checks at `320`, `375`, `768`, `895`, `896`, and `1440`. Confirm no horizontal overflow and no meaningful mobile page-height increase.

  ```bash
  git add docs/superpowers src/components/home src/components/services src/components/experience src/components/calypso src/app/institutional-experience src/app/nasdaq-calypso
  git commit -m "fix: vary editorial heading compositions"
  ```

---

### Task 7: Automated, visual, accessibility, and performance verification

**Files:**
- Create: `docs/verify/2026-09-03-mobile-control-brief/`
- Create: `docs/verify/2026-09-03-mobile-control-brief/verification.md`
- Modify only when a verified issue requires it: files from Tasks 1 through 6

**Interfaces:**
- Produces a complete evidence report, overview contact sheet, interaction contact sheet, console and overflow results, performance summary, and critic resolution log.

- [ ] **Step 1: Run the complete automated gate**

  ```bash
  npm run test:run
  npm run lint
  npx tsc --noEmit --incremental false
  npm run verify:links
  npm audit
  npm ci --dry-run
  npm run build
  git diff --check
  ```

  Expected: every command exits `0`; Vitest reports zero failed tests and the production build emits every intended route.

- [ ] **Step 2: Drive every public route**

  At `375`, `768`, and `1440`, capture at rest, stepped full scroll, and full-page overviews. At `320`, `390`, `430`, `895`, `896`, and `1024`, perform targeted overflow and breakpoint checks. Exercise navigation, every selector, every disclosure, every detail sheet, Calypso URL state, contact validation, keyboard navigation, and reduced motion.

- [ ] **Step 3: Capture performance and accessibility evidence**

  Run mobile Lighthouse on every public route and desktop Lighthouse on Home and Nasdaq Calypso. Capture full-scroll traces on Home and Nasdaq Calypso. Require no accessibility audit failure, no console error, no broken image, and no layout shift caused by mobile state changes.

- [ ] **Step 4: Dispatch independent critics**

  Send the captures, trace summary, console output, changed-file list, and no design rationale to fresh correctness, composition, and ambition reviewers. Deduplicate findings by route and location. Fix every blocker and major issue, then rerun affected tests and captures. Stop after three review rounds and report any remaining minor issue.

- [ ] **Step 5: Write and record the verification report**

  Include before and after page-height comparisons, viewport matrix, resolved findings, and overview plus interaction contact sheets. Then run:

  ```bash
  node "/Users/clawd/.codex/plugins/cache/ju-web/ju-web/0.1.0/scripts/record-verify.mjs" "$(pwd)"
  ```

- [ ] **Step 6: Commit verification evidence**

  ```bash
  git add docs/verify/2026-09-03-mobile-control-brief
  git commit -m "test: verify mobile control brief redesign"
  ```

---

### Task 8: Integrate, push, deploy, and verify production

**Files:**
- No source file is expected unless production verification finds an environment-specific defect.

- [ ] **Step 1: Re-run release-critical checks on the exact commit**

  Run: `npm run test:run && npm run lint && npx tsc --noEmit --incremental false && npm run build && git status --short`

  Expected: zero failures and only preserved unrelated untracked files.

- [ ] **Step 2: Integrate into `main` without discarding unrelated local work**

  Resolve the current remote and local branch relationship, fetch, and use a non-destructive fast-forward, merge, or clean release worktree. Never reset the user's main checkout or overwrite its unrelated commits.

- [ ] **Step 3: Push and deploy using the repository's existing production path**

  Push `main`, wait for the production deployment, and retain the previous deployment identifier for rollback.

- [ ] **Step 4: Verify the public site**

  Confirm the deployed commit, load every public route at phone and desktop widths, exercise one representative interaction of each new type, check console and network failures, and report the production URL plus rollback target.
