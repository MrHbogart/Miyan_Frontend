# Repository Guidelines

## Project Structure & Module Organization
`src/main.js` bootstraps Vue 3 and tailwind styles, while `App.vue` hosts the global layout shell. Feature UI lives under `src/components/` (reusable atoms) and `src/views/` (route-level pages). Navigation is defined in `src/router/`, shared state primitives in `src/state/`, API clients in `src/api/`, and cross-cutting helpers in `src/utils/`. Store shared media in `src/assets/` when imported by Vite, and drop passthrough files (favicons, robots, etc.) into `public/`. Keep global CSS tokens in `src/styles/`, and run any asset munging scripts from `scripts/` before committing. Built artifacts land in `dist/` and should never be edited manually.

## Build, Test, and Development Commands
Install dependencies once with `npm install`. During feature work run:
```bash
npm run dev        # Launches Vite dev server with HMR
npm run build      # Produces production-ready `dist/`
npm run preview    # Serves the latest build for sanity checks
npm run prep-images # Uses sharp to normalize marketing assets
```
Always execute `npm run prep-images` after adding hero/menu imagery so teammates get optimized files.

## Coding Style & Naming Conventions
Components use `<script setup>` with the Composition API, single quotes, no trailing semicolons, and tab indents to match the existing codebase (`App.vue`, `main.js`). Name Vue files in PascalCase (`HeroBanner.vue`), composables as `useFeature.js`, and shared stores with a clear domain (`state/menu.js`). Keep tailwind classes in templates for layout, and add long-form overrides inside `src/styles/*.css`, grouping tokens by feature comment blocks. When adding scripts, prefer ES modules and guard Node-side utilities with descriptive function names.

## Testing Guidelines
No automated runner is wired yet, so include manual verification notes in every PR (route visited, data mocked, browsers covered). When you introduce tests, mirror Vue/Vite best practices: colocate `ComponentName.spec.js` next to the component, use Vitest + Vue Test Utils, and expose a future `npm run test` script. Keep describe blocks mapped to user flows, and target at least smoke coverage for new critical UI (menus, routing guards, API adapters).

## Commit & Pull Request Guidelines
Recent commits such as `i dont know` and `maybeeee` offer little context; switch to clear, imperative Conventional Commit messages (e.g., `feat: add seasonal menu carousel`). Reference related Linear/Jira issues in the body and mention breaking changes explicitly. PRs must summarize scope, list manual test steps, link assets/scripts touched, and include screenshots or short clips for UI updates. Draft early if work is in progress, then mark ready once lint/build/prep-assets have been rerun locally.

## Assets & Configuration Tips
Image-heavy features depend on the helpers in `scripts/` (`prep-images.js`, `update-menu-images.js`). Run them whenever source photography changes to avoid bloating the repo. Tailwind tokens live in `tailwind.config.cjs`; update theme colors there instead of scattering hex values. Sensitive keys should stay in local `.env` files consumed by Vite—never commit them.
