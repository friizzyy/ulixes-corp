# Ulixes Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, publish, and deploy a complete premium Ulixes homepage whose full-bleed 4K hero, trade-lifecycle interaction, capabilities, representative mandates, senior attribution, and closing CTA form one continuous visual system.

**Architecture:** Keep the existing Next.js App Router application and isolate the new homepage in focused `src/components/home/` units backed by one typed content module. Use server components for static editorial sections, narrowly scoped client components for video readiness, lifecycle selection, and capability activation, and a shared semantic SVG signal map. Generate separate 4K desktop and mobile masters with Higgsfield, commit only optimized browser encodes, and preserve the masters outside the deployment bundle.

**Tech Stack:** Next.js 14.2.3 App Router, React 18.3, TypeScript 5.4, Tailwind CSS 3.4, CSS Modules, Framer Motion 11, Vitest, Testing Library, Higgsfield Nano Banana Pro and Seedance 2.0, ffmpeg-static/ffprobe-static, Vercel.

## Global Constraints

- Preserve the user's existing unstaged change in `src/app/api/contact/route.ts`; never stage, overwrite, or deploy it accidentally.
- Implement in an isolated `codex/ulixes-homepage-redesign` worktree created from the current `main` commit.
- Do not upgrade the Next.js major version in this feature; framework migration is unrelated to the approved homepage design.
- Use only factual, attributable copy from the approved specification; no invented metrics, outcomes, clients, testimonials, or unnamed "team" claims.
- The hero animation fills the hero edge to edge and retains the protected left copy zone; no split media column or media card.
- Hero headline is at most 64px desktop and 44px mobile; no oversized display treatment.
- Primary action fill is Ultraviolet `#8B5CF6` with Carbon `#08090C` text; no blue action styling.
- Ultraviolet and Lavender never carry small white text. Violet text on Mineral uses `#5B3FC4`; violet text on Carbon uses `#A78BFA`.
- Use self-hosted Instrument Sans variable and IBM Plex Mono Medium through `next/font/local`.
- The hero loop is the only continuous ambient animation; respect `prefers-reduced-motion` and provide poster, playback-failure, no-JavaScript, keyboard, and touch states.
- Desktop, laptop, tablet, mobile, short-viewport, menu-open, reduced-motion, and video-failure states must be complete before the preview is reopened.
- The 4K masters remain in non-deployed `design-assets/hero/`; commit only the approved responsive encodes and posters under `public/media/hero/`.
- Do not show the user an intermediate browser build. Open the replacement only after Task 9 passes.

## File Structure

### Create

- `src/lib/homepage-content.ts` — typed final homepage content, lifecycle model, capability mappings, and representative mandates.
- `src/lib/homepage-content.test.ts` — factual guardrails, copy-length limits, route coverage, and prohibited-copy regression tests.
- `src/components/home/homepage.module.css` — homepage-only layout, type, color, media, responsive, and reduced-motion rules.
- `src/components/home/signal-network.tsx` — reusable semantic/decorative SVG route renderer.
- `src/components/home/homepage-hero.tsx` — responsive posters, 4K-derived video sources, safe-zone copy, and fallback state.
- `src/components/home/homepage-hero.test.tsx` — hero content, media ordering, CTA destinations, and fallback tests.
- `src/components/home/system-trace.tsx` — deterministic lifecycle interaction and no-JavaScript content.
- `src/components/home/system-trace.test.tsx` — selection, arrows, ARIA, and persistence tests.
- `src/components/home/capability-stage.tsx` — four semantic scroll chapters with one shared route canvas.
- `src/components/home/capability-stage.test.tsx` — route mapping and activation tests.
- `src/components/home/representative-mandates.tsx` — three continuous editorial mandate sequences.
- `src/components/home/senior-judgment.tsx` — attributed Ulysses Williams credibility moment.
- `src/components/home/closing-signal-cta.tsx` — final convergence and `/contact` action.
- `src/components/home/index.ts` — focused homepage exports.
- `src/components/layout/navigation.test.tsx` — homepage anchor and mobile-menu regression tests.
- `src/components/layout/footer.test.tsx` — approved link set and prohibited contact-detail tests.
- `src/test/setup.ts` — Testing Library, `matchMedia`, `IntersectionObserver`, and media mocks.
- `vitest.config.ts` — jsdom test configuration and `@/` alias.
- `scripts/prepare-hero-media.mjs` — deterministic responsive video/poster encodes.
- `scripts/verify-hero-media.mjs` — dimensions, duration, audio, size, frame count, and loop-seam checks.
- `design-assets/hero/README.md` — local master provenance and regeneration parameters; the binary masters are gitignored.
- `public/media/hero/ulixes-signal-desktop-1440.webm`
- `public/media/hero/ulixes-signal-desktop-1080.mp4`
- `public/media/hero/ulixes-signal-mobile-1080.webm`
- `public/media/hero/ulixes-signal-mobile-1080.mp4`
- `public/media/hero/ulixes-signal-desktop-poster.avif`
- `public/media/hero/ulixes-signal-mobile-poster.avif`
- `src/assets/fonts/InstrumentSans-Variable.woff2`
- `src/assets/fonts/IBMPlexMono-Medium.woff2`
- `src/assets/fonts/OFL-Instrument-Sans.txt`
- `src/assets/fonts/OFL-IBM-Plex-Mono.txt`

