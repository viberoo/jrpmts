# JRPMTS LLC — Modern Static Redesign

A modern, polished static version of [jrpmts.com](https://jrpmts.com) (JRPMTS LLC,
digital marketing agency, Stillwater, OK), rebuilt from the live WordPress site
on 2026-11-21. Same colors, same copy, same contact details — new theme with
3D elements.

## Live staging

- **Staging:** https://jrpmts.pages.dev
- **Live WordPress site:** https://jrpmts.com — **DNS has NOT been switched.**
  jrpmts.com stays on WordPress until the user approves a switch. No custom
  domain is attached to this Pages project and no DNS was touched.

## Colors (from the live site / logo)

- Navy `#1e3a6e` (logo navy, sampled from the JRPMTS logo) / deep navy `#0a1930`
- Gold `#f5b81d`
- Bright blue `#007cba` / sky `#1f8acb`
- Ink `#101828`, paper `#f6f8fb`, white

## 3D elements

- **Hero:** Three.js (CDN) canvas — floating gold icosahedrons, octahedrons,
  torus shapes and gold chevron bars over a particle field, with mouse
  parallax and slow rotation. Degrades gracefully: if WebGL or the CDN is
  unavailable the CSS gradient hero underneath remains fully readable, and
  the canvas is hidden for `prefers-reduced-motion`.
- **3D tilt cards:** the six homepage service cards, the "Why JRPMTS" cards,
  value cards and testimonial cards tilt in 3D following the pointer
  (pointer:fine devices only).
- **Depth on scroll:** IntersectionObserver reveal animations; gold
  chevron accents and layered navy gradients throughout.

## Pages (13)

- `/` — Home
- `/about/` — team (Jackie Padgett, Kristen Hadley, Angela Calvert, Sherril
  Moore, Marissa Randell, Lindy Fisher, Sara Wiswall, Maren Rathman, Meghan
  Mraz, Ava Sherry, Morgan Shade, Caia Gorman, Avery Miller), mission,
  vision, core values
- `/services/` — 8 services + stats (345 projects / 120 years combined
  experience / 20 employees & contractors)
- `/services/web-design/` — full copy + 3 portfolio screenshots
- `/services/nfc-chip-services/` — full copy, 6 offers, 4-step How It Works,
  pro tips
- `/clients/` — 27 client logos from the live site
- `/forms/` — 15 forms, same mts.sh shortlinks as the live site
- `/testimonials/` — Bridget, Katie, Michelle
- `/blog/` — index of the 2 posts in the sitemap, both in full:
  `/blog/a-business-website-is-never-just-built/` (Sep 7, 2026) and
  `/blog/importance-of-maintaining-your-google-business-page/` (Jan 24, 2025)
- `/contact/` — address, phone, email, hours, socials + mailto form (see below)
- `/book-kristen-hadley/` — Book Like A Boss widget (same provider as live)

## Contact form change (important)

The static site has **no WordPress form backend**, so the contact form does
not submit to a server. It opens the visitor's email app addressed to
**info@jrpmts.com** with the message filled in, and the page says so
explicitly. Phone (`tel:+14057430337`) and email links work throughout.

## Contact (verified from the live site, 2026-11-21)

- 901 S Main St Ste 44, Stillwater, OK 74074
- (405) 743-0337 · info@jrpmts.com
- Mon–Fri 9:00 AM–5:00 PM, weekends by appointment
- Facebook facebook.com/jrpmts · Instagram instagram.com/jrpmts

Email note: the live site shows no `mailto:` link — the address appears only
obfuscated (Cloudflare email protection) in the contact page source, where it
reads `info@jrpmts.com`. That is the address used here.

## Content notes / contradictions found while scraping

- The homepage copy says "The Merged Media team prides themselves…" — a
  leftover name from before the merger (Masters Technology Services + JRP
  Media Management LLC). Kept verbatim; worth fixing on the live site too.
- The Book page on the live site has no heading or text content of its own —
  it is only the Book Like A Boss booking widget. Reproduced as such.
- The Clients page on the live site is logos only, with no client names in
  text. Names here are derived from the logo filenames.
- Frontline Roofing & Construction still appears in the live site's web-design
  portfolio; it is reproduced here as on the live site.
- "(405) 372-5151" appears in the live Clients page source, but it is a
  client's own phone number inside a listing image (Stillwater Medical,
  723 S Main St) — not JRPMTS's. JRPMTS's number is (405) 743-0337 on every page.
- The address appears as both "901 S Main St Ste 44" and "901 S Main St,
  Ste 44" — same address, punctuation only.

## Left out / changed vs the original

- `sample-team-img.webp` (a generic stock team photo, literally named
  "sample") was **not** reused. `brand-awareness.webp` (also stock, but the
  live homepage's own feature image) is kept as a decorative section image.
- Only 2 team photos exist on the live About page (Jackie Padgett, Angela
  Calvert); the other 11 team members are shown with monogram tiles — no
  photos were invented.
- Only 11 of the ~25 partner logos are included (the recognizable ones:
  Google Business, WordPress, Shopify, Wix, QuickBooks, Square, Trello,
  Xero, Gusto, Tailwind, Todoist). One client logo file 404'd on the live
  site (Patriot Plumbing logo) and is omitted.
- The WordPress form backend, comments, search and wp-admin are not part of
  a static site and are not reproduced.
- This is an intentional redesign, not a pixel-faithful clone: same palette,
  same copy and contact details, modern layout.

## Build

Source of truth: `../build.py` (generates the HTML from the scraped copy in
`../raw/`), shared `site/styles.css` and `site/main.js`, images in
`site/images/` (downloaded from jrpmts.com/wp-content/uploads).

Rebuild: `python3 build.py` · Deploy: Cloudflare Pages project `jrpmts`
(`https://jrpmts.pages.dev`), GitHub repo `viberoo/jrpmts`.
