# Ulixes Mobile Control Brief Design

Date: 2026-09-03  
Branch: `codex/institutional-experience-premium`  
Reference build: `http://localhost:3100`  
Approved direction: Control Brief, approved by the user on 2026-09-03

## Objective

Replace the current compressed-desktop mobile experience with a separate, deliberately edited mobile composition system. The phone experience keeps Ulixes's verified content, colors, and institutional authority, but changes what appears first, how information is grouped, and how supporting evidence is opened.

The result must feel ready to put in front of banks, asset managers, technology partners, and other institutional companies. It must be faster to understand, materially shorter at rest, comfortable to operate with one thumb, and visually distinct from the desktop layout without becoming a generic app interface.

## Design thesis

**An institutional control brief.** Mineral paper, precise ink, restrained steel, sage, and clay signals, and one active question per viewport. The phone behaves like a well-edited briefing document with responsive instruments, not like a desktop page squeezed into a narrow column.

The design transfers Rancho Machete's structural lesson only: separate mobile shell, route-specific mobile components, deliberate content reduction, and focused progressive disclosure. It does not copy Rancho's visual identity, component styling, typography, or agricultural editorial language.

## Core decisions

### Separate compositions, shared truth

- Mobile and desktop may render different markup from the same typed content objects.
- Mobile is the default composition through `895px`.
- `896px` through `1099px` is a fluid touch-first tablet and narrow-desktop range. It must not inherit desktop layouts that require a wide canvas.
- Full desktop compositions begin at `1100px` unless an existing component has a stronger, verified reason for a different boundary.
- Hidden desktop markup must not remain keyboard-focusable on mobile, and hidden mobile markup must not remain keyboard-focusable on desktop.

### Three information layers

Every dense mobile section classifies content into three layers:

1. **Visible now:** positioning, title, one concise scope statement, outcome or failure, and the next useful action.
2. **Selected detail:** one active service, lifecycle stage, institution, program, mandate, or case study.
3. **Deep evidence:** technical objects, dependencies, approach notes, and extended prose opened in an accessible detail sheet or reader.

No verified claim is deleted from the site. Repeated explanation may be removed from a shallower route when it remains available on the appropriate deeper route.

### Mobile rhythm

- Header: `60px` plus the safe-area inset.
- Phone gutter: `20px`, reduced to `16px` only below `360px`.
- Section spacing: `48px` to `64px`, with no desktop compensation gaps.
- H1: `38px` to `44px`; H2: `28px` to `34px`; body: `16px` minimum.
- Important targets: `44px` minimum in both dimensions.
- Horizontal scrolling is allowed only for a short selector whose next option is visibly discoverable. Core page content never depends on swipe.
- Default mobile page length should fall by roughly 35 to 45 percent on Home, Services, Experience, and Nasdaq Calypso.

## Shared mobile system

### Mobile header and navigation

- Use a compact, sticky header with the Ulixes wordmark, a concise mandate action, and a menu control.
- The navigation opens as a full-height sheet below the header.
- Route rows are large, descriptive, and visibly identify the current page.
- The sheet traps focus, closes on Escape, restores focus to the menu control, respects the safe area, and prevents background scrolling.
- The persistent action uses route-appropriate language where available and never covers page content.

### Mobile detail sheet

Create one shared `MobileDetailSheet` for deep evidence.

- It is an accessible modal dialog rendered only when open.
- It occupies at most `84dvh`, anchors to the bottom edge, and scrolls internally.
- It includes a visible title, contextual eyebrow, close control, and optional footer action.
- It closes on Escape and backdrop activation, restores focus to the trigger, and locks background scrolling while open.
- It uses opacity and transform only. Reduced motion changes the entrance to an immediate state change.
- It is reserved for information that would otherwise make the primary page materially longer. It is not used for ordinary navigation or every small disclosure.

### Mobile selector and pager grammar

- A selector always shows the current item, position, and a visible way to move backward and forward.
- Swipe may supplement buttons but never replaces them.
- Selection changes use one restrained directional transition.
- URL state is preserved where the existing page already supports deep linking, such as the Calypso lifecycle stage query.

### Mobile footer

- Use one compact closing composition: brand, primary contact action, email, four core routes, Privacy, Terms, and copyright.
- Remove duplicate descriptions and oversized desktop spacing.
- The mobile footer must not exceed roughly `360px` before safe-area padding.

## Route design

### Home

The mobile homepage is a six-part executive overview:

1. **Opening brief:** proposition, one supporting sentence, one primary action, and a short skyline release. The first viewport must communicate what Ulixes does without requiring a scroll through media.
2. **Proof register:** a compact two-by-two authority register connected visually to the opening rather than presented as a separate card grid.
3. **Capability index:** four edge-to-edge rows. Each row shows title and scope. Activating a row opens its service detail in the shared sheet and offers the relevant mandate action.
4. **Calypso signal:** a compact three-office trade path that demonstrates front, middle, and back office continuity. It links to the full Calypso lifecycle rather than reproducing the seven-stage system on Home.
5. **Experience proof:** one concise practitioner statement and the strongest relevant evidence. Repeated credibility strips and long duplicated prose are omitted.
6. **Closing action:** one direct mandate invitation and email fallback.

The homepage should have one signature moment: the skyline threshold joining message, media, and proof register. Other sections remain quieter so the page does not become a collection of competing compositions.

### Services

- Keep the proposition and short visual release.
- Replace the long mobile capability stack with a compact four-item index and one selected capability panel.
- The selected panel shows outcome, risk controlled, and the primary engagement action. Full deliverables open in the shared detail sheet.
- Replace the complete vertically stacked process explanation with a three-phase pager. Each phase shows one concise purpose and its immediate output; full steps remain available in the sheet.
- Keep Calypso and automation evidence, but reduce it to one clear proof composition instead of another complete chapter.