### Modify

- `.gitignore` — ignore `design-assets/hero/*.mp4`, `*.mov`, `*.webm`, and temporary frame output while retaining the provenance README.
- `package.json` / `package-lock.json` — add test/media tooling and scripts.
- `src/app/page.tsx` — replace the old Hero/Philosophy/Services/Process/CTA stack with the approved sequence.
- `src/app/layout.tsx` — self-host fonts and publish final metadata/JSON-LD.
- `src/lib/content.ts` — correct site metadata and global navigation labels without rewriting unrelated interior-page content.
- `src/components/layout/navigation.tsx` — premium wordmark, homepage anchors, scroll surface, and mobile behavior.
- `src/components/layout/footer.tsx` — approved footer links and removal of unverified email/phone display.
- `src/styles/globals.css` — accessible global tokens, focus treatment, and removal of homepage-conflicting defaults.
- `tailwind.config.ts` — align shared token names and font variables while preserving interior-route compatibility.
- `README.md` — replace obsolete terminal/emerald design notes with current setup, media regeneration, test, and deployment commands.

---

### Task 1: Test Harness and Typed Homepage Content

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/homepage-content.ts`
- Create: `src/lib/homepage-content.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `LifecycleStageId`, `LifecycleStage`, `Capability`, `RepresentativeMandate`, `homepageContent`, `lifecycleStages`, `capabilities`, and `representativeMandates`.
- Consumed by: every component in Tasks 4–7.

- [ ] **Step 1: Install deterministic test and media dependencies**

Run:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ffmpeg-static ffprobe-static sharp @fontsource-variable/instrument-sans @fontsource/ibm-plex-mono
```

Add these exact scripts to `package.json`:

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "media:prepare": "node scripts/prepare-hero-media.mjs",
  "media:verify": "node scripts/verify-hero-media.mjs"
}
```

- [ ] **Step 2: Create the failing content-contract test**

Create `src/lib/homepage-content.test.ts` with assertions that fail before the module exists:

```ts
import { describe, expect, it } from 'vitest'
import {
  capabilities,
  homepageContent,
  lifecycleStages,
  representativeMandates,
} from './homepage-content'

describe('homepage content contract', () => {
  it('keeps final copy within the approved composition limits', () => {
    expect(homepageContent.hero.headline.length).toBeLessThanOrEqual(56)
    expect(homepageContent.hero.body.replace(/\s/g, '').length).toBeLessThanOrEqual(150)
    expect(homepageContent.closing.headline.length).toBeLessThanOrEqual(44)
    expect(homepageContent.senior.body.trim().split(/\s+/).length).toBeLessThanOrEqual(52)
  })

  it('contains the approved lifecycle and complete capability mappings', () => {
    expect(lifecycleStages.map((stage) => stage.id)).toEqual([
      'capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting',
    ])
    expect(capabilities).toHaveLength(4)
    expect(capabilities.find((item) => item.id === 'implementation')?.stageIds).toHaveLength(6)
    expect(capabilities.find((item) => item.id === 'testing')?.renderMode).toBe('checkpoints')
  })

  it('publishes exactly three representative mandates without invented results', () => {
    expect(representativeMandates).toHaveLength(3)
    const published = JSON.stringify({ homepageContent, representativeMandates }).toLowerCase()
    for (const forbidden of ['20 implementations', 'zero disruption', 'on-time', 'real-time compliance']) {
      expect(published).not.toContain(forbidden)
    }
  })
})
```

- [ ] **Step 3: Run the test and confirm the intended failure**

Run: `npm run test:run -- src/lib/homepage-content.test.ts`

Expected: FAIL because `./homepage-content` does not exist.

- [ ] **Step 4: Create the typed content module**

Create `src/lib/homepage-content.ts` with these exact public types and IDs:

```ts
export type LifecycleStageId =
  | 'capture'
  | 'lifecycle'
  | 'risk'
  | 'controls'
  | 'settlement'
  | 'reporting'

export type LifecycleStage = {
  id: LifecycleStageId
  label: string
  narrative: string
}

export type Capability = {
  id: 'implementation' | 'migration' | 'compliance' | 'testing'
  title: string
  description: string
  stageIds: readonly LifecycleStageId[]
  renderMode: 'path' | 'checkpoints'
}

export type RepresentativeMandate = {
  id: 'implementation' | 'migration' | 'testing'
  title: string
  body: string
  stageIds: readonly LifecycleStageId[]
}
```

Continue the same file with the final public content:

