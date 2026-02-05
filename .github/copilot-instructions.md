# Copilot / AI Agent Instructions for the Valentine Angular app

Purpose: Give AI coding agents the minimal, actionable knowledge to be productive in this repo.

- **Project type & version:** Angular application generated with Angular CLI v21.1.2 (see `package.json`).
- **Repo entrypoints:** client: [src/main.ts](src/main.ts) and server/SSR: [src/main.server.ts](src/main.server.ts) + [src/server.ts](src/server.ts).

- **High-level architecture:**
  - Universal (SSR) Angular app. Client bootstrap lives in `src/main.ts`; server-side bootstrap lives in `src/main.server.ts`.
  - `src/server.ts` starts an Express server used for SSR builds (see `serve:ssr:valentine` script).
  - App configuration is split into client vs server variants: [src/app/app.config.ts](src/app/app.config.ts) (client) and [src/app/app.config.server.ts](src/app/app.config.server.ts) (server). Use the appropriate one depending on runtime.
  - Routing has parallel files: [src/app/app.routes.ts](src/app/app.routes.ts) (client) and [src/app/app.routes.server.ts](src/app/app.routes.server.ts) (server-side route handling).

- **Component layout & conventions:**
  - Components live under `src/app/components/<name>/` and follow the `.ts`, `.html`, `.css`, `.spec.ts` pattern (example: [src/app/components/footer/footer.ts](src/app/components/footer/footer.ts)).
  - Templates use standard Angular syntax; CSS is plain `.css` files (Tailwind is present in deps but not mandatory everywhere).

- **Build / run / test workflows:**
  - Local dev server: `npm start` (runs `ng serve`).
  - Production build: `npm run build` (runs `ng build`) — outputs to `dist/`.
  - SSR: after a production/server build, run `npm run serve:ssr:valentine` which executes `node dist/valentine/server/server.mjs`.
  - Tests: `npm test` runs `ng test`. The project includes `vitest` in devDependencies; follow existing `ng test` config.

- **Key dependencies & integrations:**
  - Server runtime: `express` (used by `src/server.ts` for SSR). Be careful when using Node-only APIs on the client.
  - Crypto: `crypto-js` is included — use it consistently where crypto primitives are needed rather than mixing browser `crypto` APIs.
  - Tailwind + PostCSS present in `devDependencies` — styles may rely on PostCSS/Tailwind pipelines.

- **Patterns & gotchas (repo-specific):**
  - There are parallel client/server implementation files (config, routes). When changing behavior that affects rendering, update both `*.server.ts` counterparts where necessary.
  - Prefer editing `src/app/app.ts` for application-level logic; `app.config.*` files are where environment-specific values and server-safe alternatives live.
  - SSR builds generate `dist/valentine/server/server.mjs` — runtime paths and imports should stay ESM-compatible.

- **Tests & specs:**
  - Unit tests are colocated as `*.spec.ts` next to components (e.g., `footer.spec.ts`). Use `npm test` to run tests locally.

- **Files to inspect for context:**
  - [src/main.ts](src/main.ts) — client bootstrap
  - [src/main.server.ts](src/main.server.ts) — server bootstrap for SSR
  - [src/server.ts](src/server.ts) — Express SSR server
  - [src/app/app.ts](src/app/app.ts) — app entry logic
  - [src/app/app.config.ts](src/app/app.config.ts) and [src/app/app.config.server.ts](src/app/app.config.server.ts)
  - `package.json` — npm scripts and deps
  - `angular.json` — project build configurations

- **What an AI agent may change safely (low risk):**
  - Small component refactors (template improvements, style tweaks) and adding unit tests next to the component.
  - Fixing typos, adding explicit imports, and updating README developer commands.

- **What to avoid or validate carefully (high risk):**
  - Modifying SSR/server code without testing SSR build/run (`npm run build` then `npm run serve:ssr:valentine`).
  - Changing Angular build configuration in `angular.json` or ESM/server export shapes without confirming the SSR output and startup script path.

- **Examples:**
  - To change runtime config for both client and server, update `src/app/app.config.ts` and `src/app/app.config.server.ts` in tandem.
  - To inspect the SSR startup path, check `package.json` `serve:ssr:valentine` and the generated file `dist/valentine/server/server.mjs` after a build.

If anything here is unclear or you want me to expand on a specific area (SSR, testing config, or component patterns), tell me which part to iterate on.
