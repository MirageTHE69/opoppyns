# Poppyns Communications

Website for Poppyns Communications, built with Next.js (App Router) and TypeScript.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Editing content

All copy, links and images live in `src/content/`:

- `src/content/home.ts` — every section of the home page
- `src/content/site.ts` — email, Instagram, nav links and the accent colour

Components in `src/components/` read from these files, so text changes never need to touch layout code.

## Structure

```
src/
  app/            layout, page, global styles, favicon
  components/
    home/         one component per home-page section
    shared/       nav, footer, marquee, scroll-motion controller
  content/        all site copy
```