```ts
export const homepageContent = {
  hero: {
    headline: 'See the whole system before you change it.',
    body: 'Senior-led Calypso advisory for the decisions connecting front office, risk, operations, and settlement.',
    primaryCta: 'Discuss the mandate',
    secondaryCta: 'Explore capabilities',
    proof: 'Ulysses Williams · Calypso since 2004 · Front-to-back programs across four regions',
  },
  systemTrace: {
    title: 'One change travels.',
    body: 'A platform decision rarely stays where it begins. Follow its consequences through the trade lifecycle.',
  },
  capabilities: {
    title: 'Where Ulixes enters the system.',
    body: 'Each mandate acts on a different part of the same connected operating model.',
  },
  mandates: { title: 'Work of this kind.' },
  senior: {
    headline: 'Experience stays close to the decision.',
    body: 'Ulixes is led by Ulysses Williams, President and Calypso subject-matter expert. His work has spanned front-, middle-, and back-office programs across North America, Europe, APAC, and Latin America since beginning with Calypso Technology in 2004.',
    cta: 'View Ulysses on LinkedIn',
    href: 'https://www.linkedin.com/in/ulysses-williams-2379634/',
  },
  closing: {
    headline: 'Bring the whole mandate into view.',
    body: 'Start with the system, constraints, and decision in front of you.',
    cta: 'Discuss the mandate',
    href: '/contact',
  },
} as const

export const lifecycleStages: readonly LifecycleStage[] = [
  {
    id: 'capture',
    label: 'Capture and enrich',
    narrative: 'Product setup, market data, static data, and booking rules establish the record every downstream process will trust.',
  },
  {
    id: 'lifecycle',
    label: 'Process lifecycle events',
    narrative: "Amendments, resets, exercises, fees, and terminations test whether the original model survives the trade's full life.",
  },
  {
    id: 'risk',
    label: 'Value and measure risk',
    narrative: 'Curves, models, sensitivities, and exposure translate the trade into decisions for desks, risk, and finance.',
  },
  {
    id: 'controls',
    label: 'Manage collateral and controls',
    narrative: 'Eligibility, margin, limits, permissions, and exception handling determine whether exposure remains governed.',
  },
  {
    id: 'settlement',
    label: 'Confirm and settle',
    narrative: 'Messages, confirmations, cash, and securities movement turn the system record into an external obligation.',
  },
  {
    id: 'reporting',
    label: 'Account, reconcile, and report',
    narrative: 'Accounting events, breaks, and reporting reveal whether the same trade remains consistent across the institution.',
  },
]

export const capabilities: readonly Capability[] = [
  {
    id: 'implementation',
    title: 'Calypso implementation',
    description: 'Architecture, configuration, and delivery across connected front-to-back workflows.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
    renderMode: 'path',
  },
  {
    id: 'migration',
    title: 'Platform migration',
    description: 'Planning and validation for platform or version transitions while preserving operational control.',
    stageIds: ['capture', 'lifecycle', 'settlement', 'reporting'],
    renderMode: 'path',
  },
  {
    id: 'compliance',
    title: 'AI-assisted compliance',
    description: 'Human-governed analysis that improves evidence, traceability, and review.',
    stageIds: ['lifecycle', 'controls', 'reporting'],
    renderMode: 'path',
  },
  {
    id: 'testing',
    title: 'Intelligent testing',
    description: 'Risk-based test design and validation across critical trade-system paths.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
    renderMode: 'checkpoints',
  },
]

export const representativeMandates: readonly RepresentativeMandate[] = [
  {
    id: 'implementation',
    title: 'Front-to-back implementation',
    body: 'A bank is extending Calypso across products and operating teams whose decisions cannot be isolated. Ulixes aligns product setup, market data, lifecycle processing, risk, accounting, messaging, and settlement around one operating model. The emphasis is making downstream consequences visible before configuration is committed.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
  },
  {
    id: 'migration',
    title: 'Controlled platform migration',
    body: 'A platform or portfolio transition must preserve positions, lifecycle history, accounting treatment, and operational continuity. Ulixes frames target state, data mapping, reconciliation, parallel validation, cutover, and stabilization as one control program. The emphasis is proving continuity before the transition becomes irreversible.',
    stageIds: ['capture', 'lifecycle', 'settlement', 'reporting'],
  },
  {
    id: 'testing',
    title: 'Lifecycle-led testing',
    body: 'Release confidence depends on more than screens and happy-path scenarios. Ulixes designs SIT, UAT, and regression coverage around real products, lifecycle events, controls, and production readiness. The emphasis is testing the paths where business impact compounds.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
  },
]
```

- [ ] **Step 5: Add the Vitest environment**

Create `vitest.config.ts`:

```ts
import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

Create `src/test/setup.ts` with `@testing-library/jest-dom/vitest`, a writable `window.matchMedia`, a deterministic `IntersectionObserver` mock exposing `observe`, `unobserve`, and `disconnect`, and no-op `HTMLMediaElement.play`/`pause` mocks.

- [ ] **Step 6: Run the content contract**

Run: `npm run test:run -- src/lib/homepage-content.test.ts`

Expected: PASS with three tests.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/lib/homepage-content.ts src/lib/homepage-content.test.ts
git commit -m "test: lock homepage content contract"
```

---

### Task 2: Native 4K Higgsfield Masters and Browser Media Pipeline

**Files:**
- Create: `design-assets/hero/README.md`
- Create: `scripts/prepare-hero-media.mjs`
- Create: `scripts/verify-hero-media.mjs`
- Create: six optimized files under `public/media/hero/`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the approved source still at `/Users/frizzy/.codex/generated_images/019faf62-048c-7932-a78a-64af5b2d5ea9/exec-02e3477d-567b-4c3e-8438-87ff8160af3b.png`.
- Produces: the exact media paths consumed by `HomepageHero` in Task 4.

- [ ] **Step 1: Write the failing media verifier before generating assets**

Create `scripts/verify-hero-media.mjs`. Use `ffprobe-static` through `execFileSync` and assert this exact matrix:

