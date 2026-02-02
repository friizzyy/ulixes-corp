# Ulixes Corporation Website

A premium, production-ready website for Ulixes Corporation built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Design Theme: Obsidian

Dark, sophisticated, terminal-inspired design featuring:
- Subtle grid background with emerald glow accents
- JetBrains Mono + Outfit typography pairing
- Animated terminal components
- Service cards with top-border reveal on hover
- Code block components with syntax highlighting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ulixes-corp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
ulixes-corp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # 404 page
│   │   ├── about/              # About page
│   │   ├── services/           # Services page
│   │   ├── work/               # Case studies page
│   │   ├── contact/            # Contact page
│   │   ├── privacy/            # Privacy policy
│   │   └── terms/              # Terms of service
│   │
│   ├── components/
│   │   ├── ui/                 # Design system primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── section.tsx
│   │   │   ├── terminal.tsx
│   │   │   ├── badge.tsx
│   │   │   └── icons.tsx
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── navigation.tsx
│   │   │   ├── footer.tsx
│   │   │   └── grid-background.tsx
│   │   │
│   │   └── sections/           # Page sections
│   │       ├── hero-section.tsx
│   │       ├── services-section.tsx
│   │       ├── stats-section.tsx
│   │       ├── expertise-section.tsx
│   │       └── cta-section.tsx
│   │
│   ├── lib/
│   │   ├── content.ts          # All site content (EDIT THIS)
│   │   ├── motion.ts           # Framer Motion variants
│   │   └── utils.ts            # Utility functions
│   │
│   └── styles/
│       └── globals.css         # Global styles & Tailwind
│
├── tailwind.config.ts          # Tailwind + design tokens
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## ✏️ Editing Content

All site content is centralized in `src/lib/content.ts`. Edit this single file to update:

- **Site metadata**: Company name, tagline, contact info
- **Navigation**: Menu items and links
- **Home page**: Hero copy, terminal lines, stats, CTA
- **Services**: Service titles, descriptions, features
- **Case studies**: Client stories, metrics, outcomes
- **About page**: Philosophy, approach, team info
- **Contact**: Form labels, success/error messages
- **Legal pages**: Privacy policy, terms of service

### Example: Updating a service

```typescript
// src/lib/content.ts
export const services = [
  {
    id: 'implementation',
    icon: '⚡',
    title: 'Implementation',
    shortDescription: 'Your new description here...',
    // ... rest of fields
  },
]
```

---

## 🎨 Design System

### Colors (Tailwind classes)

| Token | Class | Usage |
|-------|-------|-------|
| Primary BG | `bg-bg-primary` | Page background |
| Secondary BG | `bg-bg-secondary` | Cards, sections |
| Surface | `bg-surface` | Interactive elements |
| Border | `border-border` | Default borders |
| Accent | `text-accent` | Primary accent (emerald) |
| Text Primary | `text-text-primary` | Headings, primary text |
| Text Secondary | `text-text-secondary` | Body text |
| Text Muted | `text-text-muted` | Labels, hints |

### Typography

| Class | Usage |
|-------|-------|
| `text-display-xl` | Hero headlines |
| `text-display-lg` | Page titles |
| `text-display-md` | Section titles |
| `text-display-sm` | Subsection titles |
| `text-heading-lg/md/sm` | Card titles, headings |
| `text-body-lg/md/sm` | Body text |
| `text-label` | Labels, badges |
| `font-mono` | Code, technical text |

### Components

All components are in `src/components/ui/`:

- `Button` - Primary, secondary, ghost variants
- `Card` - With optional hover and highlight effects
- `Input` / `Textarea` - Form inputs with validation
- `Section` - Consistent page sections with animation
- `Terminal` - Animated terminal display
- `Badge` - Status badges with optional pulse

---

## 🔧 Customization

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  accent: {
    DEFAULT: '#10b981', // Change primary accent
    secondary: '#06b6d4', // Secondary accent
  },
}
```

### Changing Animations

Edit `src/lib/motion.ts` to adjust animation variants, durations, and easing.

### Adding New Pages

1. Create folder in `src/app/[page-name]/`
2. Add `page.tsx` (client component with 'use client')
3. Add `layout.tsx` (server component with metadata)
4. Add route to `navigation` in `src/lib/content.ts`

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Environment Variables

Set these in your deployment platform:

- `NEXT_PUBLIC_SITE_URL` - Your production URL

---

## 📋 QA Checklist

Before deployment, verify:

- [ ] All navigation links work
- [ ] All CTAs route correctly
- [ ] Contact form validates and shows success/error states
- [ ] Mobile menu opens/closes cleanly
- [ ] Animations don't cause jank
- [ ] `prefers-reduced-motion` is respected
- [ ] 404 page displays correctly
- [ ] All images have alt text
- [ ] Keyboard navigation works

---

## 📄 License

Proprietary - Ulixes Corporation
