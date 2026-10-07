# Upgrade to Node 24 LTS, SvelteKit 3, Vite+ 1.1, remote functions, and Cloudflare

Date: 2026-10-07
Branch: `upgrade/kit3-viteplus-remote`

## Goal

Move porfirio.dev onto the current stack and keep it live at https://porfirio.dev:

- Node 24 LTS (latest patch `24.21.0`; Node 26 is not LTS until 2026-10-28)
- SvelteKit 3 (`3.0.1`) with the SvelteKit 3 API set
- Vite+ `1.1.0` (bundles Vite 8 and Vitest 5)
- `@sveltejs/adapter-cloudflare` `8.0.0`
- Adopt experimental remote functions
- `GITHUB_TOKEN` becomes a runtime secret instead of a build-time inline
- Blog `id` param is parsed to a number
- Live Cloudflare deployment still works

## Non-goals

- UI redesign
- New product features
- Changing routes or URLs

## Constraints

- The site must stay deployable to Cloudflare and live at porfirio.dev.
- Existing lint, format, test, and staged config in `vite.config.ts` must be preserved.
- Existing behavior (routes, cache headers, GitHub blog source) must not regress.
- Do not deploy until local `vp check`, `vp test`, and `vp build` pass, and `wrangler dev` boots the built worker.

## Approach

Use the official migrators, in order, then only the API moves this repo actually needs.

1. Pin Node `24.21.0` in `.node-version` and `engines.node`.
2. Run the global Vite+ 1.1 CLI: `vp migrate --no-interactive` from the repo root, before
   bumping `vite-plus`/Vitest by hand, so the migrator can see the current runner. Not the
   local `0.2.1` binary, and not `--full`.
3. Resolve BLOCK findings and review every REVIEW finding. Keep generated Vitest v4
   compatibility settings until the first `vp test` run passes.
4. Install SvelteKit 3, adapter-cloudflare 8, Svelte `5.57.2`, then run
   `sv migrate sveltekit-3`. Reconcile `vite.config.ts` by hand so Kit options live inside the
   existing `defineConfig` from `vite-plus`, next to the current lint/format/test/staged blocks.
5. Apply the SvelteKit 3 API moves (see below) and the runtime changes.
6. Convert the blog and resources data loads to remote functions.
7. Add Cloudflare config (`wrangler.jsonc`, `wrangler types`) so the app can be built and run as
   a Worker, and keep the Pages-style output working.
8. Validate: `vp install`, `vp check`, `vp test`, `vp build`, `wrangler dev` smoke test,
   `pnpm exec playwright test` (E2E).
9. Deploy to Cloudflare and verify porfirio.dev serves the new build.

## SvelteKit 3 API moves

- Config moves from `svelte.config.js` into the `sveltekit()` plugin in `vite.config.ts`.
- `#lib` -> `#lib` via Node subpath imports in `package.json`, with explicit extensions.
- `tsconfig.json` extends `$app/tsconfig` and declares `include`/`exclude`.
- `Handle` / `HandleFetch` types from `@sveltejs/kit/hooks`.
- Param matchers collapse into `src/params.ts` using `defineParams` from `@sveltejs/kit/params`.
  The blog `id` becomes a number, so `getBlogPostById(id)` drops the unary `+`.
- `$env/static/private` -> `$app/env` model: declare `GITHUB_TOKEN` in `src/env.ts` and import
  from `$app/env/private`. It becomes a runtime variable, backed by a Cloudflare secret.
- Keep `error(...)` / `redirect(...)` call sites but update the `error(404, ...)` argument shape
  where Kit 3 changed it.

## Remote functions

Remote functions are experimental. Opt in with:

```ts
sveltekit({
  compilerOptions: { experimental: { async: true } },
  experimental: { remoteFunctions: true },
});
```

- Move read-only GitHub data loading into `*.remote.ts` `query` functions.
- Files use a `remote` filename segment, e.g. `src/lib/server/gh/remote.ts`.
- Queries must not read `event.url`, `event.params`, or `event.route`; pass values explicitly.
- `+page.server.ts` loads that only fetched blog data are removed once their remote replacement
  is wired in. Cache headers stay in `handle` (a server hook), which is unaffected.

