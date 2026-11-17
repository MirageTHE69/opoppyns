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
ADMIN_PASSWORD=your-password npm start   # admin login is off in production without it
```

## Admin panel (`/admin`) and Vercel setup

Locally the admin password is `admin123` (change it in the panel) and edits are saved to
`src/data/content.json` and `public/uploads/`.

The live site needs two things in the Vercel project, because the repo is public and
Vercel's server filesystem is read-only:

1. **`ADMIN_PASSWORD`**: Settings → Environment Variables. This is the only password the
   live admin accepts; without it, admin login is turned off.
2. **A Blob store**: Storage → Create → Blob (public), connected to this project. Vercel
   then adds `BLOB_READ_WRITE_TOKEN` automatically. Admin saves and image uploads are
   stored there and survive redeploys. Without it the public site still works, but the
   admin can't save.

Redeploy after changing either. Optional: `ADMIN_SESSION_SECRET` (any long random string)
adds a server-side secret to the session signing.

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
