# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`, with `main.js` bootstrapping Vue 3, Tailwind, and the router. Pages are grouped by site (`views/Miyan*`, `views/MiyanBeresht*`, `views/MiyanMadi*`), while reusable UI sits in `components/` and shared hooks in `composables/`. Static assets belong in `public/` (favicons, optimized media) and the build output lands in `dist/`. Use `scripts/prep-images.js` to generate responsive JPEG/WebP sets for any new gallery imagery; raw inputs stay outside the repo. The `otherVersion/` directory contains experiments and should not be served unless explicitly requested.

## Build, Test, and Development Commands
- `npm install` — install dependencies after cloning or rebasing.
- `npm run dev` — start Vite on `http://localhost:5173` with HMR; ideal for daily work.
- `npm run build` — output the production bundle into `dist/`; run before releasing.
- `npm run preview` — serve the built assets locally to mimic deployment headers.
- `npm run prep-images ~/Pictures/NewShoot` — convert source photos into the expected `public/images/{small,medium,large}` hierarchy and regenerate `public/images/srcset.json`.

## Coding Style & Naming Conventions
Follow the existing 2-space indentation and prefer single quotes in JavaScript. Keep script setup blocks lean, push business logic into composables, and co-locate route-specific assets under the relevant `views/<feature>/` folder. Tailwind classes handle most layout; if you add bespoke CSS, extend `src/styles.css` or feature-scoped `<style scoped>` blocks. Name Vue components in PascalCase and files in kebab-case when they represent routes (e.g., `MiyanBereshtLanding.vue`, `miyan-beresht`). Avoid introducing new global mixins or filters—use composables instead.

## Testing Guidelines
No automated test harness currently exists, so manual verification is required. At minimum, smoke-test each localized route (`/fa`, `/en`) and ensure the gallery modals, video hero, and menu sliders behave on mobile and desktop widths. When adding data fetchers or navigation logic, consider writing lightweight Jest/Vitest suites; place future specs under `tests/` or alongside components as `*.spec.js` and document how to run them in your PR.

## Commit & Pull Request Guidelines
Recent commits lack detail; move toward imperative messages (e.g., `Add hero autoplay toggle`). Reference relevant tickets or issues in the body when available. For pull requests, include: a short summary, screenshots or screen recordings for UI changes, a checklist of commands run (`npm run build`, manual route checks), and any localization considerations. Keep PRs focused on a single feature to ease review, and call out risky areas (router changes, asset pipeline) so reviewers can prioritize validation.
