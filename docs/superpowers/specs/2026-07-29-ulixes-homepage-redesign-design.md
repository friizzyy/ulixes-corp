# Ulixes Homepage Redesign — Design Specification

Date: 2026-07-29
Status: Approved design direction; implementation-ready specification awaiting review

## 1. Objective

Rebuild the Ulixes Corporation homepage as a polished, premium institutional website that communicates senior Calypso and capital-markets systems expertise without resembling a generic consulting template, SaaS landing page, technical dashboard, or AI-generated design.

The homepage has one job: establish that Ulixes sees the entire trade-system consequence chain and make a qualified visitor comfortable beginning a conversation.

## 2. Audience

Primary visitors are senior stakeholders responsible for Calypso implementation, migration, operations, risk, compliance, testing, or platform transformation. They should understand the value without needing the site to explain basic capital-markets terminology.

## 3. Approved Direction

The selected direction is **Full-bleed System Film**.

The hero animation is the opening composition—not a supporting asset. A controlled ultraviolet signal travels through the infrastructure image, exits the hero, becomes the homepage's trade-lifecycle interaction, evolves through the capability chapters, and resolves in the closing call to action.

This continuous signal is the one signature element. Everything around it is quiet, precise, and structurally useful.

### Reference principles

The design uses reference material for structural calibration, not visual copying:

