# AGENTS.md — demo02

## Architecture
Three independent services wired via `POCKETBASE_URL`:

| Layer | Dir | Entry | Port |
|-------|-----|-------|------|
| Frontend | `frontend/` | `npm run dev` | 4321 |
| Backend | `pocketbase/` | Download binary from pocketbase.io, run it | 8090 |
| Python | `python/` | `python src/main.py` | — |

## Key facts
- PocketBase binary + `pb_data/` are gitignored — download manually from pocketbase.io
- Astro uses SSR mode (`output: "server"` in `astro.config.mjs`)
- `frontend/src/lib/pocketbase.ts` wraps PocketBase SDK as a singleton; reads `POCKETBASE_URL` env var (default `http://127.0.0.1:8090`)
- `@/*` path alias maps to `frontend/src/*` (configured in `tsconfig.json`)
- Python loads `.env` via `python-dotenv`; `.env` is gitignored
- No test/lint/typecheck scripts configured yet

## Service order
PocketBase must be running before Astro or Python attempt to connect.

## Environment
All services use `POCKETBASE_URL` (default `http://127.0.0.1:8090`). Place `.env` at project root or `python/.env`.
