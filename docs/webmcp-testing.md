# WebMCP on porfirio.dev — Testing Guide

porfirio.dev exposes **WebMCP tools** to in-browser AI agents. WebMCP is a
proposed web standard (W3C Web Machine Learning CG) that lets a page register
structured "tools" the browser's agent can call. It runs entirely client-side
— there is no server endpoint, and tools exist only while a page is open.

**Status:** experimental, Chromium only. Without support, the site behaves
exactly as before (all registration is a no-op).

## Automated tests (run these first)

```bash
pnpm test           # unit: feature detection, tool factories (42 tests)
pnpm test:e2e       # Playwright: needs a dev server on :5173
```

Two e2e suites in `tests/`:

- **`webmcp-real.spec.ts`** — launches Chromium with `--enable-features=WebMCP`
  and exercises the **real browser API**: `getTools()`, `executeTool()`,
  declarative form tools, SPA-navigation cleanup, UI sync after a tool call.
  Skipped on Firefox (Chromium-only early preview).
- **`webmcp.spec.ts`** — injects a fake `document.modelContext` to test the
  site's side of the contract quickly on any engine.

If you run e2e against a non-default server: `WEBMCP_BASE=http://localhost:5174 pnpm test:e2e`.
On a loaded machine, `--workers=1` avoids browser-process flakiness.

## Seeing the tools manually in Chrome

1. **Chrome 149+** with `chrome://flags/#enable-webmcp-testing` → **Enabled** →
   relaunch. (Chrome 146–148 has the API but no DevTools pane.)
2. Open the site — **tools only exist on these routes**:
   `/`, `/about`, `/skills`, `/projects`, `/blog`, `/blog/<post>`, `/resources`.
   **The home page registers `site_overview`** — a discovery tool that maps
   every route to its tools.
3. DevTools → **Application tab** → sidebar → **WebMCP** pane.
   (It is not a top-level DevTools panel.)
4. If the pane is empty, sanity-check the API in the console:
   `typeof document.modelContext` — should be `"object"`. If `"undefined"`,
   the flag didn't take (relaunch) or the browser is too old.

### Automating Chromium yourself

The raw switch `--enable-webmcp-testing` alone does **not** expose the API in
Chrome-for-Testing builds; the flag maps to feature flags. Use:

```bash
chromium --enable-features=WebMCP            # exposes document.modelContext
# WebMCPTesting also works and enables the testing companion API
```

That's exactly what `tests/webmcp-real.spec.ts` does via
`test.use({ launchOptions: { args: ['--enable-features=WebMCP'] } })`.

## Tool inventory

| Page           | Tool                  | Kind             | What it does                                                |
| -------------- | --------------------- | ---------------- | ----------------------------------------------------------- |
| `/`            | `site_overview`       | read-only        | Discovery map: site facts + which tools live on which page  |
| `/about`       | `get_profile`         | read-only        | Facts about the author: site purpose, exploring list, links |
| `/skills`      | `list_skills`         | read-only        | Skill categories, optional `category` filter                |
| `/skills`      | `filter_skills`       | interactive      | Sets the visible category filter — watch the page update    |
| `/projects`    | `list_projects`       | read-only        | Open-source projects with descriptions and links            |
| `/blog`        | `search_blog`         | read-only        | Searches posts by title/tag text                            |
| `/blog`        | `list_blog_tags`      | read-only        | All blog tags with archive URLs                             |
| `/blog` (post) | `get_current_article` | state-reflecting | Describes the article currently on screen                   |
| `/resources`   | `list_resources`      | read-only        | Recommended books/podcasts/courses, optional `type` filter  |

The blog page also uses the **Declarative API**: the `<form>` carries
`toolname="search_blog_form"` / `tooldescription` (with
`toolparamdescription` on the input), so the browser registers the form itself
as a tool — visible in the WebMCP pane as `search_blog_form`.

## Manual verification checklist

- [ ] Site loads and looks identical with the flag **off** (or in
      Firefox/Safari): no console errors, no layout changes.
- [ ] WebMCP pane lists the page's tools on each route above.
- [ ] Invoking `filter_skills` with `{ "category": "Working with" }` visibly
      updates the skills page (chip highlighted, only that category shown).
- [ ] `search_blog` with `{ "query": "svelte" }` returns matching posts with
      `https://porfirio.dev/...` URLs.
- [ ] On a blog post, `get_current_article` matches the article on screen;
      navigating to another post updates the answer.
- [ ] Navigating to `/` leaves only `site_overview`; invoking it lists every
      page with its tools (agent discovery path).

## Local blog data (GitHub)

Blog content is read from GitHub issues (`$article,$published` labels).

- Production uses the `GITHUB_TOKEN` Cloudflare secret.
- Locally, put a token in **`.env.local`** (gitignored) — one is already
  configured on this machine from your `gh` CLI credentials. Without a token
  requests are anonymous and limited to **60/hour per IP**; exhausting it
  makes `/blog` return 502. Never put a token in the tracked `.env` file.
- `createGH` omits the `Authorization` header entirely when no token is
  configured (an empty `Bearer ` gets a 401 from GitHub).

## Architecture (for the curious)

- `src/lib/webmcp/model-context.ts` — feature detection for both API shapes:
  current spec `document.modelContext.registerTool(tool, { signal })` and the
  earlier draft `navigator.modelContext.provideContext({ tools })`. Cleanup:
  abort signals / empty re-provide. Registration failures are logged, never
  thrown.
- `src/lib/webmcp/use-webmcp.svelte.ts` — `useWebMCP(() => tools)`
  composable: SSR-safe `$effect` that re-registers when reactive state
  changes and cleans up on destroy.
- `src/lib/webmcp/*-tools.ts` — tool definitions per domain
  (profile/projects, skills, blog, resources), with unit tests.
- `src/lib/webmcp/svelte-elements.d.ts` — type augmentation for the
  experimental declarative attributes.

## Known unknowns

WebMCP is a draft: API shape (`registerTool` vs `provideContext`),
declarative attribute names, and flag names may change. The wrapper module
contains all of that churn; routes stay stable.
