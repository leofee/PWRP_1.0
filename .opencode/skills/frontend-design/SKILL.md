---
name: frontend-design
description: Use when implementing or modifying Astro frontend UI, components, layouts, pages, styling, or PocketBase integration in the frontend/ directory. Covers Astro SSR conventions, scoped CSS, component patterns, and the `@/*` import alias.
---

# Frontend Design — demo02

## Tech stack
- **Astro 5** with SSR mode (`output: "server"`)
- **PocketBase SDK** (`pocketbase`) for client/server data
- **TypeScript** with `@/*` alias → `frontend/src/*`
- No UI framework — use vanilla Astro components (`.astro`)

## Project structure
```
frontend/src/
├── pages/        # Route pages (file-based routing)
├── layouts/      # Layout wrappers using <slot />
├── components/   # Reusable Astro components
└── lib/          # Utilities (pocketbase.ts, etc.)
frontend/public/  # Static assets
```

## Conventions

### Components
- Use `.astro` files, **not** React/Vue/Svelte
- Component script (frontmatter) uses `---` blocks with TypeScript
- Scoped CSS with `<style>` inside the same `.astro` file
- Prefer inline `<style>` over global CSS files

### Imports
- `@/` for anything under `frontend/src/` (e.g. `@/lib/pocketbase`)
- Relative imports only when referencing same-directory siblings

### PocketBase
- Import singleton via: `import { getPb } from "@/lib/pocketbase"`
- Use `getPb()` to access the PocketBase client anywhere (pages, components)
- All API calls go through the PocketBase SDK (`pb.collection(...)`)

### Layouts
- Accept props via `Astro.props` with `export interface Props`
- Render child content with `<slot />`
- Set `<title>` and meta tags in the Layout

### Styling
- Scoped `<style>` with plain CSS
- Use `rem` for spacing, system fonts by default
- No CSS framework or preprocessor configured

## Examples

```astro
---
import Layout from "@/layouts/Layout.astro";
import { getPb } from "@/lib/pocketbase";
---

<Layout title="Page Title">
  <main>
    <h1>Content</h1>
  </main>
</Layout>

<style>
  main { padding: 2rem; }
</style>
```
