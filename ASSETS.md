# Asset register

Phase 1 and Phase 3 artwork was generated specifically for this invitation on 2026-11-19 with
OpenAI's built-in image-generation tool. No third-party reference images were used. Generated originals are kept in
`assets-src/generated-originals`, exact-size PNG masters in `assets-src/masters`, and responsive
production outputs are emitted under `public/assets`.

| Asset                            | Source and licence status                                                                             | Review status                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `ganesh/ganesh-idol`             | Original AI generation for this project; prompt in `ASSET_PROMPTS.md`                                 | Development-approved; elder iconography confirmation still required before launch |
| `ganesh/diya`                    | Original AI generation for this project; prompt in `ASSET_PROMPTS.md`                                 | Development-approved                                                              |
| `palace/door-left`, `door-right` | One original matched-door AI generation, split at its exact center seam; prompt in `ASSET_PROMPTS.md` | Development-approved                                                              |
| `florals/corner-tl`              | Original AI generation for this project, mirrored at runtime; prompt in `ASSET_PROMPTS.md`            | Development-approved                                                              |
| `palace/arch-frame`              | Original AI generation for Phase 3; includes the faint lower palace silhouette                        | Development-approved                                                              |
| `florals/toran`                  | Original AI generation for Phase 3; toran and hanging foliage combined as one responsive layer        | Development-approved                                                              |
| `florals/petal`                  | Original AI generation for Phase 3; reused by the low-density canvas particle system                  | Development-approved                                                              |
| `couple/hero-portrait`           | Approved user photo, face-safe 4:5 crop from the 2026-11-18 WhatsApp image                            | Approved by user                                                                  |
| `album/moment-01`                | Approved user photo, face-focused 3:4 crop from the 2026-11-18 WhatsApp image                         | Approved by user                                                                  |
| `album/moment-02`                | Approved user photo, face-focused 3:4 crop from the 2026-11-18 WhatsApp image                         | Approved by user                                                                  |
| `album/moment-03`                | Approved user photo, face-focused 3:4 crop from the 2026-11-18 WhatsApp image                         | Approved by user                                                                  |
| `album/moment-04`                | Approved user photo, face-focused 3:4 crop from the 2026-11-18 WhatsApp image                         | Approved by user                                                                  |
| `album/moment-05`                | Approved user photo, face-focused 3:4 crop from the 2026-11-20 WhatsApp image                         | Approved by user                                                                  |
| `palace/portrait-jharokha`       | Built-in ImageGen transparent Rajasthani–Lucknowi portrait overlay, generated 2026-11-20              | Development-approved                                                              |
| `florals/hero-side-string`       | Built-in ImageGen transparent flower-only hanging ornament, generated 2026-11-20                      | Development-approved                                                              |
| `ceremonies/haldi`               | Built-in ImageGen transparent brass haldi thali, generated 2026-11-20                                 | Development-approved                                                              |
| `ceremonies/mehendi-sangeet`     | Built-in ImageGen transparent dhol and mehendi arrangement, generated 2026-11-20                      | Development-approved                                                              |
| `ceremonies/wedding-mandap`      | Built-in ImageGen transparent royal mandap, generated 2026-11-20                                      | Development-approved                                                              |

The asset pipeline removes source metadata and emits AVIF/WebP variants. Generated-image use remains
subject to the applicable OpenAI service terms and the family's final human review.

## Legacy candidates

| Candidate          | Current location                          | Production status  | Required review                                       |
| ------------------ | ----------------------------------------- | ------------------ | ----------------------------------------------------- |
| Ganesh cover image | `assets-src/legacy/ganesh-cover.webp`     | Blocked and unused | Source/licence, elder iconography review, crop policy |
| Hero watercolor    | `assets-src/legacy/hero-watercolor.webp`  | Blocked and unused | Source/licence, subject and anatomy review            |
| Prototype fonts    | `reference/legacy-prototype/assets/fonts` | Reference only     | Replaced by pinned Fontsource packages                |

Every future production asset must record its creator/source, licence, master dimensions, output
filenames, and human approval. Images scraped from Pinterest, Instagram, or image search are not
permitted.
