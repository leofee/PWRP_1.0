---
name: frontend-design
description: Use when implementing or modifying Astro frontend UI, components, layouts, pages, styling, in the frontend/ directory. Covers Astro SSR conventions, scoped CSS, component patterns, and the `@/*` import alias.
---

# Frontend Design

## Tech stack
- **Astro 5** with SSR mode (`output: "server"`)
- **TypeScript** with `@/*` alias → `frontend/src/*`
- No UI framework — use vanilla Astro components (`.astro`)
- Global CSS in `public/css/` (tokens.css, style.css, lecture.css)
- Data in `public/js/electrodes.js` (ELECTRODES array), persisted via localStorage

## Project structure
```
frontend/src/
├── pages/
│   ├── index.astro            # 电极库 (电极材料选型)
│   └── basic-knowledge.astro  # 基础知识 (电阻焊讲座)
├── layouts/
│   └── Layout.astro           # Topbar + sidebar nav + main slot
└── lib/
    └── pocketbase.ts          # PocketBase SDK singleton (for future use)
frontend/public/
├── css/
│   ├── tokens.css             # CSS custom properties (dark theme)
│   ├── style.css              # 电极库全局样式
│   └── lecture.css            # 基础知识页面样式
└── js/
    ├── electrodes.js          # 电极材料数据库
    ├── app.js                 # 电极库交互逻辑
    └── lecture.js             # 基础知识交互逻辑
```

## Conventions

### Components
- Use `.astro` files, **not** React/Vue/Svelte
- Component script (frontmatter) uses `---` blocks with TypeScript
- Scoped CSS with `<style>` inside the same `.astro` file
- Prefer inline `<style>` over global CSS files

### Imports
- `@/` for anything under `frontend/src/` (e.g. `@/layouts/Layout`)
- Relative imports only when referencing same-directory siblings

### Layouts
- Layout accepts `page` prop for active sidebar state
- Page names match slug: `index` → 电极库, `basic-knowledge` → 基础知识
- Use `<slot />` for page content, `<slot name="head">` for extra <head> elements

### Pages
- Each page sets `page` prop in Layout to highlight active nav item
- Client JS loaded via `<script is:inline src="/js/...">` at end of page

### Styling
- CSS custom properties in `tokens.css` (dark theme)
- Global styles in `style.css`, page-specific in separate CSS files
- No CSS framework or preprocessor configured