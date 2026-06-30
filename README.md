# Prangshat Khamwiset — Portfolio

Personal portfolio of **Prangshat Khamwiset**, Product Designer. Built with **React 18** and **Vite 5**. Dark, editorial single-page site with scroll-reveal animations and two in-depth case studies (Easy Smart Ecosystem, MyMo).

## Tech stack

- React 18 + Vite 5 (`@vitejs/plugin-react`)
- No CSS framework — design tokens and styles are scoped in-component
- Native lazy-loaded images; all media served as static assets

## Project structure

```
.
├── index.html              # HTML shell + SEO / Open Graph / favicon meta
├── package.json
├── vite.config.ts
├── vercel.json             # Vercel build + SPA rewrite config
├── .gitignore
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png        # 1200×630 Open Graph image
│   ├── Resume_Prangshat_2026.pdf
│   └── assets/             # case-study & gallery images (JPEG, lazy-loaded)
└── src/
    ├── main.jsx            # React entry point
    └── App.jsx             # The full portfolio component (default export: Portfolio)
```

## Local development

Requires **Node.js 18+**.

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
```

## Deployment

### Vercel (recommended)
1. Push this repo to GitHub/GitLab.
2. Import the project in Vercel — it auto-detects Vite (`vercel.json` pins the build command, output dir, and SPA rewrite).
3. Deploy. No environment variables are required.

### Any static host (Netlify, Cloudflare Pages, S3, GitHub Pages)
Run `npm run build` and deploy the contents of `dist/`. Because the app is a single page with no client-side router, no special rewrite rules are needed; the included SPA rewrite is just a safety net.

## Assets & paths

All images and the résumé PDF live in `public/` and are referenced with root-absolute paths (`/assets/…`, `/Resume_Prangshat_2026.pdf`). Vite copies `public/` to the deploy root unchanged, so these paths resolve correctly in production. Images use native `loading="lazy"`.

## Production review

- **Accessibility** — semantic landmarks, descriptive `alt` text on every image, keyboard-focusable nav/buttons, `prefers-reduced-motion` disables animations, `lang="en"` set.
- **Performance** — media extracted from the JS bundle into cacheable static files (app JS is now ~tiny); images optimized (progressive JPEG) and lazy-loaded; fonts preconnected.
- **SEO** — descriptive `<title>` and meta description, canonical URL, Open Graph + Twitter card tags.
- **Favicon** — SVG favicon + `apple-touch-icon.png`.
- **Open Graph image** — `public/og-image.png` (1200×630).
- **Responsive** — verified down to 375px (mobile), 768px (tablet), and 1440px+ (desktop).

> Update the absolute URLs in `index.html` (`og:url`, `canonical`, image URLs) to your final production domain before launch.
