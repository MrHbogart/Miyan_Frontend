# Miyan Frontend (Nuxt 3 + SSR)

This folder now runs the existing Vue 3 UI inside a Nuxt 3 shell so you keep the “heavy” animations and layouts while gaining server-side rendering, streaming hydration, and runtime configuration.

## Quick start

```bash
cd Miyan_Frontend
cp .env.example .env             # adjust API URL if needed
npm install                      # installs Nuxt, Vue, Tailwind
npm run dev                      # local dev server (http://localhost:3000)
# or run the helper script: ./scripts/dev.sh
```

## Containerized deployment

The repo ships with a production-ready Docker target so servers only need Docker + Compose installed.

```bash
cp .env.example .env                    # ensure API env vars are set
docker compose build                    # installs deps, runs `npm run build`
docker compose up -d                    # starts the Nuxt SSR server on :3000
```

`docker compose up` will rebuild (`npm run build`) whenever the sources change and then launch `.output/server/index.mjs`. Override the published port with `PORT=8080 docker compose up -d`. Use `docker compose logs -f` to view runtime output.

## Production build & runtime

```bash
npm run build
NUXT_PUBLIC_API_BASE_URL=https://miyangroup.com/api \
  npm run start -- --host 127.0.0.1 --port 3000
```

Keep the `start` command under a supervisor such as PM2/systemd so Nuxt restarts automatically after deploys or reboots.

## Project layout

- `app.vue` – Nuxt wrapper that renders the legacy header/footer and animated layout around `<NuxtPage/>`.
- `pages/[lang]/**` – Route definitions mirroring the original Vue Router structure, including nested Beresht/Madi children.
- `views/**` – Original view components; untouched aside from import paths.
- `components/**`, `composables/**`, `state/**`, `assets/css/**` – Shared structure migrated from the previous SPA.
- `middleware/lang.global.ts` – Forces `/fa/` or `/en/` prefixes and syncs the SSR-safe `useLang()` store.

## Environment variables

| Name | Purpose |
| ---- | ------- |
| `NUXT_PUBLIC_API_BASE_URL` | Base URL for the Django API (exposed to client). |
| `NUXT_PUBLIC_SITE_DOMAIN`  | Optional canonical domain used in meta tags / SEO. |

Any new variable prefixed with `NUXT_PUBLIC_` becomes available via `useRuntimeConfig().public`.

## Deployment checklist

1. Copy `.env.example` → `.env` and set the API base URL.
2. Run `npm install && npm run build` on the target commit.
3. Restart your process manager (`pm2 restart miyan-nuxt`, `systemctl restart miyan-nuxt`, etc.).
4. nginx should proxy `/` to `127.0.0.1:3000`, `/api/` & `/admin/` to `127.0.0.1:8002`.

JavaScript assets live under `assets/`, so you can keep running `npm run prep-images` when asset updates come in – the script now expects files under `assets/` instead of `src/`.
