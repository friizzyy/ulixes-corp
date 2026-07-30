# Ulixes Corporation

The production website for Ulixes Corporation, a senior-led Calypso advisory
practice. It is built with the Next.js App Router, React, TypeScript, CSS
Modules, Tailwind CSS, and narrowly scoped Framer Motion interactions.

## Local development

Requirements:

- Node.js 20 or newer
- npm

```bash
npm ci
npm run dev
```

The development server is available at
[http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_SITE_URL` controls canonical and social metadata. Copy
`.env.example` to `.env.local` when a local override is needed.

## Design system

Instrument Sans is the primary display and body face. IBM Plex Mono is reserved
for technical labels and signal annotations. Both fonts are self-hosted through
Fontsource packages; the site does not depend on a runtime font request.

The core palette is deliberately restrained:

| Token | Value | Role |
| --- | --- | --- |
| Carbon | `#08090C` | Primary dark field |
| Graphite | `#15171D` | Secondary dark field |
| Mineral | `#E9E9E4` | Light editorial field |
| White | `#F7F7F4` | Primary text on dark |
| Titanium | `#8A8D96` | Supporting text |
| Ultraviolet | `#8B5CF6` | Primary action and system signal |
| Violet ink | `#5B3FC4` | Accessible signal on light fields |
| Violet light | `#A78BFA` | Signal and focus treatment on dark fields |

The homepage uses one continuous signal-system composition rather than a stack
of interchangeable cards. Its six sections are assembled in `src/app/page.tsx`
and implemented under `src/components/home/`:

1. `HomepageHero` — full-bleed responsive motion with protected copy space
2. `SystemTrace` — an interactive trade-lifecycle consequence map
3. `CapabilityStage` — capability narratives mapped to the same shared system
4. `RepresentativeMandates` — concrete engagement patterns
5. `SeniorJudgment` — direct attribution to Ulysses Williams
6. `ClosingSignalCTA` — the system paths converge into one contact action

Editorial content and lifecycle relationships live in
`src/lib/homepage-content.ts`. Existing components under
`src/components/sections/` remain available to interior routes.

## Verification

Run the complete static test and build gate before review or deployment:

```bash
npm run test:run
npm run media:verify
npm run verify:links
npx tsc --noEmit
npm run build
npm run lint
npm audit --omit=dev
```

`npm run media:verify` validates video and poster dimensions, duration, audio
absence, byte budgets, decodability, and seamless-loop similarity. It does not
require the ignored 4K masters.

## Hero media pipeline

The deployable media is committed under `public/media/hero/`. The source masters
are intentionally kept outside the deployment bundle at:

```text
design-assets/hero/ulixes-signal-desktop-master-4k.mp4
design-assets/hero/ulixes-signal-mobile-master-4k.mp4
```

The masters were generated as separate six-second, silent 4K loops with
Higgsfield Seedance 2.0 in standard mode, high bitrate, a locked camera, and the
approved still supplied as both the start and end image:

| Master | Resolution | Aspect ratio | Duration |
| --- | ---: | ---: | ---: |
| Desktop | 3840×2160 | 16:9 | 6 seconds |
| Mobile | 2160×3840 | 9:16 | 6 seconds |

To regenerate the browser assets after placing both masters at the paths above:

```bash
npm run media:prepare
npm run media:verify
npm run media:inspect
```

The preparation script creates:

- desktop VP9 WebM at 2560×1440 (`CRF 24`) and H.264 MP4 at 1920×1080
  (`CRF 19`, slow preset);
- mobile VP9 WebM at 1080×1920 (`CRF 25`) and H.264 MP4 at 1080×1920
  (`CRF 20`, slow preset);
- frame-zero AVIF posters at quality 56 and effort 8.

The mobile delivery applies the same centered, top-anchored `1.16x` crop to both
videos and the poster so the protected text zone remains clear. All videos are
silent. Exact generation IDs, FFmpeg parameters, checksums, loop scores, and
frame-inspection results are preserved in `design-assets/hero/README.md`.

## Production build

```bash
npm ci
npm run build
npm start
```

The optimized Next.js application is produced in `.next/`. Do not commit that
directory or deploy the ignored 4K master files.

## Vercel deployment

Production deploys must come from a clean, verified Git commit that matches
GitHub. The normal workflow is:

```bash
git push origin main
npx vercel link
npx vercel --prod
```

When the repository is connected to Vercel, the push can also create the
deployment automatically. Before promoting or manually deploying, confirm the
local commit equals `origin/main`, rerun the verification gate above, and set
`NEXT_PUBLIC_SITE_URL` in Vercel for the Production environment.

After deployment, verify the production alias on desktop and mobile, including
hero playback and poster fallback, lifecycle keyboard behavior, capability
activation, navigation, contact actions, LinkedIn and legal links, console
errors, failed assets, and canonical/social metadata.

## License

Proprietary. All rights reserved by Ulixes Corporation.
