# Anjali & Amit — Royal Wedding Invitation

For cross-account continuation, current status, locked decisions, pending work, asset replacement and deployment details, read [`PROJECT_HANDOFF.md`](PROJECT_HANDOFF.md) first.

Production-oriented, mobile-first royal wedding invitation with a sacred opening, portrait hero,
welcome letter, scratch-to-reveal date, live baraat countdown, calendar export, interactive album,
three ceremony chapters and circular portrait finale. All chapters form one naturally scrollable
experience after the royal doors.

## Requirements

- Node.js 22.12 or newer (the current workspace uses Node 24)
- npm 10 or newer
- Chromium installed through Playwright for end-to-end checks

## Commands

```text
npm install
npm run prepare:art
npm run assets
npm run dev
npm run verify
```

Open `/?dev=1` for development controls and `/dev/type-test` for the typography specimen. Both are
removed from production builds.

## Content and assets

Invitation copy lives only in `src/config`. Do not hard-code personal details in components. Source
artwork belongs in `assets-src`; add licensed masters to its manifest and run `npm run assets`.
Unlicensed or unverified images must stay outside the production manifest.

The original vanilla prototype is preserved in `reference/legacy-prototype` and is not part of the
runtime or quality checks. Generated Phase 1 artwork provenance and exact prompts are recorded in
`ASSETS.md` and `ASSET_PROMPTS.md`.

### Replacing photos

- Hero: replace `assets-src/masters/couple/hero-portrait.jpg`, run `npm run assets`, and adjust
  `wedding.heroPortrait.focalPosition` if needed.
- Closing portrait: the approved dark-outfit photograph is configured independently through
  `wedding.closingPortrait` and intentionally does not appear in the photo book.
- Album: the book has eight configured slots across four two-photo spreads. Slots 1–5 use the five
  approved book photographs; slots 6–8 intentionally repeat the first three until replacements are
  supplied. Add future approved masters to `assets-src/manifest.json`, run `npm run assets`, then
  replace only those placeholder slot entries in `src/config/gallery.ts`.

### Venue

Set `wedding.venue.name`, `address` and a trusted Google Maps `mapsUrl`. The venue chapter stays
absent until all three values are present; it never links to a guessed location.

### Date and calendar

The confirmed baraat instant is `2026-12-10T21:00:00+05:30` (15:30 UTC). Calendar helpers use a
60-minute technical Google template range and a 30-minute alarm. The invitation does not claim a
public baraat end time.

## Music

Place the supplied MP3 in `public/assets/audio/`, then set `wedding.music.src` in
`src/config/wedding.ts`. Playback begins directly from the TAP TO OPEN click so it complies with
mobile browser autoplay rules. When the source is `null`, the build remains silent and hides the
music toggle.