- Mobbin's [Koto](https://mobbin.com/sites/sections/062eb6b8-b141-4fe5-8c11-9edc778e2468) and [Metalab](https://mobbin.com/sites/sections/177ec534-65c5-4c89-933e-4f5186899564) examples establish the standard for a full-bleed, image-led hero with restrained copy.
- Mobbin's [Raw Materials](https://mobbin.com/sites/sections/e5ec35b6-1d56-4131-a532-b8390ff5373d) example establishes the value of one persistent visual system rather than unrelated section templates.
- The [Ecliptica reference](https://www.pinterest.com/pin/995084480181710658/) establishes compact typography, protected negative space, and a composition in which the visual carries the scale.
- The Ulixes result remains subject-specific: its lifecycle sequence, signal behavior, copy, and interaction are derived from Calypso and capital-markets work.

## 4. Non-negotiable Requirements

- The hero is full-bleed and visually complete at desktop launch.
- The animation fills the hero edge to edge; it never appears in a right-hand media box.
- The open left portion of the footage is protected as a composition-safe copy zone.
- Hero typography is commanding but not oversized or space-wasting.
- Ultraviolet/indigo is the active color. No blue call-to-action styling.
- Sections form one visual journey rather than a stack of generic cards, decorative tabs, ornamental rails, or repeated labeled boxes. Semantic controls remain visible and understandable wherever selection is required.
- Interactions communicate how work moves through a trade system; they do not imitate dashboard controls.
- The homepage uses factual, supportable business content. No invented metrics, outcomes, clients, testimonials, or project details.
- Mobile is art-directed, touch-first, and complete—not a collapsed desktop afterthought.
- The browser prototype is not shown until the entire homepage is implemented and QA'd at desktop and mobile breakpoints.

## 5. Content Guardrails

The following are statements about **Ulysses Williams's individual experience**, not aggregate company history:

- Calypso experience since 2004
- Front-, middle-, and back-office delivery
- Experience spanning North America, Europe, APAC, and Latin America
- Product-domain experience across interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives

Private contact details, named client/project specifics, and unsupported numerical outcomes are excluded. The implementation must not convert Ulysses's biography into an Ulixes-wide claim by changing the subject from his name to "we," "our team," or the company name.

## 6. Visual System

### Palette

| Token | Value | Role |
| --- | --- | --- |
| Carbon | `#08090C` | Hero and primary dark field |
| Graphite | `#15171D` | Elevated dark surfaces and transitions |
| Mineral | `#E9E9E4` | Light editorial field |
| Ultraviolet | `#8B5CF6` | Primary action fill and active signal; use Carbon text on this fill |
| Violet Ink | `#5B3FC4` | Violet text and focus treatment on Mineral, 5.84:1 contrast |
| Violet Light | `#A78BFA` | Violet text and focus treatment on Carbon, 7.32:1 contrast |
| Lavender | `#B9AAFF` | Non-text signal bloom only |
| Titanium | `#8A8D96` | Supporting text on Carbon only |
| Titanium Ink | `#5F626C` | Supporting text on Mineral, 5.00:1 contrast |
| White | `#F7F7F4` | High-contrast text on dark fields |

Blue, gold, acid green, and decorative multicolor gradients are excluded. Ultraviolet and Lavender must never carry small white text. Every token pairing used for text or controls must pass an automated WCAG contrast check in addition to visual review.

### Typography

- Display and body: self-hosted Instrument Sans variable WOFF2, loaded through `next/font/local` with weight range 400–700 and `display: swap`.
- Utility labels only: self-hosted IBM Plex Mono Medium WOFF2, loaded through `next/font/local` at weight 500 and `display: swap`.
- Font assets live under `src/assets/fonts`; no runtime request is made to Google Fonts or another font CDN.
- The corresponding SIL Open Font License files are retained with the self-hosted assets.
- Metric-compatible system fallbacks and `size-adjust` are required so font loading creates no material layout shift.
- Desktop hero headline: `clamp(3rem, 4.2vw, 4rem)`; maximum 64px.
- Mobile hero headline: `clamp(2.35rem, 10vw, 2.8rem)`.
- Body copy: 17–19px desktop and at least 16px mobile.
- Headline tracking is slightly tightened; body tracking remains natural.
- Monospace is reserved for real system stages, states, or coordinates—not decorative labels.

### Shape and Detail

- Avoid card grids, glassmorphism panels, terminal treatments, bento layouts, and ornamental hairline overload.
- Corners remain restrained: 0–12px depending on function.
- Dividers appear only where they encode a boundary in the lifecycle or content.
- Shadows are rare; hierarchy comes from contrast, spacing, scale, and motion.

## 7. Global Layout

- Main desktop content grid: 12 columns, maximum width 1440px, with 56–88px side padding depending on viewport.
- Tablet side padding: 32px.
- Mobile side padding: 20px.
- Section spacing varies by narrative purpose; sections do not repeat a single template height.
- Dark and mineral fields alternate only at meaningful changes in the visitor's understanding.

## 8. Homepage Flow

### 8.1 Navigation

The navigation overlays the hero and remains visually quiet.

- Left: Ulixes wordmark
- Center/right: Expertise (`#capabilities`), Approach (`#system-trace`), Experience (`#experience`)
- Primary action: Discuss the mandate
- Initial state: transparent over the hero
- Scrolled state: compact carbon surface with subtle blur and clear contrast
- `Discuss the mandate` always opens `/contact`.
- Mobile: accessible menu with a 44px minimum touch target; no full-screen animation behind open menu content

### 8.2 Hero — "See the whole system"

On desktop, the hero uses `min-height: clamp(720px, 92svh, 960px)`. The animated infrastructure footage covers the entire field.

Final hero copy:

> **See the whole system before you change it.**
>
> Senior-led Calypso advisory for the decisions connecting front office, risk, operations, and settlement.

Primary action: **Discuss the mandate**
Secondary action: **Explore capabilities**

`Discuss the mandate` links to `/contact`. `Explore capabilities` scrolls to `#capabilities` and moves keyboard focus to that section heading without changing the URL route.

A quiet proof line sits near the lower edge:

> Ulysses Williams · Calypso since 2004 · Front-to-back programs across four regions

#### Hero composition

- On the 1672×941 reference frame, the protected copy zone is normalized to x `5.5–42%` and y `20–76%`; luminous geometry may not enter that zone.
- Copy occupies no more than the protected left 36–42% of the frame.
- Copy width is capped at 520px.
- The active infrastructure geometry remains concentrated in the right 48–55%.
- A localized carbon gradient protects readability behind the copy without flattening the entire film.
- The approved copy scrim is `linear-gradient(90deg, rgba(8,9,12,.92) 0%, rgba(8,9,12,.68) 34%, rgba(8,9,12,.18) 52%, transparent 68%)`.
- The approved navigation scrim occupies the top 132px and is `linear-gradient(180deg, rgba(8,9,12,.72) 0%, rgba(8,9,12,.24) 72%, transparent 100%)`.
- `object-position` is art-directed per breakpoint; the same crop is not forced onto every screen.
- No panel, frame, border, or artificial background sits behind the main copy.
- The headline is limited to two lines at 1440×900 and three lines at 320×568. Hero supporting copy is limited to 150 characters excluding spaces.

#### Hero media quality

- Approved visual source still: `/Users/frizzy/.codex/generated_images/019faf62-048c-7932-a78a-64af5b2d5ea9/exec-02e3477d-567b-4c3e-8438-87ff8160af3b.png`, 1672×941, generated specifically for this Ulixes project.
- Approved motion reference: `/Users/frizzy/.codex/visualizations/2026/07/29/019faf62-048c-7932-a78a-64af5b2d5ea9/ulixes-control-signal-seamless-loop.mp4`, six seconds, 1280×720, 4,274,885 bytes, generated from the approved still with the same image supplied as the start and end state.
- These project-generated assets introduce no third-party stock-image dependency. The final deployment still requires preservation of the generation records and platform output rights associated with the image and motion tools.
- The 720p motion reference is composition approval only; it is not acceptable as the final desktop source.
- Produce a 3840×2160, six-second, 30fps master from the approved composition using a native high-resolution generation or a detail-preserving upscale reviewed at 100%. A simple resize is rejected.
- Produce a separate 1080×1920, six-second mobile master. It must preserve an x `7–93%`, y `18–52%` copy zone and concentrate active geometry below y `55%`; a center crop of the desktop master is rejected.
- The first and final frames must share the same baseline state, achieve SSIM of at least 0.98, and show no visible geometry jump when replayed continuously.
- Archive both masters outside the deployed public directory, then encode these browser deliveries:
  - `public/media/hero/ulixes-signal-desktop-1440.webm`, 2560×1440, maximum 8 MB
  - `public/media/hero/ulixes-signal-desktop-1080.mp4`, 1920×1080 H.264 fallback, maximum 7 MB
  - `public/media/hero/ulixes-signal-mobile-1080.webm`, 1080×1920, maximum 4.5 MB
  - `public/media/hero/ulixes-signal-mobile-1080.mp4`, 1080×1920 H.264 fallback, maximum 4.5 MB
  - `public/media/hero/ulixes-signal-desktop-poster.avif`, maximum 350 KB
  - `public/media/hero/ulixes-signal-mobile-poster.avif`, maximum 220 KB
- The final poster is derived from the approved baseline frame of each master; it is not a different crop or lighting state.
- Do not make mobile download either desktop video or the 4K master.
- Video behavior: autoplay, muted, loop, `playsInline`, no controls, and no audio track.
- If playback fails, the poster preserves the complete hero composition.
- With `prefers-reduced-motion: reduce`, show the poster and remove scroll-linked motion.
- Before homepage implementation continues, inspect the final desktop and mobile masters at 100% for sharpness, copy-zone clearance, loop seam, banding, geometry stability, and frame-wide contrast.

### 8.3 System Trace — "One change travels"

The ultraviolet signal leaves the lower hero boundary and becomes a single large trade-lifecycle trace on a mineral field.

Approved homepage presentation sequence:

1. Capture and enrich
2. Process lifecycle events
3. Value and measure risk
4. Manage collateral and controls
5. Confirm and settle
6. Account, reconcile, and report

Final stage narratives:

1. **Capture and enrich:** Product setup, market data, static data, and booking rules establish the record every downstream process will trust.
2. **Process lifecycle events:** Amendments, resets, exercises, fees, and terminations test whether the original model survives the trade's full life.
3. **Value and measure risk:** Curves, models, sensitivities, and exposure translate the trade into decisions for desks, risk, and finance.
4. **Manage collateral and controls:** Eligibility, margin, limits, permissions, and exception handling determine whether exposure remains governed.
5. **Confirm and settle:** Messages, confirmations, cash, and securities movement turn the system record into an external obligation.
6. **Account, reconcile, and report:** Accounting events, breaks, and reporting reveal whether the same trade remains consistent across the institution.

The signal represents a platform decision and its downstream consequences. Each visible branch maps to one named stage above; no decorative branch may be added. The hero shows the decision entering the system, this section shows its propagation, the capability section shows where Ulixes intervenes, and the closing line represents the mandate brought into one shared view.

The initial committed state is **Capture and enrich**. Click, tap, Enter, or Space commits another stage. Hover may preview a node marker but may not replace the committed narrative. Focus alone does not change the committed state. Left/Right arrows on desktop and Up/Down arrows on the vertical mobile control move and commit selection using a roving-tabindex pattern. State remains committed until another explicit selection.

The controls use semantic `tablist`/`tab`/`tabpanel` behavior without visual tab chrome. Each narrative is limited to 220 characters. With JavaScript unavailable, all six narratives render as an ordered semantic list and the complete static route remains visible. On mobile, the trace becomes vertical and selected detail appears directly beneath its stage without horizontal scrolling.

### 8.4 Capability Stage — "Where Ulixes enters the system"

The lifecycle canvas transitions into one shared capability stage. Four capabilities occupy the same composition rather than four equal cards:

1. **Calypso implementation** — Architecture, configuration, and delivery across connected front-to-back workflows.
2. **Platform migration** — Planning and validation for platform or version transitions while preserving operational control.
3. **AI-assisted compliance** — Human-governed analysis that improves evidence, traceability, and review.
4. **Intelligent testing** — Risk-based test design and validation across critical trade-system paths.

The four capability articles remain fully present in document order. On desktop, the system canvas is sticky while the articles scroll normally beside it; there is no scroll hijacking. An article becomes active when its heading crosses a viewport line at 45%. Focusing or selecting a capability heading scrolls that article to the same line and activates its route. On mobile, the canvas is not sticky; each article contains its own static route snapshot.

Every highlighted segment maps to one or more named lifecycle stages. No visual segment exists without an associated stage and capability. With JavaScript unavailable, all four articles and a single annotated full-system map remain readable. Capability headings are limited to 28 characters and each description to 180 characters.

The route mapping is fixed:

- Calypso implementation: all six stages
- Platform migration: Capture and enrich; Process lifecycle events; Confirm and settle; Account, reconcile, and report
- AI-assisted compliance: Process lifecycle events; Manage collateral and controls; Account, reconcile, and report
- Intelligent testing: all six stages, rendered as validation checkpoints rather than a continuous fill

### 8.5 Representative Mandates — "Work of this kind"

This section establishes practical credibility without fabricated case-study metrics. It contains exactly three **representative mandates**, clearly labeled as patterns rather than client case studies.

#### Front-to-back implementation

A bank is extending Calypso across products and operating teams whose decisions cannot be isolated. Ulixes aligns product setup, market data, lifecycle processing, risk, accounting, messaging, and settlement around one operating model. The emphasis is making downstream consequences visible before configuration is committed.

#### Controlled platform migration

A platform or portfolio transition must preserve positions, lifecycle history, accounting treatment, and operational continuity. Ulixes frames target state, data mapping, reconciliation, parallel validation, cutover, and stabilization as one control program. The emphasis is proving continuity before the transition becomes irreversible.

#### Lifecycle-led testing

Release confidence depends on more than screens and happy-path scenarios. Ulixes designs SIT, UAT, and regression coverage around real products, lifecycle events, controls, and production readiness. The emphasis is testing the paths where business impact compounds.

The three mandates form one continuous editorial sequence: each begins with a large mandate title, followed by a single 45–60 word paragraph aligned to one evolving route diagram. There are no four-field labels, cards, result metrics, logos, or stock photographs. Each mandate is capped at 75 words.

### 8.6 Senior Judgment — "Experience in the decision"

A compact human credibility moment introduces Ulysses Williams as the senior practitioner behind the work. This is not an About section.

Final copy:

> **Experience stays close to the decision.**
>
> Ulixes is led by Ulysses Williams, President and Calypso subject-matter expert. His work has spanned front-, middle-, and back-office programs across North America, Europe, APAC, and Latin America since beginning with Calypso Technology in 2004.

Action: **View Ulysses on LinkedIn**, opening `https://www.linkedin.com/in/ulysses-williams-2379634/` in a new tab with secure external-link attributes and an explicit accessible label.

The section uses no portrait. A photograph is outside the approved homepage scope until a real, publication-approved source is supplied.

### 8.7 Closing Call to Action

The page returns to carbon. The lifecycle routes collapse into one ultraviolet line leading to the contact action.

Final copy:

> **Bring the whole mandate into view.**
>
> Start with the system, constraints, and decision in front of you.

Action: **Discuss the mandate**

The action opens `/contact`.

The close is visually related to the hero but does not replay the hero composition.

## 9. Motion System

- The hero loop is the only continuous ambient animation.
- The signal transition from hero to lifecycle is the primary orchestrated scroll moment.
- UI state transitions use 220ms easing; section-to-section signal morphs may use up to 420ms.
- Section entrances use spatial reveals selectively; there is no universal fade-up effect.
- No parallax scroll-jacking, cursor replacement, bouncing icons, particle fields, or animated gradients.
- Every motion behavior has a reduced-motion equivalent that preserves hierarchy and understanding.
- The loop contains no flash pattern above three flashes per second, no abrupt full-frame luminance change, and no frame that makes the copy or navigation fail contrast.
- Representative mobile testing must show no persistent scroll-linked stutter or dropped interaction response.

## 10. Responsive Behavior

### Desktop: 1280–1920+

- Full cinematic hero with left safe zone and right-biased infrastructure geometry.
- Lifecycle and capability stages can use the complete horizontal canvas.
- Text scale remains controlled on ultrawide monitors; content does not expand indefinitely.

### Tablet: 768–1279

- Hero copy remains over media with a stronger localized readability gradient.
- Navigation simplifies before crowding.
- Lifecycle supports both direct selection and scroll progression.

### Mobile: 320–767

- Hero targets `100svh` only when the content fits. It uses `min-height: 100svh` and expands with content on short viewports; no fixed maximum height may clip navigation, copy, actions, or proof.
- Safe-area insets are included in top and bottom padding.
- At 320×568, the hero may extend below one viewport; primary copy and CTA remain visible in document order and nothing is placed behind browser chrome.
- Mobile art direction preserves the protected copy zone and one meaningful portion of the signal geometry.
- Headline remains at or below 44px.
- Actions stack only when width requires it.
- Lifecycle is vertical and tap-first.
- Capability chapters become sequential full-width moments, not miniature cards.
- All body copy is at least 16px and all touch targets are at least 44×44px.
- No horizontal overflow at 320, 375, 390, or 414px.

## 11. Accessibility

- Meet WCAG AA contrast for text and functional controls, including automated token-pair validation.
- Provide visible `:focus-visible` states in ultraviolet/lavender with sufficient contrast.
- Preserve semantic heading order and landmark structure.
- Interactive lifecycle stages use native buttons or equivalent semantic controls with state conveyed beyond color.
- The decorative video is hidden from assistive technology; its meaning is duplicated in adjacent text.
- The poster and all meaningful images receive appropriate alternative treatment.
- The homepage remains understandable and navigable with motion disabled and JavaScript enhancement unavailable.
- Sample the poster and every video frame at each breakpoint crop. If hero copy, wordmark, navigation, or CTA falls below required contrast on any frame, increase the approved localized scrim or use the compact carbon navigation surface for the entire loop.

## 12. Performance and Reliability

- Reserve hero dimensions to prevent layout shift.
- Load the poster immediately; select the video source according to viewport and capability.
- Do not preload multiple large video encodes.
- Lazy-load below-the-fold noncritical media.
- Keep client-side JavaScript limited to lifecycle/capability interactions and measured motion.
- If media decoding or playback fails, preserve the still composition and all content/actions.
- The poster—not the video—must remain the LCP candidate; video loading may not block poster paint.
- Production targets follow the current [web.dev Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) at the 75th percentile: LCP at or below 2.5 seconds, CLS at or below 0.1, and INP at or below 200ms.
- Media byte limits are defined in Section 8.2 and are release gates, not suggestions.

## 13. Component Boundaries

The implementation should separate concerns into focused units:

- `HomepageHero`: media selection, safe-zone composition, CTA content
- `SystemTrace`: lifecycle state, keyboard/touch control, route rendering
- `CapabilityStage`: capability content and trace mapping
- `RepresentativeMandates`: factual editorial engagement patterns
- `SeniorJudgment`: attributed experience and LinkedIn action
- `ClosingSignalCTA`: final conversion moment
- Shared media and reduced-motion utilities

Content and interaction state remain separate so copy can be revised without rewriting animation logic.

## 14. Validation Plan

Before the homepage is shown for approval:

- Production build passes.
- Lint/type validation passes using the repository's supported commands.
- No console errors or failed local assets.
- Desktop review at 1440×900 and 1920×1080.
- Laptop review at 1280×800.
- Tablet review at 768×1024.
- Mobile review at 390×844 and 320×568.
- Mobile review at 375×812 and 414×896.
- Automated overflow check at 320, 375, 390, and 414px widths.
- Mobile menu-open review at 320×568.
- Keyboard-only lifecycle and navigation review.
- Reduced-motion review.
- Hero poster, video failure, and slow-load review.
- Automated contrast review for every text/control token pairing and sampled hero frames.
- Video master review for resolution, crop coordinates, frame rate, duration, seam, SSIM, flashing, and file size.
- Font review confirms self-hosted files, requested weights, no external request, and no material font-induced layout shift.
- Link validation covers all anchors, `/contact`, legal pages, services, experience, and LinkedIn.
- Visible and non-visible content audit covers page title, description, Open Graph, social metadata, structured data, sitemap, and JSON-LD attribution.
- Visual screenshots inspected for crop, copy clearance, hierarchy, and section continuity.
- Real browser interaction review before reopening the preview to the user.

## 15. Explicit Rejections

The following directions are not part of the design:

- Split hero with video in one column
- Giant headline occupying most of the viewport
- Navy-and-gold consulting palette
- Blue buttons
- Terminal or command-center aesthetic
- Persistent ornamental technical rail or dossier layout
- Equal service cards, bento grids, or generic icon tiles
- Decorative tabs and pills masquerading as meaningful interaction
- Invented metrics, outcomes, clients, or testimonials
- A standalone About section on the homepage
- Showing an incomplete slice as though it were the finished homepage

## 16. Acceptance Criteria

The homepage is ready for approval only when:

1. The hero reads as one cinematic composition with comfortable, intentional copy placement.
2. The video appears sharp at target desktop sizes and degrades gracefully by device and bandwidth.
3. A visitor can describe what Ulixes does and why the whole-system view matters after the first two sections.
4. The lifecycle, capabilities, experience, and CTA feel like consecutive movements of one design system.
5. No section resembles a default card grid, dashboard module, or generic consulting template.
6. All published claims are factual and attributable.
7. Desktop, mobile, keyboard, reduced-motion, and fallback states are complete.
8. No placeholder, optional, "potential," or proposed public-facing language remains.
9. The final desktop and mobile hero masters pass the internal asset gate before the homepage is shown.

## 17. Footer and Metadata

The footer closes the true homepage and contains:

- Ulixes Corporation wordmark and the line `Senior-led Calypso and capital-markets systems advisory.`
- Expertise link to `#capabilities`
- Approach link to `#system-trace`
- Experience link to `/institutional-experience`
- Services link to `/services`
- Contact link to `/contact`
- LinkedIn link to Ulysses's supplied profile
- Privacy and Terms links
- Current-year copyright

No unverified email address, phone number, office location, certification, client logo, or company-wide statistic appears in the homepage footer.

Final metadata:

- Title: `Ulixes Corporation | Senior-Led Calypso Advisory`
- Description: `Ulixes provides senior-led Calypso advisory for implementation, migration, compliance analysis, and testing across front-to-back capital-markets workflows.`
- Open Graph and social descriptions use the same factual language.
- JSON-LD includes an `Organization` for Ulixes Corporation and a related `Person` for Ulysses Williams with job title `President` and the supplied LinkedIn URL. His experience dates, regions, and product domains remain biographical content and are not copied into organization-level fields.

## 18. Final Content-Length Limits

- Hero headline: maximum 56 characters including spaces.
- Hero body: maximum 150 characters excluding spaces.
- Proof line: maximum 96 characters on desktop; it wraps into two attributed lines on mobile.
- Lifecycle stage label: maximum 32 characters.
- Lifecycle narrative: maximum 220 characters.
- Capability heading: maximum 28 characters.
- Capability description: maximum 180 characters.
- Representative mandate: maximum 75 words.
- Senior-judgment body: maximum 52 words.
- Closing headline: maximum 44 characters.
