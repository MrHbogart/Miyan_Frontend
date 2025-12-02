# Repository Guidelines

## Project Structure & Module Organization
- Nuxt 3 app with routes in `pages/`; dynamic `[lang]/` handles locales and `app/router.options.js` sets scroll behavior.
- Page-level view modules live in `views/` (e.g., Miyan landing) and compose shared UI from `components/`.
- Layout shells, middleware, and plugins follow Nuxt defaults in `layouts/`, `middleware/`, and `plugins/`; the global app frame is `app.vue`.
- Styling sources sit in `assets/css/` (Tailwind entry + custom fonts); design tokens and scanning rules live in `tailwind.config.cjs`.
- Images originate in `assets/images/` and are synced to `public/images/` via the prep script; other static assets belong in `public/`.
- Domain logic sits in `composables/`, shared data/state in `state/`, helpers in `utils/`, and route tweaks in `app/router.options.js`.

## Build, Test, and Development Commands
- Use `npm install` or `npm ci` (npm is canonical via `package-lock.json`) to bootstrap dependencies.
- `npm run dev` starts the Nuxt dev server with hot reload (defaults to port 3000, reads `.env`).
- `npm run build` creates the production bundle; `npm run preview` serves that bundle locally; `npm run start` runs the built server in production mode.
- `npm run prep-images` copies `assets/images` into `public/images`; run after adding/changing imagery and before builds if the pipeline does not call it.

## Coding Style & Naming Conventions
- Vue 3 `<script setup>` + Composition API; keep components PascalCase and colocate feature views under `views/<Feature>/`.
- Composables follow `useThing` camelCase names; state modules export plain objects; helpers in `utils/` stay pure and side-effect free.
- Tailwind is the primary styling layer; prefer utility classes over scoped CSS, with shared styles in `assets/css/app.css` and tokens in `tailwind.config.cjs`.
- Indent with 2 spaces; order imports with Vue/Nuxt first and local aliases (`@/`, `~/`) after; keep templates RTL-aware.
- Runtime config reads `NUXT_PUBLIC_API_BASE_URL` and `NUXT_PUBLIC_SITE_DOMAIN`; avoid hard-coding endpoints or domains.

## Testing Guidelines
- No automated test suite is configured; perform manual QA across RTL/LTR routes, mobile/desktop breakpoints, and media-heavy sections.
- When adding tests, prefer Vitest + Vue Test Utils; place specs near the source or under `tests/` using `*.spec.ts`.
- Mock network calls against the configured API base URL and keep fixtures small to avoid bloating builds.

## Commit & Pull Request Guidelines
- Recent commits are short and lower-case; keep messages concise and imperative (e.g., `fix navbar scroll`, `add miyan hero preload`). If you add scopes, follow `feat|fix|chore(scope): message`.
- PRs should state what changed and why, include screenshots/GIFs for UI work (RTL and LTR), list affected routes, and note manual test coverage.
- Link issues when available, call out env/config changes, new dependencies, and whether `npm run prep-images` or other prep steps are required.
