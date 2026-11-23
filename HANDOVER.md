# Handover

## Current gate

The complete invitation flow is implemented through Phase 10: opening, hero, welcome letter, real
scratch canvas, 9 PM IST countdown/calendar, four-spread physical photo book, three ceremony
chapters, conditional venue, closing portrait, family disclosure and footer. The album currently
uses three clearly marked repeat slots awaiting replacement photographs.

The build is feature-complete but not release-ready because required inputs remain unavailable:

1. Confirmed venue name, full address and trusted Google Maps URL/map preview.
2. The royalty-free MP3 requested for post-tap playback.
3. Final family review of sacred and generated ceremonial artwork.

## Before launch

1. Have an elder review the Ganesha iconography.
2. Confirm the generated artwork and exact sacred text with both families.
3. Supply the royalty-free MP3, save it under `public/assets/audio/`, and set its path in
   `src/config/wedding.ts`. The current `null` value intentionally keeps audio and its toggle hidden.
4. Supply venue data using the steps in `README.md`.
5. Re-run `npm run verify` after any asset or content replacement.

Calendar defaults: `.ics` uses DTSTART only, a stable UID and a 30-minute VALARM. Google Calendar
uses a technical 60-minute end because its template requires a range. Neither implies a confirmed
public end time. Real iOS/Android calendar saving, in-app browsers and real-device performance remain
unverified; browser emulation is not proof of device behavior.

The legacy prototype is visual reference only. Its vertical door movement, primitive subject
drawings, copy, and timings do not override the master build specification.
