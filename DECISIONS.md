# Decisions

## Phases 5–10 — complete invitation

- Date reveal uses a DPR-aware Canvas 2D foil layer with pointer capture, continuous stroke interpolation, a 62% logical-grid threshold, persistent state and an accessible button fallback.
- Countdown recomputes from the explicit 9 PM IST baraat instant. Calendar export is for the baraat only; `.ics` has no public end, while Google uses a documented 60-minute technical range.
- The book uses only supplied photography. With one approved photo it renders an intro/photo spread and closing spread; it does not duplicate or invent images. Five or six photos remain a release blocker.
- Ceremony chapters share one semantic component but use three palettes and three project-specific transparent artworks generated with built-in ImageGen.
- The venue chapter returns `null` until name, address and a trusted Maps URL are configured. No placeholder venue or guessed destination is shipped.
- The approved portrait is reused for the closing circle; the original family letter moved into a semantic disclosure.
- Later chapters are lazy-loaded to retain the initial JavaScript performance budget.

## Phase 4 — royal welcome letter

- Added one content-driven welcome panel directly after the hero on the continuous dark-plum canvas.
- Kept all new prose in `copy.welcome`; the component renders no family rows and invents no event facts.
- Reused the flower-string asset in narrow outer gutters and used CSS engraving for the double border and corners.
- Entrance runs once on viewport entry, settles immediately for reduced motion, and introduces no scroll lock.

## Hero spacing refinement

- Lengthened the mobile portrait/jharokha proportion, removed the short-screen 112svh expansion, and added a positive gap before the names so “Anjali” no longer touches the portrait.
- Replaced the scroll hint's automatic spacer with a bounded margin, keeping the first page balanced without a large artificial void beneath the names.
- Made the hero wrapper content-driven so it ends immediately after the scroll prompt instead of reserving an unused full-viewport tail.

## Phase 3R — revised portrait hero

- Replaced the illustrated parchment hero with the approved real couple portrait on a full-width dark-plum stage. The supplied photo is cropped to a face-safe 4:5 master with focal point 52% 43%.
- Only the bride and groom names appear below the portrait. Parent names and “Daughter of / Son of” labels were removed from the hero at the user's request. Short screens gain natural page height instead of shrinking the names.
- Portrait preparation begins only after `doors:progress >= 0.75`; name reveal is gated by door completion. Refresh and reduced-motion paths render settled.
- Built-in ImageGen produced the transparent portrait jharokha and flower-only side string. Petals are capped at 8 mobile, 12 larger, and 2 foreground.
- Canonical scroll copy is “Scroll to discover”. These Phase 3R decisions supersede the earlier notes below.

## Superseded Phase 3

- Generated three reusable transparent masters with the built-in image-generation tool: one
  jharokha frame incorporating the faint palace silhouette, one combined toran/hanging-foliage
  layer, and one rose-petal sprite.
- Kept Phase 3 to one fixed hero viewport until Phase 4 adds the next scrollable section. The scroll
  hint and its fade behavior are ready for that continuation.
- Used 10 background plus 4 foreground petals on mobile and 18 background plus 4 foreground petals
  on larger screens, preserving the specified low density and four-petal foreground cap.
- Refined the first-page reveal after visual review: all text waits for the completed-door event,
  the four couple/family groups use matched upward fades, family typography uses Cormorant
  Garamond, and the final indicator reads “Scroll to Explore”.

## Phase 2

- The English transliteration beneath the Sanskrit shloka was removed at Rajat's request. The
  Devanagari sacred text remains unchanged.
- Music uses one configured MP3 and starts directly from the TAP TO OPEN click. No source is
  currently configured, so the invitation remains silent and the toggle is hidden.
- Phase 2 ends on a neutral illuminated hero handoff surface. Names, family details, petals, and
  hero entrance choreography remain gated to Phase 3.

## Phase 0

- Migrated the existing untracked vanilla prototype in place and preserved it under
  `reference/legacy-prototype` instead of deleting it.
- Kept prototype artwork as non-production candidates pending licence and iconography review.
- Used React 18 with Vite 7 to honour the specified stack while retaining the compatible Vite major
  already present in the prototype.
- Used `null` for missing music, venue, map, RSVP, and photo values so components cannot accidentally
  publish invented details.
- Assigned calendar-only durations of 120 minutes for Haldi, 180 minutes for Mehendi & Sangeet, and
  240 minutes for the Wedding. These values are never displayed as invitation copy.
- Lazy-load GSAP and compile development tools out of production to protect the initial bundle.
- Keep the Phase 0 screen intentionally blank and ivory; readable locked copy remains available in
  the no-script fallback.

## Phase 1

- Generated original Ganesha, diya, matched royal-door, and floral-corner artwork with the built-in
  image-generation tool; no external reference images were used.
- Retained the generated originals and derived exact-size PNG masters before responsive AVIF/WebP
  conversion, making the asset process reproducible.
- Kept the TAP TO OPEN action at the Phase 1 gate: it provides press/ripple feedback but does not
  open the doors or start Phase 2 behavior.
- Use a fixed dynamic-viewport composition so every required element remains visible at 320×568
  through desktop.
- Mirror one generated corner raster for the remaining corners; no complex floral subject is drawn
  with CSS or SVG.

# Phase 6R

- Keep a permanent 1.52:1 responsive album stage so opening and page turns cannot change layout
  dimensions or move later invitation sections.
- Present eight photo slots as four two-photo spreads on every supported viewport; retain captions
  but remove the former romantic message and closing leaves.
- Repeat the first three approved album photos in slots 6–8 until the user supplies replacements;
  the dark-outfit closing portrait remains excluded from the book.
- Use GSAP only for the 1.2-second hardcover opening, 950ms double-sided 3D sheet turns, moving
  shadows and reduced-motion-safe state changes. No page-flip dependency is added.
- Count the hardcover opening as flip one, followed by three internal turns. Start Again resets the
  first spread with a short crossfade and is not an additional physical flip.
