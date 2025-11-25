# Repository Guidelines

## Project Structure & Module Organization
Nuxt 3 drives the app now. The heavy UI lives under `views/` (grouped by brand), global UI sits in `components/`, while shared logic belongs in `composables/` and data/config in `state/`. Routes are declared via the `pages/` directory (e.g., `pages/[lang]/...`), and `app.vue` wraps everything with the legacy gradient scaffold. Static assets belong in `assets/` (imported via `~/assets/...`) while CDN/public-only files (fonts, favicons) stay under `public/`. Use `scripts/prep-images.js` to generate responsive JPEG/WebP sets for new gallery imagery; stage raw shots outside the repo. Remove any stray Vite-era `src/` artifacts when you spot them.

## Build, Test, and Development Commands
- `npm install` — install dependencies after cloning or rebasing.
- `npm run dev` — launch Nuxt’s SSR dev server on `http://localhost:3000` with HMR.
- `npm run build` — produce the `.nuxt/` production bundle used by the server.
- `npm run preview` — smoke test the built output locally.
- `npm run prep-images ~/Pictures/NewShoot` — convert source photos into the expected `public/images/{small,medium,large}` hierarchy and regenerate `public/images/srcset.json`.

## Coding Style & Naming Conventions
Follow the existing 2-space indentation and prefer single quotes in JavaScript. Keep `<script setup>` lean, push business logic into composables, and keep route-specific imagery/JSON alongside the relevant `views/<feature>/` folder. Tailwind handles layout; if you add bespoke CSS, extend `assets/css/app.css` or use feature-scoped `<style scoped>` blocks. Name Vue components in PascalCase and files in kebab-case when they represent routes (e.g., `MiyanBereshtLanding.vue`, `miyan-beresht`). Avoid global mixins or filters—implement composables or utilities instead, and remember SSR (guard direct `window` access).

## Testing Guidelines
No automated test harness currently exists, so manual verification is required. At minimum, smoke-test each localized route (`/fa`, `/en`) and ensure the gallery modals, video hero, and menu sliders behave on mobile and desktop widths. When adding data fetchers or navigation logic, consider writing lightweight Jest/Vitest suites; place future specs under `tests/` or alongside components as `*.spec.js` and document how to run them in your PR.

## Commit & Pull Request Guidelines
Recent commits lack detail; move toward imperative messages (e.g., `Add hero autoplay toggle`). Reference relevant tickets or issues in the body when available. For pull requests, include: a short summary, screenshots or screen recordings for UI changes, a checklist of commands run (`npm run build`, manual route checks), and any localization considerations. Keep PRs focused on a single feature to ease review, and call out risky areas (router changes, asset pipeline) so reviewers can prioritize validation.
