# CodeKraft

A responsive technology studio website built with React, TypeScript, Vinext / Next.js APIs, Tailwind CSS, and Cloudflare Workers.

## Development

- Requires Node.js 22.13 or newer.
- Install: `npm ci`.
- Develop: `npm run dev`.
- Production build: `npm run build`.
- Preview production output: `npm start`.

## Structure

- `app/page.tsx`: page entry point.
- `components/codekraft/`: reusable navigation, branding, sections, project previews, and validated project form.
- `components/codekraft/content.ts`: editable service, project, and product content.
- `app/globals.css`: visual tokens, reference-matched hero composition, responsive layouts, and reduced-motion handling.
- `app/api/contact/route.ts`: validated, rate-limited project submission endpoint.
- `db/schema.ts` and `drizzle/`: D1 schema and generated migrations.
- `public/assets/`: local artwork; no remote image dependency.

## Artwork

`codekraft-logo.png` is the unmodified user-provided official logo. It is displayed at its original aspect ratio in the hero; CSS blending integrates its pale background into the atmosphere. The compact horizontal brand treatment in the supplied website reference is displayed in a clipped image viewport in the header/footer. No logo geometry or lettering is recreated with code. `atmosphere.webp` is a compressed, clean backdrop derived from the supplied reference with all text and branding removed.

## Contact submissions

The form saves enquiries to the `contact_submissions` D1 table. The `DB` binding and generated migrations are required. Submissions are not emailed. Read records through the owning Site's database tools; no public read endpoint or admin panel is exposed. The API validates on the server, uses prepared statements, bounds request size, rejects cross-origin browser submissions, limits requests using short-lived hashes, and makes retries idempotent.

## Content to replace before public marketing

Project case studies and named products are explicitly labeled illustrative studio concepts. Replace them with approved real portfolio/product details before presenting them as released work. The current requested Instagram handle is `@codecraft.ig`.

## Accessibility and performance

Semantic sections, visible focus states, skip navigation, accessible Radix menu/dialog/select primitives, client/server form validation, reduced-motion support, local optimized atmosphere, no videos, and scroll-driven Canvas 2D smoke motion. Drawing pauses offscreen, in hidden tabs, and at the resting endpoints.
