# Build spec: the approved redesign

Every file here is the final, approved HTML and CSS of one section, exported from the
clickable prototype in `docs/mockups` (run it with the `mockups` launch config, port 4180).
`<page>/NN-<section>-desk.html` is the 1440px design, `-ph.html` is the 393px phone design,
`_full-desk.png` / `_full-ph.png` show the whole page as approved. Open a section file in a
browser to see it alone. The prototype is the source of truth for layout, type, spacing,
colour and copy. Do not redesign; translate.

## House rules (the client's, non-negotiable)

- No pills or chips anywhere (no rounded-full badges, tags or status capsules).
- No cursive and no serif italic. A headline's second half turns steel (`.s`), never italic.
- No brown or orange.
- Buttons are the Architect Slab: ink block, uppercase label, a divided arrow cell (`.btn`).
- Real site copy only. Never invent claims, numbers or testimonials.
- Premium and quiet: no gradients-for-decoration, no emoji, no generic SaaS patterns.

## Rhythm

The prototype crops each section so the visible gap between one section's last content
and the next section's first content is **128px on desktop** and **72px on phone**
(44px / 24px between a page header and the section below it). Section files carry their
own padding, which the prototype trimmed; build to the rhythm, not to the raw padding.

## Sizes

- `<= 767px`: the phone design (`-ph.html`), fluid from 320px up. Nothing may overflow at 320.
- `768px – 1099px`: tablet. Use the desktop composition, fluid: wrap padding 40px, four-up
  grids become two-up, side-by-side splits stack when they no longer fit, headline sizes
  scale with `clamp()`. No horizontal overflow at 768 or 1024.
- `>= 1100px`: the desktop design as drawn, `.wrap` max 1312px with 64px padding.

## Shared pieces (built once, in `src/components/site/`)

Tokens and primitives live in `src/styles/site.css` (colours, fonts, `.d`, `.s`, `.eb`,
`.m`, `.wrap`). Components: `Eyebrow`, `SlabButton`, `TextLink`, `Brand`, `CtaCard`
(the closing brief card, with a per-page headline), `SiteHeader` (desktop nav), `PhoneDock`
(phone bottom nav), `SiteFooter` (the page close). Page code imports these and never
re-styles them.

## Images

Prototype paths `img/<name>` map to `public/media/<page>/<name>`.