### Institutional Experience

- Use copy-first source and visual order: proposition, proof, action, then a controlled portrait crop.
- Show one compact proof bar only. Remove duplicated credibility chips.
- Replace seven complete institution descriptions with a selector and one active institution brief.
- Present one case study at a time. Summary and outcomes remain visible. Challenge and approach open in the detail sheet.
- Keep portraiture and architectural depth as the route's signature composition, but never place body copy over photography.
- The selected institution and case controls expose position, visible selected state, previous and next actions, and keyboard behavior.

### Nasdaq Calypso

- Keep the message-first hero and authority register, but compress its total first-screen height.
- Keep the local Lifecycle, Programs, and Mandates navigator. It remains below the global header and never covers section headings.

#### Lifecycle

Replace the current mobile master-detail workbench with a fixed-height `MobileLifecyclePager`:

- A seven-segment stage scrubber shows the complete journey and the active material family.
- The active brief shows stage number, stage name, office, one sentence for what happens, and one emphasized sentence for where it breaks.
- Previous and next controls remain visible. Direct segment selection remains available.
- `Built from`, `Depends on`, and `Hands on` move into a `View control detail` sheet.
- The compact state at `375px` should remain within roughly `520px` after the section introduction.
- Desktop retains the current richer master-detail workbench.

#### Programs

- Keep the three program families as the first decision.
- Show program names as compact rows within the selected family and only one selected program note.
- Move the six-domain register into a deliberate `View product domains` detail sheet on phones. It remains fully visible on tablet and desktop.
- Preserve program contact links and all eight program entries.

#### Mandates

- Show four compact rows with title and scope.
- Selecting a row reveals the risk statement in place or in the shared sheet, based on whichever produces the shorter stable section without hiding the selected state.
- Avoid four full paragraphs at rest.

### Contact

- Keep a single-page form because splitting a short institutional inquiry into multiple steps adds friction without improving comprehension.
- Put direct email and expected response context before the form.
- Use one flat mobile surface, visible labels, correct autocomplete tokens, clear inline errors, first-error focus, and a full-width submit action that remains above the software keyboard when possible.
- Preserve the existing API, CAPTCHA, error, loading, and success behavior.

### Legal and status pages

- Preserve a document model with a compact table of contents where useful.
- Reduce excessive mobile top and bottom space.
- Do not add sales bars, carousels, decorative cards, or modal detail sheets.

## Visual system

Use the existing project tokens and imagery. The mobile redesign changes their role and rhythm:

- Mineral and ink remain the dominant grounds.
- Steel, sage, and clay encode lifecycle or category state rather than decorating arbitrary containers.
- Rules, controlled overlap, and tonal recession create depth. Large rounded card stacks, glow effects, and generic floating panels are prohibited.
- Use at least three surface levels on Home, Experience, and Calypso: page ground, recessed visual or chapter plane, and raised active information plane.
- Use exactly one memorable depth or interaction composition per route.
- Typography remains left aligned with short line lengths and no tiny desktop labels carrying essential meaning.

## Motion

Motion communicates selection and continuity:

- One orchestrated opening sequence per marketing route.
- Directional pager changes use `180ms` to `240ms` opacity and translate transitions.
- Detail sheets use one controlled entrance and exit.
- No perpetual motion, scroll hijacking, or bounce physics on mobile.
- All motion stops under `prefers-reduced-motion: reduce`.

## Component boundaries and data flow

- Existing typed content in `src/lib` remains the single source of truth.
- Server route components pass content into small client leaves for selection and sheet state.
- `MobileDetailSheet` owns dialog behavior only and accepts title, eyebrow, body, and optional action content.
- `MobileLifecyclePager` owns lifecycle selection and URL stage state, but receives stage content from the existing Calypso content model.
- Route-specific selectors own only their active index. They do not introduce global state.
- Desktop components remain isolated from mobile interaction state.

## Accessibility and failure behavior

- Modal sheets use `role="dialog"`, `aria-modal="true"`, labeled headings, focus containment, Escape close, and trigger focus restoration.
- Tabs, segmented controls, and pagers expose selected state in text or shape as well as color.
- Hidden content is removed from the accessibility tree and tab order.
- Interactive transitions never leave an empty live region.
- Contact errors remain associated with their fields and submission failure gives a clear recovery action.
- All interactions work by keyboard, touch, and pointer.
- Forced-colors and reduced-motion modes remain usable.

## Performance

- Add no dependency.
- Reuse the installed Framer Motion only where existing motion infrastructure already justifies it; prefer CSS for simple state transitions.
- Never animate height, width, top, or left.
- Avoid unthrottled scroll handlers.
- Keep mobile images correctly sized and lazy-load below-fold media.
- Preserve the mobile video opt-in and avoid autoplay downloads.

## Verification

- Add red-first behavioral tests for the detail sheet, lifecycle pager, route selectors, shell, and content-preservation contracts.
- Run the complete Vitest suite, ESLint, TypeScript, link verification, dependency audit, and production build.
- Verify every public route at `320x700`, `375x812`, `390x844`, `430x932`, `768x1024`, `1024x768`, and `1440x900`.
- Check full-page height, overflow, clipped text, safe areas, touch targets, keyboard focus, menu and sheet focus return, reduced motion, console errors, broken media, and contact validation.
- Run independent correctness, composition, and ambition reviews. Resolve every blocker and major issue before release.
- Produce contact sheets and a final report under `docs/verify/`.

## Release scope

- Implement in the worktree currently serving `localhost:3100`.
- Preserve unrelated untracked files and user changes.
- Commit only files belonging to this redesign.
- After fresh verification, integrate the finished changes into `main`, push, deploy to production, and verify the public site, as previously authorized by the user.