```js
const expected = [
  ['public/media/hero/ulixes-signal-desktop-1440.webm', 2560, 1440, 8_000_000],
  ['public/media/hero/ulixes-signal-desktop-1080.mp4', 1920, 1080, 7_000_000],
  ['public/media/hero/ulixes-signal-mobile-1080.webm', 1080, 1920, 4_500_000],
  ['public/media/hero/ulixes-signal-mobile-1080.mp4', 1080, 1920, 4_500_000],
]
```

For each video, reject a missing file, wrong dimensions, duration outside `5.9–6.1`, any audio stream, or size over budget. Reject missing/oversized desktop and mobile posters. Compare first and final frame with ffmpeg's `ssim` filter and reject `All` below `0.98`.

- [ ] **Step 2: Run the verifier and confirm the intended failure**

Run: `npm run media:verify`

Expected: FAIL on the first missing optimized asset.

- [ ] **Step 3: Upload the approved source still and generate 4K desktop/mobile stills**

Use the completed preflight as the spend gate: the Ultra workspace reported 3,087 credits, each 4K still estimated 4 credits, and each six-second 4K Seedance loop estimated 132 credits, for 272 credits total. Abort generation if a new estimate exceeds 300 credits total.

Use Higgsfield `media_upload_and_confirm` with `type: "image"`, then generate one `nano_banana_pro` image at `resolution: "4k"` for each aspect ratio.

Desktop prompt:

```text
Reconstruct this Ulixes capital-markets infrastructure composition at native 4K, 16:9. Preserve the exact carbon and graphite architectural rails, smoked-metal depth, sparse ultraviolet signal paths, and restrained premium lighting. Keep the left 42 percent quiet and dark from 20 to 76 percent vertical for white website copy. Concentrate meaningful luminous geometry in the right half. No text, logos, particles, people, skyline, blue light, extra rails, camera distortion, or generic sci-fi interface.
```

Mobile prompt:

```text
Create a native 4K 9:16 mobile art direction of the supplied Ulixes infrastructure composition. Preserve the same carbon, graphite, smoked-metal, and ultraviolet visual identity. Keep x 7 to 93 percent and y 18 to 52 percent quiet and dark for mobile website copy. Place the meaningful connected rail geometry and violet signal primarily below y 55 percent and toward the lower right. No text, logos, people, particles, blue light, generic sci-fi interface, or center crop of the landscape composition.
```

Inspect both outputs at original resolution before continuing. Reject any output whose signal enters the copy zone or whose geometry becomes decorative circuitry.

- [ ] **Step 4: Generate the two silent six-second native 4K loops**

For each approved still, call Higgsfield `seedance_2_0` with the same image as both `start_image` and `end_image` and these exact parameters:

```json
{
  "duration": 6,
  "resolution": "4k",
  "mode": "std",
  "bitrate_mode": "high",
  "generate_audio": false
}
```

Use `aspect_ratio: "16:9"` for desktop and `"9:16"` for mobile.

Motion prompt:

```text
Locked camera. Preserve every architectural rail and the protected copy zone. A single restrained ultraviolet signal pulse travels through the existing connected paths, briefly clarifies one junction, then returns the complete scene to the identical baseline lighting and geometry. No camera move, zoom, parallax, geometry growth, new objects, particles, flicker, exposure jump, text, or audio. The first and last frame must be visually identical for a seamless ambient website loop.
```

Download completed raw files to `design-assets/hero/ulixes-signal-desktop-master-4k.mp4` and `design-assets/hero/ulixes-signal-mobile-master-4k.mp4`.

- [ ] **Step 5: Create deterministic responsive encodes and posters**

Create `scripts/prepare-hero-media.mjs` using `ffmpeg-static` and `execFileSync`. Encode:

```text
desktop WebM: scale=2560:1440, libvpx-vp9, crf=24, b:v=0, row-mt=1, no audio
desktop MP4:  scale=1920:1080, libx264, crf=19, preset=slow, pix_fmt=yuv420p, movflags=+faststart, no audio
mobile WebM:  scale=1080:1920, libvpx-vp9, crf=25, b:v=0, row-mt=1, no audio
mobile MP4:   scale=1080:1920, libx264, crf=20, preset=slow, pix_fmt=yuv420p, movflags=+faststart, no audio
```

Extract frame zero from each master to a temporary PNG, encode the posters with `sharp(...).avif({ quality: 56, effort: 8 })`, and remove only those temporary PNGs after successful AVIF writes. The script must fail if either master is absent and must create `public/media/hero/` before writing.

- [ ] **Step 6: Verify media gates and inspect representative frames**

Run:

```bash
npm run media:prepare
npm run media:verify
```

Expected: all files pass dimensions, duration, audio, size, and SSIM gates. Extract frames at `0`, `1.5`, `3`, `4.5`, and `5.966` seconds from each master and visually inspect all ten frames for copy-zone clearance, banding, geometry stability, and abrupt luminance change.

- [ ] **Step 7: Record provenance and git exclusions**

Create `design-assets/hero/README.md` with the source-still path, Higgsfield model/parameters, generated job IDs, local master filenames, browser encode commands, and the ten-frame inspection result. Add binary master and temporary frame patterns to `.gitignore` while keeping the README tracked.

- [ ] **Step 8: Commit Task 2**

```bash
git add .gitignore design-assets/hero/README.md scripts/prepare-hero-media.mjs scripts/verify-hero-media.mjs public/media/hero
git commit -m "feat: add native-resolution hero media pipeline"
```

---

