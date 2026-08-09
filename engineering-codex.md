# OnSite Repository Rules & Engineering Codex

## Purpose
This repository follows a principled, disciplined engineering approach tailored to building OnSite, a real-time third-space recommendation system for international students.

---

## Tech Stack Maintenance
* **Framework:** Next.js 16.x using the App Router.
* **UI:** React 19.x.
* **Language:** TypeScript 5.x.
* **Styling:** Tailwind CSS 4 through `src/app/globals.css` and `@theme`.
* **Images:** `next/image` for optimized remote images, with allowed hosts configured in `next.config.ts`.
* **Runtime:** Use `npm run dev`, `npm run lint`, and `npm run build` as the baseline workflow.

Before changing framework conventions, read the relevant local Next.js 16 documentation under `node_modules/next/dist/docs/`. Do not rely on older Next.js assumptions.

---

## Design Tokens
* **Primary:** `#2ab8cb`
* **Surface Tint:** `#2ab8cb`
* **Primary Container:** `#e0f7fa`
* **Primary Fixed Dim:** `#a5f3fc`
* **Primary Fixed:** `#cffafe`
* **Tertiary:** `#f97316`
* **Tertiary Fixed:** `#ffedd5`
* **Error:** `#ef4444`
* **On-Primary:** `#ffffff`

---

## Repository Structure Rules
1. **No Root HTML Pages:** Do not add or restore root-level `.html` pages such as `dashboard.html`, `login.html`, or `index.html`. Public routes must live under `src/app`.
2. **App Router Routes:** Each route should be implemented as `src/app/<route>/page.tsx`, with the home page at `src/app/page.tsx`.
3. **Shared Styling:** Global styles belong in `src/app/globals.css`, imported only from `src/app/layout.tsx`.
4. **Static Migration Content:** `src/content/pages.ts` and `StaticHtmlPage` are migration scaffolding for legacy pages. New or actively edited product surfaces should be converted into real React components instead of expanding raw HTML strings.
5. **Server Endpoints:** The project backend is the Flask JSON API under `backend/`. Next.js App Router route handlers may be used as thin frontend proxies when useful, but domain logic and persistence belong in Flask. Do not reintroduce an Express static server.
6. **Config Files Stay Root-Level:** Keep `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `.env*` files at the repository root.

---

## Styling & UI Rules
1. **No CDN Tailwind:** Do not use `<script src="https://cdn.tailwindcss.com">`. Tailwind must compile through the local Next/Tailwind setup.
2. **No Standalone Document Markup:** Do not paste full `<!DOCTYPE html>`, `<html>`, `<head>`, or `<body>` documents into React pages. Convert the body into components and move metadata/configuration to Next conventions.
3. **Preserve Stitch Layouts Carefully:** When implementing Google Stitch output, translate the design into React components and data arrays while preserving the visual structure, spacing, color tokens, and responsive grid behavior.
4. **No Unrequested Design Changes:** Backend integration must preserve the existing DOM structure, visible copy, controls, classes, spacing, colors, responsive behavior, animations, and interaction presentation. Add data wiring and state behavior behind the current UI. Any visual or layout change requires an explicit user request.
5. **Avoid Global Token Collisions:** Do not redefine Tailwind theme variables such as `--color-background`, `--color-on-surface`, or `--color-outline` outside the `@theme` block. Page-specific CSS variables need page-specific names.
6. **Use Existing Tokens:** Prefer the existing semantic classes such as `bg-background`, `text-on-surface`, `bg-surface-container-low`, `border-outline-variant`, `text-primary`, and `text-tertiary`.
7. **Responsive Layout:** Keep dashboard-like app surfaces dense and operational. Avoid marketing-style hero layouts inside authenticated/product dashboards.

---

## Icons & Images
1. **No Ligature Text Leaks:** Do not render Material Symbols by placing raw names like `location_on`, `auto_awesome`, or `admin_panel_settings` inside visible spans unless the font loading and ligature behavior are guaranteed. Prefer inline SVG icon components for dashboard/product UI.
2. **No Raw Icon Names in UI:** If an icon is represented by a string key in data, map it to an icon component. Never display the key itself.
3. **Use `next/image`:** Use `Image` from `next/image` for dashboard/card imagery. Configure remote hosts in `next.config.ts`.
4. **Remote Hosts:** Only add the specific image host needed. The Stitch dashboard currently uses `lh3.googleusercontent.com`.

---

## Dashboard Implementation Rules
1. The dashboard route is `src/app/dashboard/page.tsx`.
2. Keep the Stitch dashboard as React components, not raw injected HTML.
3. Preserve the current dashboard sections unless intentionally redesigning:
   * desktop sidebar navigation
   * top stat chips
   * profile/XP card
   * top recommendations
   * top spaces panel
   * "How About These?"
   * discovery cards
4. If adding new dashboard data, prefer typed arrays and reusable card components over duplicated JSX.
5. Any new icons must be added to the local icon map or a deliberate icon library dependency, not as Material Symbols ligature strings.

---

## Notifications And Community MVP Boundary
1. Social networking is outside the documented MVP. Do not add public posts, comments, likes, follows, direct messages, public reflection sharing, or community-feed persistence unless the project scope is explicitly changed.
2. The current `/notifications` community feed is static design-prototype content, not a backend contract or source of truth. Its composer and social actions must not write data or expose user reflections.
3. Future notifications must be private, system-generated records for the owning user. Suitable events include achievement awards, completed visits, reflection completion, and administrative space updates.
4. System notifications must not store precise coordinates or republish private reflection text. They must use authenticated per-user list/read endpoints and remain separate from general feedback and post-visit reflections.
5. A visible notifications implementation requires an explicit frontend request so its controls and states can be updated deliberately.

---

## Core Principles
1. **Root Cause Over Surface Fixes:** Fix the data model or state synchronization over adding arbitrary timeouts or guards.
2. **Mobile-First Simplicity First:** Keep layout rendering lightweight for smooth performance on mobile network connections.
3. **Clear Architectural Layer Separation:**
   * **Presentation Layer:** Next.js pages and client-side React UI components.
   * **Application Layer:** State management and custom hook processing.
   * **Data Layer:** Flask API routes, services, SQLAlchemy models, and SQLite persistence under `backend/`.

---

## Change Verification Checklist
Before handing off a code change:
1. Run `npm run lint`.
2. Run `npm run build` for structural/framework changes.
3. Smoke-test affected routes locally, especially `/dashboard` after UI changes.
4. Search changed UI code for `.html`, `cdn.tailwindcss.com`, `material-symbols-outlined`, and raw icon ligature names if editing migrated/Stitch content.
5. Do not commit generated churn in `next-env.d.ts` unless the framework requires it.
