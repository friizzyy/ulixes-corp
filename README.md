# Ulixes Corporation website

The public website for Ulixes Corporation, built with the Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, and Framer Motion.

## Requirements

- Node.js 22.13+ or 24+
- npm

The production Vercel project uses Node.js 24, which is supported by the package's engine range.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

## Environment variables

The contact form requires these variables locally and in Vercel:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends contact-form submissions through Resend. |
| `RECAPTCHA_SITE_KEY` | reCAPTCHA site key used by the browser. |
| `RECAPTCHA_SECRET_KEY` | Verifies reCAPTCHA tokens on the server. |

`next.config.js` exposes `RECAPTCHA_SITE_KEY` to client code as `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Do not expose `RECAPTCHA_SECRET_KEY` to the browser.

## Public routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services` | Services |
| `/institutional-experience` | Institutional experience |
| `/nasdaq-calypso` | Nasdaq Calypso |
| `/contact` | Contact |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

The contact form submits to `/api/contact`. Legacy `/about` and `/philosophy` requests redirect permanently to `/institutional-experience`.

## npm commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint across the repository. |
| `npm test` | Run Vitest in watch mode. |
| `npm run test:run` | Run the Vitest suite once. |
| `npm run verify:links` | Check the built site's internal links. |

## Production deployment

Production is deployed on Vercel using the repository's Next.js and `vercel.json` configuration. Add the required environment variables to the Vercel project, keep its Node.js runtime on version 24, and run `npm run build` before releasing.

## License

Proprietary - Ulixes Corporation