### Task 3: Visual Foundation, Self-Hosted Fonts, Metadata, Navigation, and Footer

**Files:**
- Create: four files under `src/assets/fonts/`
- Create: `src/components/layout/navigation.test.tsx`
- Create: `src/components/layout/footer.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/components/layout/navigation.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/styles/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: CSS variables `--carbon`, `--graphite`, `--mineral`, `--ultraviolet`, `--violet-ink`, `--violet-light`, `--titanium`, `--titanium-ink`, `--white`, `--font-instrument`, and `--font-plex-mono`.
- Consumed by: `homepage.module.css` and all new homepage components.

- [ ] **Step 1: Copy exact licensed font assets into the source tree**

Copy the Latin variable Instrument Sans WOFF2 and IBM Plex Mono 500 WOFF2 from their installed Fontsource packages into the approved filenames. Copy each package's `LICENSE` to its corresponding OFL filename. Verify both WOFF2 files are non-empty and the license files contain `SIL OPEN FONT LICENSE`.

- [ ] **Step 2: Write failing navigation/footer tests**

The navigation test must render at `/` and assert visible links `Expertise`, `Approach`, `Experience`, and `Discuss the mandate`, with destinations `#capabilities`, `#system-trace`, `/institutional-experience`, and `/contact`. It must assert the obsolete `Get Started` label is absent.

The footer test must assert `Services`, `Contact`, `LinkedIn`, `Privacy`, and `Terms` exist and that neither `admin@ulixescorp.com` nor the existing phone number is rendered.

Run:

```bash
npm run test:run -- src/components/layout/navigation.test.tsx src/components/layout/footer.test.tsx
```

Expected: FAIL against the existing global layout.

- [ ] **Step 3: Load self-hosted fonts and final metadata**

In `src/app/layout.tsx`, replace Google font imports with two `next/font/local` definitions:

```ts
const instrumentSans = localFont({
  src: '../assets/fonts/InstrumentSans-Variable.woff2',
  variable: '--font-instrument',
  weight: '400 700',
  display: 'swap',
})

const plexMono = localFont({
  src: '../assets/fonts/IBMPlexMono-Medium.woff2',
  variable: '--font-plex-mono',
  weight: '500',
  display: 'swap',
})
```

Set title to `Ulixes Corporation | Senior-Led Calypso Advisory`, use the final description from the spec for standard/Open Graph/Twitter metadata, and render JSON-LD for `Organization` plus related `Person` with `jobTitle: "President"` and the supplied LinkedIn URL.

- [ ] **Step 4: Replace global design tokens without breaking interior routes**

Define the nine approved colors in `:root`, map legacy `--bg-*`, `--text-*`, and `--accent` variables to compatible values, change the body family to Instrument Sans, and reserve IBM Plex Mono for utility text. Keep `min-height`, safe-area variables, and focus-visible support. Remove the universal delayed fade fallback selector because it can flash hidden content into view; use explicit reduced-motion rules instead.

- [ ] **Step 5: Rebuild navigation and footer content**

Navigation requirements:

- wordmark text `ULIXES`, no terminal brackets;
- transparent on homepage before 24px scroll, Carbon surface afterward and on interior routes;
- homepage anchor links use local hashes; interior routes use `/#capabilities` and `/#system-trace`;
- CTA text `Discuss the mandate` links to `/contact`;
- mobile dialog traps focus, closes on Escape/link activation, restores scroll, and uses 44px controls.

Footer requirements:

- approved advisory line;
- exact links from Section 17 of the spec;
- external LinkedIn link with `target="_blank"` and `rel="noreferrer"`;
- no email, phone, location, metrics, or client claims.

- [ ] **Step 6: Pass component tests and production build**

Run:

```bash
npm run test:run -- src/components/layout/navigation.test.tsx src/components/layout/footer.test.tsx
npm run build
```

Expected: all tests pass and Next production build completes.

- [ ] **Step 7: Commit Task 3**

```bash
git add src/assets/fonts src/app/layout.tsx src/lib/content.ts src/components/layout/navigation.tsx src/components/layout/navigation.test.tsx src/components/layout/footer.tsx src/components/layout/footer.test.tsx src/styles/globals.css tailwind.config.ts
git commit -m "feat: establish Ulixes visual foundation"
```

---

### Task 4: Full-Bleed Homepage Hero

**Files:**
- Create: `src/components/home/homepage.module.css`
- Create: `src/components/home/homepage-hero.tsx`
- Create: `src/components/home/homepage-hero.test.tsx`

**Interfaces:**
- Consumes: `homepageContent.hero` and the six public media paths from Task 2.
- Produces: `HomepageHero(): JSX.Element` and the `#homepage-hero` landmark.

- [ ] **Step 1: Write the failing hero test**

Assert that the rendered component contains:

- exact headline and body;
- `/contact` primary CTA and `#capabilities` secondary CTA;
- attributed proof text beginning `Ulysses Williams`;
- desktop WebM before desktop MP4 and mobile WebM before mobile MP4;
- `autoPlay`, `muted`, `loop`, `playsInline`, and no controls/audio content;
- decorative video with `aria-hidden="true"`;
- responsive poster picture present independently of video readiness.

Run: `npm run test:run -- src/components/home/homepage-hero.test.tsx`

Expected: FAIL because `HomepageHero` does not exist.

- [ ] **Step 2: Implement the media readiness boundary**

