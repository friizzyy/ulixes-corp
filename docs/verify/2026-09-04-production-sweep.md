# Ulixes production sweep, 4 September 2026

Release branch: `codex/site-motion-and-programs-grid`, fast-forward onto `origin/main`.
Local verification target: `http://localhost:3120`, production build of the exact release tree.

## Source of truth

Three servers were running and only one served current code. Proven before any change:

| Surface | Checkout | Commit | Current |
| --- | --- | --- | ---: |
| `:3100` (dev) | `.codex/worktrees/5dbb` | `074baa2` | no |
| `:3110` (prod build) | `.codex/worktrees/5dbb` | `074baa2` | no |
| `:3120` | `/private/tmp/ulixes-motion-232022` | release head | yes |
| `origin/main` | remote | `e980127` | no |
| production | Vercel | `e980127` | no |

The tree was rebuilt from a removed `.next` before auditing, so no stale build was measured.

## What changed

Seven commits. Beyond the mobile compositions for Contact, Privacy and Terms and the
site-wide motion vocabulary, this sweep corrected:

- **Calypso programs grid.** The product-domain register sat in an unspanned second row and
  could not start until the taller program index finished, opening a 225 to 265px hole under
  the detail card at every desktop width. The index now spans both rows.
- **Services hero contrast.** Its veil began at 4% opacity where every other image-led hero
  lifts the top of the frame, so the menu control and the Mandate link measured under 4.5:1
  across 92 to 100 percent of their pixels. Now 7.0 to 12.7 mean contrast with no failing
  pixels, photograph intact.
- **Hero eyebrows.** The first line of copy on the site measured under 2:1 on the tower glass
  and on the travertine. Darkened to ink on both routes rather than veiling the photographs.
- **LinkedIn action.** A boxed button in one of four places and a bare text link in the other
  three. Now a real secondary button everywhere: same chassis and chamber as the primary,
  52px, external-link indication, subordinate by border and ground.
- **Services hero actions.** Rendered at 0.9rem because their mobile rules tied with the
  global `.ed-primary` and lost on source order, wrapping "Discuss a mandate" onto three
  lines at 320px. Both labels now resolve to one line from 375px up.
- **Disclosure discoverability.** A flat row whose only affordance was a 10px chevron. The
  chevron now sits in a chamber matching the button vocabulary, the open row inverts it, and
  each register states its instruction.
- **Calypso chapter reveals.** Both below-fold headings were bare `<Curtain>`, mount-triggered,
  finishing off-screen before a reader arrived. Now `inView`, matching every other route.
- **Services phase pager.** Wrapped silently from phase one to four and back, on a page about
  sequence, while both other pagers clamp. Now clamps and disables.
- **In-page anchors.** `#expertise` and `#capabilities` had no scroll margin and landed under
  the fixed header. Both now clear it at 375 and 1440.
- **Contact form accessibility.** No real focus ring (outline none, 1px border at ~1.8:1,
  failing WCAG 2.4.11); the invalid border was repainted by focus on the very field the reader
  was sent to; required fields were not programmatically required. All three corrected.
- **Index numeral contrast.** 1.99:1, 2.96:1 and 2.40:1 on flat grounds, raised to 4.78, 15.83
  and 3.54 with the smallest alpha change clearing each threshold.
- **Duplicate landmarks.** The detail sheet rendered a header and footer inside its dialog,
  duplicating banner and contentinfo while open. This was the only true axe violation found
  anywhere, invisible to a default-state scan.
- **Unfinished underlines.** The partial hover underline rested at ~26% on touch, where no
  hover completes it, across the legal pages and two Calypso links. Now rests drawn and quiet.
- **Tablet reading measure.** Leads ran to 100 and 103 characters at 895px. Capped so phones
  are unaffected.

## Evidence

- Unit and component tests: **255 / 255**, 34 files.
- ESLint, TypeScript, internal link check across 9 routes: clean.
- Dependency audit (offline advisory data): **zero vulnerabilities**.
- Production build: **12 routes**.
- Browser verification: **1,410 / 1,410 checks, zero failures**, 650 screenshots, 2 traces.
- Accessibility: **24 axe runs, zero violations**. Zero console errors, zero page errors,
  zero failed resources, zero contact submissions.
- Lighthouse, 9 audits: **accessibility, best practices and SEO 1.00 in every audit**.
  Performance 0.84 to 1.00.
- Horizontal overflow: **zero across 623 width samples**, 320 to 1728 in 16px steps, 7 routes.
- Mobile heading rule: **zero violations across 273 width samples**, 320 to 895 in 15px steps,
  measured from real rendered line geometry after font load.
- Deep link `?stage=reporting` selects stage 7 fully visible. Mobile menu opens with body lock
  and focus moved inside; Escape closes, restores focus and unlocks.
- 404 renders with a correct heading, no overflow, no errors. `/about` and `/philosophy` 308.

## Independent critics

Three fresh-context critics reviewed correctness and accessibility, visual composition, and
mobile ambition, given only captures and evidence.

**Verified and fixed:** hero eyebrow contrast, anchor occlusion, contact focus ring, invalid
state under focus, index numeral contrast, duplicate landmarks, prohibited `aria-label` on
role-less divs, Calypso mount-triggered reveals, Services pager wrap.

**Investigated and dismissed with evidence:**

- *"Experience carousel first card is clipped at rest, BLOCKER."* The rail is an intentional
  continuous drift at about 18px per second. Sampled over 5.6s: 5, 17, 30, 43, 55, 68, 81, 93.
  Under `prefers-reduced-motion: reduce` it parks at `scrollLeft: 0` with card 01 at its full
  46px offset. The critic sampled a moving marquee at two arbitrary moments.
- *"Detail sheet dialog is unnamed and not modal."* The dialog carries `role="dialog"`,
  `aria-modal="true"` and `aria-labelledby`. The measurement was taken on the outer wrapper.
- *"Video fails to load."* `ERR_ABORTED` is the browser cancelling a range request. Mobile
  never loads the video at all (`hasSrc: false`); desktop plays it (`readyState: 4`).

**Accepted, not actioned.** Several composition findings propose restructuring approved
compositions: the Services hero architecture, restoring a mid-page photograph to mobile Home,
enlarging the Experience mobile portrait, and adding a Contact hero. The mobile portrait
placement and ratio are fixed by the design contract, and mobile deliberately conserves
vertical space. These are design direction, not defects, and were left for the owner.

**Remaining minor, documented.** Index row title and description columns are independently
centred so their baselines drift by up to 27px on rows with unequal line counts; the index
row arrow sits about 16px left of its chamber centre; the Terms contents chip wraps on
"Intellectual Property" at 768; two stat cells orphan a final word at 375. None reduce
accessibility or usability.

**Accepted minor, unchanged by design.** At 320px the seven Calypso lifecycle stages hold
their 44px width and overflow the rail by 22px, contained with no document overflow. The
selected stage is fully visible in both entry states, `?stage=reporting` scrolls correctly,
and the condition exists only below about 342px. The peeking stage is itself the scroll
affordance; an overlay cue would dim the control it advertises, and fitting seven controls
into 286px requires 40.8px, below the touch floor.

## Artifacts

Browser results, axe, console and network JSON, 650 screenshots, 2 traces, Lighthouse reports
and both contact sheets are under the sweep's gate directory. The re-runnable harness is
`docs/verify/2026-09-03-mobile-control-brief/`.
