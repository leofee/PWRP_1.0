# AGENTS.md

## Architecture
Three independent services wired via `POCKETBASE_URL`:

| Layer | Dir | Entry | Port |
|-------|-----|-------|------|
| Frontend | `frontend/` | `npm run dev` | 4321 |
| Backend | `pocketbase/` | Download binary from pocketbase.io, run it | 8090 |
| Python | `python/` | `python src/main.py` | — |

## Key facts
- PocketBase binary + `pb_data/` are gitignored — download manually from pocketbase.io
- Astro SSR mode (`output: "server"` in `astro.config.mjs`)
- `@/*` path alias maps to `frontend/src/*` (configured in `tsconfig.json`)
- Frontend pages: `index.astro` (基础知识, `/`), `electrode.astro` (电极库, `/electrode`), `login.astro` (无 Layout 独立页面)
- Layout (`Layout.astro`) has sticky topbar + sidebar nav with `page` prop for active state
- Electrode data in `public/js/electrodes.js`, persisted via `localStorage`
- Python loads `.env` via `python-dotenv`; `.env` is gitignored

## Service order
PocketBase must be running before Astro or Python attempt to connect.

## Environment
All services use `POCKETBASE_URL` (default `http://127.0.0.1:8090`). Place `.env` at project root or `python/.env`.