Render a priority `<picture>` poster as the LCP surface, with a mobile `<source media="(max-width: 767px)">`, desktop fallback `<img>`, `fetchPriority="high"`, fixed intrinsic dimensions, empty alt text, and `aria-hidden="true"`. Render `<video>` above it at opacity zero; on `canplay`, set one local boolean and reveal the video with a 220ms opacity transition. On `error`, retain the poster permanently. Do not remove the poster from the DOM after playback starts.

Use media-specific `<source>` order:

```tsx
<source media="(max-width: 767px)" src="/media/hero/ulixes-signal-mobile-1080.webm" type="video/webm" />
<source media="(max-width: 767px)" src="/media/hero/ulixes-signal-mobile-1080.mp4" type="video/mp4" />
<source src="/media/hero/ulixes-signal-desktop-1440.webm" type="video/webm" />
<source src="/media/hero/ulixes-signal-desktop-1080.mp4" type="video/mp4" />
```

- [ ] **Step 3: Implement the protected composition**

In `homepage.module.css`, create the desktop safe zone with `min-height: clamp(720px, 92svh, 960px)`, 12-column positioning, maximum copy width 520px, maximum headline 64px, and right-biased media geometry. Use the exact copy scrim `linear-gradient(90deg, rgba(8,9,12,.92) 0%, rgba(8,9,12,.68) 34%, rgba(8,9,12,.18) 52%, transparent 68%)` and the exact 132px navigation scrim `linear-gradient(180deg, rgba(8,9,12,.72) 0%, rgba(8,9,12,.24) 72%, transparent 100%)`. Use `min-height: 100svh` with content expansion on short mobile viewports; cap the mobile headline at 44px and apply safe-area padding.

The hero must contain no panel, card, video frame, pill badge, or split column.

- [ ] **Step 4: Add reduced-motion and anchor-focus behavior**

At `prefers-reduced-motion: reduce`, hide the video entirely and keep the poster. The secondary CTA handler scrolls to `#capabilities` and focuses its heading after scroll without preventing the normal hash fallback.

- [ ] **Step 5: Pass the hero tests**

Run: `npm run test:run -- src/components/home/homepage-hero.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add src/components/home/homepage.module.css src/components/home/homepage-hero.tsx src/components/home/homepage-hero.test.tsx
git commit -m "feat: build full-bleed cinematic homepage hero"
```

---

### Task 5: Semantic Signal Network and Lifecycle Interaction

**Files:**
- Create: `src/components/home/signal-network.tsx`
- Create: `src/components/home/system-trace.tsx`
- Create: `src/components/home/system-trace.test.tsx`
- Modify: `src/components/home/homepage.module.css`

**Interfaces:**
- `SignalNetworkProps = { activeStageId?: LifecycleStageId; highlightedStageIds?: readonly LifecycleStageId[]; renderMode?: 'path' | 'checkpoints' | 'closing'; className?: string }`.
- `SystemTrace(): JSX.Element` consumes `lifecycleStages` and produces `#system-trace`.

- [ ] **Step 1: Write failing lifecycle interaction tests**

Test the initial `Capture and enrich` panel, click selection, Enter/Space selection, Right/Left and Down/Up arrow selection, committed-state persistence after mouse leave, roving `tabIndex`, `aria-selected`, all six labels in document order, and a `<noscript>` fallback containing all six narratives.

Run: `npm run test:run -- src/components/home/system-trace.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 2: Implement a subject-specific SVG network**

Create one viewBox-based SVG with six named groups in lifecycle order. Every visible route segment receives a `data-stage-id` matching one of the six IDs. Do not draw unowned decorative branches. Set `aria-hidden="true"`; all meaning remains in adjacent HTML.

`renderMode="path"` uses one continuous highlighted route. `renderMode="checkpoints"` highlights stage nodes without filling the connecting route. `renderMode="closing"` converges all branches into one endpoint.

- [ ] **Step 3: Implement deterministic tab semantics**

Use a tablist with six buttons and one tabpanel. Pointer hover may add a preview class to a node but may not change the panel text. Click/tap/Enter/Space commits selection. Arrow keys move and commit selection with wrapping. Focus alone does not commit. Keep each selected stage active until another explicit input.

- [ ] **Step 4: Implement responsive visual behavior**

Desktop uses one wide Mineral canvas with labels positioned around the route. Mobile changes to a vertical trace, places selected detail directly below its stage, and avoids horizontal scrolling. Use a 220ms transform/opacity transition; do not animate path length continuously while idle.

- [ ] **Step 5: Pass lifecycle tests and accessibility scan by inspection**

Run: `npm run test:run -- src/components/home/system-trace.test.tsx`

Expected: PASS. Inspect rendered markup to confirm unique IDs, correct `aria-controls`, one selected tab, and readable no-JavaScript content.

- [ ] **Step 6: Commit Task 5**

```bash
git add src/components/home/signal-network.tsx src/components/home/system-trace.tsx src/components/home/system-trace.test.tsx src/components/home/homepage.module.css
git commit -m "feat: add lifecycle consequence trace"
```

---

### Task 6: Shared Capability Stage

**Files:**
- Create: `src/components/home/capability-stage.tsx`
- Create: `src/components/home/capability-stage.test.tsx`
- Modify: `src/components/home/homepage.module.css`

**Interfaces:**
- Consumes: `capabilities`, `LifecycleStageId`, and `SignalNetwork`.
- Produces: `CapabilityStage(): JSX.Element` and `#capabilities`.