## Cloudflare

- Adapter is already `@sveltejs/adapter-cloudflare`; bump to `8.0.0`.
- Kit 3 Cloudflare runtime API changes: `platform.env` is gone. Use `cloudflare:workers`
  (`env`, `waitUntil`) and `request.cf` where Cloudflare-specific values are needed.
- `$app/env/private` is the preferred path for the GitHub token; set it as a Worker secret with
  `wrangler secret put GITHUB_TOKEN`.
- Add `wrangler.jsonc` with `main` -> `.svelte-kit/cloudflare/_worker.js`, `assets` binding, and a
  recent `compatibility_date`, plus `nodejs_als` (and `nodejs_compat` if Octokit needs it).
- Run `wrangler types` so Cloudflare types are available.
- Local smoke test: `wrangler dev` against the built worker before any deploy.

## Validation

- `vp install`, `vp check`, `vp test` all pass.
- `vp build` produces a Cloudflare worker bundle.
- `wrangler dev` renders `/`, `/blog`, and a blog post.
- Playwright E2E passes against the local dev server.
- Deploy, then confirm https://porfirio.dev loads and a blog post renders live.

## Risks

- Remote functions are experimental; if the conversion cannot be made to build reliably, fall back
  to keeping `+page.server.ts` loads and report it rather than shipping a broken site.
- Octokit may need `nodejs_compat` on Workers and may inflate worker size; watch the size limit.
- A live deploy requires Cloudflare credentials; if they are missing, stop at a validated local
  build and hand off the exact deploy command.

## Outcome (2026-10-07)

Delivered and verified live at https://porfirio.dev:

- Node 24.21.0 LTS, Vite+ 1.1.0 (Vite 8.3.3, Vitest 5), SvelteKit 3.0.1, Svelte 5.57.2,
  adapter-cloudflare 8.0.0, Wrangler 4.148.
- SvelteKit 3 API set adopted (`#lib`, `$app/tsconfig`, `@sveltejs/kit/hooks`,
  `src/params.ts`, `$app/env`).
- `GITHUB_TOKEN` is a runtime variable; `id` is a number.
- Blog data served through remote functions (`src/lib/blog.remote.ts`) with
  `experimental.remoteFunctions` and `compilerOptions.experimental.async`.
- Blog data fix: `ghRequest` clones the response before logging the body.

### Deployment change: Pages -> Workers

adapter-cloudflare 8 emits Workers Static Assets output (`main` + `assets`, `env.ASSETS`,
`../cloudflare-tmp/server.js`). A Cloudflare **Pages** build of that output was broken (mixed
404/500), and `wrangler pages deploy` could not bundle the server code that lives outside the
upload directory. The site now runs as a **Worker** named `porfirio-dev`:

- `wrangler.jsonc` uses `main`, `assets.directory`, `assets.binding`, and a
  `porfirio.dev/*` zone route (a custom domain was blocked by pre-existing DNS records).
- Compatibility flags `nodejs_compat` and `nodejs_als` are set on the Worker and were also set
  on the legacy Pages project.
- Deploys run via `.github/workflows/deploy.yml` (`vp build` + `wrangler deploy`) using the
  `CLOUDFLARE_TOKEN` secret, which must have Workers Scripts:Edit permission.
- The old Pages project `porfirio-dev` still exists and is Git-connected, but no longer owns
  `porfirio.dev`; its builds only publish to `porfirio-dev.pages.dev`. It can be deleted.

### Notes

- The Pages production env vars (`GITHUB_TOKEN`, `PNPM_VERSION`) were accidentally cleared by a
  project PATCH and restored from a prior deployment snapshot.
- Remote functions are experimental; if they regress, the queries in `src/lib/blog.remote.ts`
  can be moved back to `+page.server.ts` loads without touching the rest of the stack.
