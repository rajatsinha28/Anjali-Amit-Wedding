# Anjali & Amit Royal Wedding Invitation — Account Handoff

Last updated: 22 November 2026
Base source commit before the current mobile-experience refinements: `2ab3827`
Project root: `C:\Users\sinha\OneDrive\Documents\ChatGPT\Rajat\wedding-invitation`

## Start here on a new account

1. Open the project root above and read this file before editing.
2. Run `git status --short` and preserve any user changes.
3. Run `npm ci`, then `npm run dev` for local work.
4. Use `http://127.0.0.1:5173/?intro=1` to force the complete opening. A normal refresh may skip it because `sessionStorage["intro.opened"]` is intentional.
5. Before delivery run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:content`, and `npm run build`.

The project files—not the old chat or files in Downloads—are now the implementation source of truth. All production artwork and approved photographs needed by the current build are already under `assets-src/masters`.

## Current hosted invitation

- Live URL: <https://anjali-amit-royal-wedding.yashu78761.chatgpt.site>
- Force-opening URL: <https://anjali-amit-royal-wedding.yashu78761.chatgpt.site/?intro=1>
- ChatGPT Sites project ID: `appgprj_6b0084ed640c81918b4de33a6260156f`
- Current deployed Site version: `5`
- Hosting manifest: `.openai/hosting.json`
- Static output: `dist`
- Audience at last deployment: `custom` (owner plus one external viewer)

Important account-transfer limitation: the Site is owned by the original ChatGPT workspace/account. A different account may be able to edit the local project but may not have permission to publish to the same Sites project. If Sites access is denied, do not replace the stored project ID blindly. Either ask the owner to grant access, create a new Site intentionally, or deploy the `dist` build to Netlify.

On 22 November 2026, the current account's Sites connector returned `project_not_found` for the
stored project ID. The tested local refinements from that date are therefore not published to the
testing URL yet. Preserve the project ID; do not create a replacement Site without Rajat's request.

No credentials, repository tokens, or bypass tokens are stored in this project.

## Product direction and locked decisions

- Theme: memorable royal Rajasthani × Awadhi/Lucknowi wedding experience.
- Palette: deep burgundy/wine, antique gold, champagne, warm ivory.
- Mobile-first; primary review widths are 320, 360, 390 and 430 px.
- Hero shows only `Anjali` and `Amit`. Do not add “daughter of,” “son of,” parents, or family names to the hero unless explicitly requested again.
- Opening contains only the original Devanagari/Sanskrit text—no English transliteration above `TAP TO OPEN`.
- Music attempts to begin when the page opens, loops from the beginning, and retries on the first
  browser-approved interaction if autoplay is blocked.
- Ceremony cards must not link to Maps. The separate venue section owns the map/directions action.
- Photo-book captions such as “Sweet memories” were intentionally removed. Pages contain centred photos only.
- Maintain the same royal background through all sections; avoid black section gaps.
- Preserve reduced-motion behavior and mobile touch targets.

## Confirmed wedding data

- Bride: Anjali
- Bride's parents and invitation hosts: Mr. Neeraj Srivastava and Mrs. Roli Srivastava
- Groom: Amit
- Groom's parents retained in config for non-hero use: Mr. Rajendra Prasad and Mrs. Rajpati Devi
- Haldi: 9 December 2026, 11:00 AM
- Mehendi & Sangeet: 9 December 2026, 7:00 PM
- Wedding ceremony: 10 December 2026, 8:00 PM
- Baraat/countdown instant: 10 December 2026, 9:00 PM IST
- Venue: Chancellor Club, K-1, Ashiyana Colony, Lucknow, Uttar Pradesh 226012
- Maps URL: <https://maps.app.goo.gl/W2WcjwtsU7tR4kS16?g_st=aw>
- Canonical structured data: `src/config/wedding.ts`
- Canonical display copy: `src/config/copy.ts`

## What is complete

1. Preloader and sacred Ganesha opening.
   - Exact heading: `श्री गणेशाय नमः`
   - Exact verse: `वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।` / `निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥`
   - Self-hosted Noto Serif Devanagari 600 heading and Tiro Devanagari Sanskrit verse.
   - Soft golden halo, restrained sparkles, full uncropped idol and `TAP TO OPEN`.
2. Stable royal-door-to-hero handoff.
   - One hero instance is mounted and preloaded behind the doors.
   - Doors, floral overlay and centre seam leave together.
   - Portrait deblurs once; jharokha/side strings settle; Anjali and Amit reveal sequentially.
   - Refresh skip and `?intro=1` forced intro are supported.
3. Hero composition with the approved couple portrait, jharokha and names only.
4. One-time royal farmaan scroll from the bride's parents with simplified, easy-to-read Hindi; it
   unfurls downward and never resets on reverse scrolling.
5. Scratch-to-reveal date card, countdown and calendar export. The reveal threshold is 50%, reduced
   from 62% so three broad mobile swipes can reveal the date.
6. “Little moments” four-spread photo book with eight slots, page-turn animation and no captions.
7. Three interactive ceremony chapters with quicker independent one-time unrolling scrolls,
   responsive/reduced-motion behavior and no venue links.
8. Separate royal venue/map chapter. Its action routes to mobile Maps behavior for iOS/Android and the supplied Google Maps URL.
9. Circular closing portrait with slowly rotating lettering, bride's-parents host sign-off and an accessible expandable family note.
10. Consistent mobile layout, shared royal background, responsive images, local fonts, `noindex`, content locks and test coverage.

## What remains / needs user input

1. **Chancellor Club image:** Rajat will provide the final club photograph. Replace the live map
   iframe with that photograph while keeping the whole image/card linked to the supplied Google
   Maps URL. Do not invent or generate the venue image.
2. **Final visual feedback:** Rajat planned to review the complete invitation and provide consolidated changes after the full build.
3. **Production hosting:** Netlify deployment is intentionally postponed until final approval. The current ChatGPT Sites URL is for testing.
4. **Photo uniqueness:** the book has eight configured slots but six unique approved source photographs; `album-final-evening` is intentionally reused in slots 3, 6 and 8 because the supplied “final eight” attachments contained repeated files. Replace repeats only if new photographs are provided.
5. **Optional data not supplied:** RSVP WhatsApp number and deadline are `null`; no livestream URL is supplied. Do not invent them.

## Replaceable files and asset workflow

Never edit generated files in `public/assets` or `src/generated/assets-manifest.json` by hand. Replace a master, keep its manifest ID stable, then run `npm run assets`.

### Main replacements

| Purpose                | Source master                                               | Configuration                        |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------ |
| Ganesha idol           | `assets-src/masters/ganesh/ganesh-idol.png`                 | asset ID `ganesh-idol`               |
| Royal doors            | `assets-src/masters/palace/door-left.png`, `door-right.png` | `RoyalDoors`                         |
| Hero couple photo      | `assets-src/masters/couple/hero-portrait.jpg`               | `wedding.heroPortrait.focalPosition` |
| Hero jharokha          | `assets-src/masters/palace/portrait-jharokha.png`           | asset ID `portrait-jharokha`         |
| Hero side strings      | `assets-src/masters/florals/hero-side-string.png`           | asset ID `hero-side-string`          |
| Ceremony art           | `assets-src/masters/ceremonies/`                            | `Ceremonies.tsx` visual map          |
| Photo book             | `assets-src/masters/album/`                                 | `src/config/gallery.ts`              |
| Closing circular photo | currently asset ID `album-moment-01`                        | `wedding.closingPortrait`            |
| Invitation music       | `public/assets/audio/krishna-mahabharata-full.mp3`          | `wedding.music.src`                  |

The full resize/output registry is `assets-src/manifest.json`. `npm run build` runs `npm run assets` automatically.

### Current photo-book slot order

1. `album-final-celebration`
2. `album-final-mountain`
3. `album-final-evening`
4. `album-final-dance`
5. `album-final-cake`
6. `album-final-evening` (repeat)
7. `album-final-formal`
8. `album-final-evening` (repeat)

Crop/face focus and small rotations live in `src/config/gallery.ts`; adjust those values rather than modifying photographs destructively.

## Key code map

- App orchestration and intro/session state: `src/App.tsx`
- Sacred opening: `src/components/OpeningScreen/`
- Door system and seam: `src/components/RoyalDoors/`
- Hero timeline and composition: `src/components/HeroHandoff/`
- Shared royal frame: `src/components/RoyalFrame/`
- Welcome: `src/components/WelcomeLetter/`
- Scratch date/countdown/calendar: `src/components/DateReveal/`
- Photo book: `src/components/LittleMoments/`
- Ceremonies: `src/components/Ceremonies/`
- Separate venue/map: `src/components/Venue/`, `src/lib/maps.ts`
- Closing: `src/components/ClosingPortrait/`
- Wedding facts: `src/config/wedding.ts`
- Copy: `src/config/copy.ts`
- Album order/crops: `src/config/gallery.ts`
- Asset registry: `assets-src/manifest.json`
- Generated asset builder: `scripts/build-assets.mjs`
- Hosting identity: `.openai/hosting.json`
- Unit tests: `src/**/*.test.ts(x)`
- Locked-content tests: `tests/content-lock.test.ts`
- Mobile/end-to-end tests: `e2e/`

## Current opening/hero timing

Approximate time after `TAP TO OPEN`:

- 0–0.75 s: sacred overlay exits.
- 0.35–2.35 s: seam glows and fades fully.
- 0.75–2.45 s: doors leave the viewport.
- 1.8–4.0 s: prepared portrait appears and deblurs once.
- 2.3–3.6 s: jharokha and side strings settle.
- 3.65–4.75 s: Anjali reveals.
- 4.75–5.3 s: ampersand/divider reveals.
- 5.25–6.35 s: Amit reveals.
- About 6.55–7.05 s: scroll cue reveals.

Root cause of the old mobile “reload” defect: the hero first painted sharp, then a delayed `doors:progress` handler started a second `fromTo` animation that reset its opacity. CSS also forced both names visible when `opened` changed, racing GSAP, and the seam keyframe ended visibly instead of fading to zero. These competing triggers were replaced with one guarded reveal timeline and animation-end plus timer cleanup.

## Commands and verification

```text
npm ci
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:content
npm run build
npm run test:e2e
```

Last completed verification on 22 November 2026:

- TypeScript: passed
- ESLint + Prettier: passed
- Unit tests: 40 passed
- Locked-content tests: 4 passed
- Production build: passed
- Focused 390×844 mobile journey, one-time welcome/ceremony reveals, scratch reduction and hero
  spacing: passed
- Real-motion 390×844 opening/hero frame sequence: captured successfully under `test-results/handoff-final-3` during development (the directory is normally ignored and is not required for production)
- Reduced-motion fallback is enforced directly by CSS as well as the JS timeline

Known local tooling issue: on this Windows/OneDrive setup, Playwright's auto-started Vite server sometimes remains alive after the test completes, and deleting an old `test-results/phase-3` directory may report `EPERM`. Use a fresh `--output` directory or stop the owned Vite process; this is a test-runner teardown issue, not a runtime invitation defect.

## Publishing

### ChatGPT Sites

Preserve `.openai/hosting.json` and the exact project ID. A permitted account should use the Sites source-repository workflow, push the tested commit, save a version with the packaged archive, then deploy that saved version while preserving the current audience. Never store short-lived Sites/Git credentials in files.

### Netlify after approval

1. Run `npm ci` and `npm run build`.
2. Deploy the `dist` directory as a static site.
3. No server functions or environment variables are currently required.
4. Test `/?intro=1`, normal refresh/skip behavior, scratch reset, album, ceremonies and mobile Maps before sharing the production URL.

## Historical source material

Old master prompts, screenshots, videos and WhatsApp originals in `C:\Users\sinha\Downloads` and Codex attachment folders were references, not runtime dependencies. Their accepted outcomes are consolidated here and in the source. If moving to another computer, copy the entire `wedding-invitation` folder—including hidden `.openai`, `assets-src`, `public`, `src`, tests, `package-lock.json`, `AGENTS.md` and this file. `node_modules`, `dist`, Playwright reports and test results can be regenerated.

When a new request conflicts with this handoff, the newest explicit instruction from Rajat wins; update this handoff at the end of that work.