- [ ] **Step 1: Write failing capability tests**

Assert four semantic articles are always in the DOM, all approved descriptions are visible, Implementation activates all six stages, Migration activates four exact stages, Compliance activates three exact stages, Testing uses checkpoint mode, and no element has visual labels `tab`, `card`, `risk prevented`, or `outcome`.

Mock IntersectionObserver and assert that crossing the 45% activation line updates the active article and SVG mapping without hiding the other article copy.

- [ ] **Step 2: Run and confirm failure**

Run: `npm run test:run -- src/components/home/capability-stage.test.tsx`

Expected: FAIL because `CapabilityStage` does not exist.

- [ ] **Step 3: Implement desktop shared-stage behavior**

Render a sticky `SignalNetwork` beside four naturally scrolling `<article>` elements. Create one IntersectionObserver with `rootMargin: '-45% 0px -54% 0px'`; set the active capability when an article intersects. Each article heading is a real button/link target that scrolls its own article to the activation line and then focuses it.

- [ ] **Step 4: Implement mobile sequential behavior**

At widths below 768px, remove sticky positioning and render one static signal snapshot within each article. Keep all copy visible and disable observer-driven visual changes. Do not create an accordion, horizontal tab strip, carousel, or miniature card grid.

- [ ] **Step 5: Pass capability tests**

Run: `npm run test:run -- src/components/home/capability-stage.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit Task 6**

```bash
git add src/components/home/capability-stage.tsx src/components/home/capability-stage.test.tsx src/components/home/homepage.module.css
git commit -m "feat: connect capabilities to the system trace"
```

---

### Task 7: Representative Mandates, Senior Judgment, and Closing Signal

**Files:**
- Create: `src/components/home/representative-mandates.tsx`
- Create: `src/components/home/senior-judgment.tsx`
- Create: `src/components/home/closing-signal-cta.tsx`
- Create: `src/components/home/index.ts`
- Modify: `src/components/home/homepage.module.css`

**Interfaces:**
- Consumes: `representativeMandates`, `homepageContent.senior`, `homepageContent.closing`, and `SignalNetwork`.
- Produces: `#experience`, the LinkedIn external action, and final `/contact` conversion action.

- [ ] **Step 1: Add editorial rendering tests to the content contract**

Extend `homepage-content.test.ts` to render these three components and assert:

- exactly three mandate headings and paragraphs;
- no `client`, `metric`, `result`, or percentage label;
- exact President attribution and four named regions;
- LinkedIn opens in a new tab with `rel="noreferrer"` and an explicit accessible name;
- closing CTA links to `/contact`;
- no standalone `About` heading appears.

Run: `npm run test:run -- src/lib/homepage-content.test.ts`

Expected: FAIL because the components do not exist.

- [ ] **Step 2: Implement one continuous mandate composition**

Render the three mandates as full-width editorial movements sharing one evolving route edge. Use a large title, one 45–60 word paragraph, and a stage-specific route segment; do not render repeated field labels, cards, logos, images, or result columns.

- [ ] **Step 3: Implement senior attribution**

Render the exact approved heading/body and LinkedIn action. Keep the section compact and integrate it into the signal edge. Use no portrait, quote marks, testimonial treatment, or About label.

- [ ] **Step 4: Implement closing convergence**

Render `SignalNetwork` with `renderMode="closing"`, the exact final headline/body, and one `/contact` action. The route must converge toward the action without replaying the hero video or adding a second ambient loop.

- [ ] **Step 5: Pass editorial tests**

Run: `npm run test:run -- src/lib/homepage-content.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit Task 7**

```bash
git add src/components/home src/lib/homepage-content.test.ts
git commit -m "feat: complete homepage evidence and conversion flow"
```

---

### Task 8: Homepage Assembly and Static Regression Gates

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `README.md`
- Modify: `src/components/sections/index.ts` only if unused homepage exports cause an import cycle; do not delete legacy files used by interior routes.

**Interfaces:**
- Consumes all Task 4–7 components.
- Produces the complete `/` route in this order: `HomepageHero`, `SystemTrace`, `CapabilityStage`, `RepresentativeMandates`, `SeniorJudgment`, `ClosingSignalCTA`.

- [ ] **Step 1: Write a failing server-render regression test**

Add a homepage render test that asserts the six section landmarks appear in the approved order, the obsolete terminal content is absent, and the strings `20 successful implementations`, `Weeks 1–2`, `Our Philosophy`, and `Get Started` do not appear.

- [ ] **Step 2: Replace the homepage composition**

Make `src/app/page.tsx` a minimal server component:

```tsx
import {
  CapabilityStage,
  ClosingSignalCTA,
  HomepageHero,
  RepresentativeMandates,
  SeniorJudgment,
  SystemTrace,
} from '@/components/home'

