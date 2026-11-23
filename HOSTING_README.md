# Anjali & Amit Invitation — Hosting Guide

This folder is self-contained. It includes the complete source project and the latest production
build.

## Fastest Netlify preview

Drag the `dist` folder into Netlify Drop. The invitation is a static site and does not require a
server, environment variables, or Netlify Functions.

## Deploy from the complete source

Use these settings when importing this folder into Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: 22.12 or newer

The same settings are already stored in `netlify.toml`.

To build locally:

```text
npm ci
npm run build
```

Then host the generated `dist` directory.

## Important folders

- `src` — invitation components, copy, configuration and interactions
- `assets-src` — master photographs and artwork
- `public` — generated responsive assets, fonts and music
- `dist` — deploy-ready production website
- `e2e` and `tests` — automated verification
- `PROJECT_HANDOFF.md` — complete project history and maintenance context

Do not manually edit generated files in `public/assets` or `src/generated`. Replace the related
master in `assets-src/masters`, retain its asset ID, and run `npm run assets`.

The Chancellor Club photograph is still pending. Until it is provided, the current venue card and
Google Maps action remain in the build.
