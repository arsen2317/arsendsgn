# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start local Next.js dev server (Fast Refresh) at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run a production build locally

The site is also deployed to Vercel; the stable Git Branch URL pattern is `arsendsgn-git-<branch>-arsen2317s-projects.vercel.app`. GitHub Actions builds a static export for GitHub Pages (`output: 'export'`, basePath `/arsendsgn`) when `GITHUB_ACTIONS=true`; locally/Vercel it runs as a normal Next.js app with no basePath.

## Architecture

- Next.js 14 App Router. Single root layout (`app/layout.js`) + homepage (`app/page.js`) composed of section components from `components/` (Hero, Intro, Skills, Cases, Footer, etc.), plus case study pages under `app/cases/<name>/page.js`.
- Styling: CSS Modules per component/page (`*.module.css`) plus shared global styles and CSS variables in `app/globals.css`. Root font-size is `10px`, so `1rem = 10px` — keep this in mind when reading/writing clamp() and rem values.
- Key global CSS variables: `--bg-primary`, `--bg-secondary`, `--bg-darker`, `--bg-button`, `--bg-dark`, `--text-primary`, `--text-light`, `--r-xs`, `--r-lg`, `--px`.
- Reusable global classes defined in `globals.css`: `.badge` / `.badge.primary` / `.badge.button` (e.g. footer contact chips, skill tags), `.tag.square` / `.tag.pill` (the site alternates square and pill border-radius as a visual theme — keep that alternation when adding tags).
- `components/SiteHeader.js` is the shared header used across the homepage and case pages (handles nav, mobile menu, CV download).
- Case pages (e.g. `app/cases/sber/page.js`) follow a two-column pattern: a left description/info panel and a right interactive slide deck. Slide navigation is driven by wheel/keyboard/touch handlers with a lock ref to prevent overlapping transitions, and GSAP (`gsap.context()` + `gsap.from()`) for entrance animations. Be careful with `gsap.from(..., { opacity: 0 })` on elements also controlled by React state/CSS transitions — a context revert/remount race can leave them stuck at `opacity: 0`; prefer relying on CSS transitions for state-driven visibility instead.
- Audio "fx" sound effects are loaded via `new Audio()` with `process.env.NEXT_PUBLIC_BASE_PATH` prefix and unlocked on first pointerdown (autoplay policy workaround); reused via `playFx`/`cloneNode().play()` on hover.

## CSS gotchas

- Shrink-to-fit techniques (`align-self: flex-start`, `width: fit-content`, `display: table`) cannot make a box narrower than its content's max-content width (the longest unwrapped line). If a text box must wrap to a narrower width than its longest line, insert an explicit `<br />` to change what max-content is computed from, combined with `width: max-content; max-width: 100%`.