export default function HomePage() {
  return (
    <div data-homepage>
      <HomepageHero />
      <SystemTrace />
      <CapabilityStage />
      <RepresentativeMandates />
      <SeniorJudgment />
      <ClosingSignalCTA />
    </div>
  )
}
```

- [ ] **Step 3: Update project documentation**

Replace the obsolete Obsidian/terminal/emerald README description. Document current fonts/colors, homepage architecture, `npm run test:run`, `npm run media:verify`, master regeneration parameters, production build, and Vercel deployment workflow.

- [ ] **Step 4: Run all static gates**

Run:

```bash
npm run test:run
npm run media:verify
npx tsc --noEmit
npm run build
npm run lint
```

If the existing Next 14 `next lint` command fails because of repository configuration rather than source errors, capture the exact failure and use `npx eslint src --ext .ts,.tsx` as the lint gate. Do not suppress actual lint violations.

- [ ] **Step 5: Commit Task 8**

```bash
git add src/app/page.tsx src/components/sections/index.ts README.md
git commit -m "feat: assemble redesigned Ulixes homepage"
```

---

### Task 9: Full Browser, Responsive, Accessibility, and Visual QA

**Files:**
- Modify only files implicated by verified defects.
- Create: `artifacts/homepage-qa/` screenshots for internal review; exclude them from the production bundle and git unless needed as regression fixtures.

**Interfaces:**
- Consumes the complete local production build.
- Produces a QA-passed homepage ready to show and deploy.

- [ ] **Step 1: Start the production build locally**

Run `npm run build`, then `npm start` on an available local port. Use the in-app browser rather than the old static visualization server.

- [ ] **Step 2: Verify desktop composition and flow**

At 1440×900, 1920×1080, and 1280×800:

- inspect the full page screenshot;
- confirm the hero video is edge-to-edge, sharp, and free of copy-zone collisions;
- confirm headline remains at most two lines at 1440×900;
- activate every lifecycle stage by pointer and keyboard;
- scroll through every capability activation;
- verify all links and no console/network errors;
- confirm section transitions read as one signal narrative rather than stacked templates.

- [ ] **Step 3: Verify mobile and short viewport behavior**

At 320×568, 375×812, 390×844, and 414×896:

- inspect full-page and hero screenshots;
- assert `document.documentElement.scrollWidth === document.documentElement.clientWidth`;
- confirm the mobile art direction is loaded and copy does not overlap active geometry;
- open/close the menu with touch and keyboard;
- verify vertical lifecycle selection and sequential capability snapshots;
- confirm no fixed-height hero clipping and all controls are at least 44×44px.

- [ ] **Step 4: Verify reduced motion and media fallback**

Emulate `prefers-reduced-motion: reduce` and confirm the poster remains, video is not visible, and every section is understandable. Block both video URLs and reload; confirm no broken icon, white flash, missing CTA, layout shift, or console error.

- [ ] **Step 5: Verify contrast, semantics, and performance behavior**

Inspect all video frames/crops against the fixed scrims; use the Carbon navigation surface if any frame fails. Verify one H1, ordered headings, landmarks, tab semantics, visible focus, external-link label, and no color-only selection. Confirm the poster is the LCP candidate and video sources are not both downloaded across desktop/mobile media queries.

- [ ] **Step 6: Fix verified defects and rerun the complete matrix**

For every defect, add or tighten a regression test before changing implementation. Repeat Steps 2–5 until all breakpoints and states pass.

- [ ] **Step 7: Commit QA fixes**

```bash
git add src public README.md package.json package-lock.json scripts
git commit -m "fix: complete homepage responsive and accessibility QA"
```

Skip the commit only when `git status --short` proves no QA changes were needed.

---

### Task 10: Integration, GitHub, Vercel Production Deployment, and Live Verification

**Files:**
- No planned source changes; modify only files implicated by release verification.

**Interfaces:**
- Consumes: the QA-passed feature branch.
- Produces: updated `main`, matching GitHub, and verified Vercel production deployment.

- [ ] **Step 1: Run final verification from the feature worktree**

Run:

```bash
npm run test:run
npm run media:verify
npx tsc --noEmit
npm run build
git status --short
git log --oneline --decorate -10
```

Expected: all gates pass; the feature worktree is clean.

- [ ] **Step 2: Perform two-stage code review**

Use a specification reviewer to compare the branch against the approved design spec, then a code-quality reviewer to inspect accessibility, responsiveness, performance, tests, and unrelated changes. Resolve every P0/P1 finding and rerun Step 1.

- [ ] **Step 3: Fast-forward the original `main` checkout without touching the user's API edit**

In the original checkout, confirm the only pre-existing unstaged file is `src/app/api/contact/route.ts`. Fast-forward `main` to `codex/ulixes-homepage-redesign`. Abort if Git reports that the user's file would be overwritten.

- [ ] **Step 4: Push the verified commit history to GitHub**

Run `git push origin main`, then confirm `git rev-parse main` equals `git rev-parse origin/main`.

- [ ] **Step 5: Deploy the exact Git commit to Vercel production**

Do not deploy from the dirty original checkout. Create a temporary detached worktree at `origin/main`, link it to the existing Vercel project, and run the current Vercel CLI production deployment from that clean worktree. Record the deployment URL and production alias; remove only the temporary worktree after deployment completes.

- [ ] **Step 6: Verify the live production site**

Open the production alias and repeat critical smoke tests: full-bleed hero playback/poster, desktop/mobile crop, lifecycle keyboard selection, capability activation, menu, contact CTA, LinkedIn, legal links, console errors, failed assets, and source metadata.

- [ ] **Step 7: Report completion**

Provide the production URL, Git commit, tests/build results, media resolutions and sizes, exact browser matrix, and confirmation that the user's unstaged `src/app/api/contact/route.ts` change remains local and was not deployed.
