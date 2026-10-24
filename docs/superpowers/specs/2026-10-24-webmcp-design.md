# WebMCP Exploration on porfirio.dev — Design

**Date:** 2026-10-24
**Status:** Implemented (2026-10-24) — see `docs/webmcp-testing.md` for the
tool inventory and manual verification steps.
**Size:** Project (learning-oriented feature work)

## Intent

Explore WebMCP — the proposed browser API that lets a page register structured
"tools" for in-browser AI agents — by implementing it on the personal website.
The primary goal is **learning the technology and its full surface**, using the
site's real content (about, skills, projects, blog, resources) as the
playground. Secondary goal: the site genuinely becomes agent-friendly, so a
visitor with a browser agent can ask "what are Porfírio's skills?" and get a
structured answer sourced from the page.

This is explicitly a low-stakes experiment: the website must look and behave
exactly as today for regular visitors. No WebMCP support → no visible change.

## Background: what WebMCP is

- Proposed web standard, incubated in the W3C Web Machine Learning Community
  Group. **Early preview in Chromium only** (Chrome 146+, flag
  `#enable-webmcp-testing`; origin trial planned for 149). Not a W3C standard.
- Page registers tools via `document.modelContext.registerTool({ name,
  description, inputSchema, execute })` (current spec; earlier drafts and some
  implementations use `navigator.modelContext.provideContext({ tools })`,
  which replaces the whole tool set).
- Runs **entirely client-side in the tab** — no HTTP transport, no server. Only
  the **tools** primitive exists (no MCP resources or prompts). Tools are
  ephemeral: they exist only while the page is open.
- The browser mediates: an in-browser agent discovers tools, calls `execute()`
  with structured args, gets structured results back.
- A **Declarative API** also exists: annotating HTML `<form>` elements with
  `toolname` / `tooldescription` attributes turns them into tools.
- TypeScript types ship in the `webmcp-types` npm package (currently 0.1.10).

## Goals

1. Implement the full exploratory surface of WebMCP on the site:
   - Imperative read-only tools (profile, skills, projects, blog, resources)
   - State-reflecting tools (e.g. "current article" on a blog post page)
   - Interactive tools that mutate page/UI state (filters that update the UI)
   - The declarative form-annotation API
   - Reactive re-registration (`provideContext` semantics) and cleanup
2. Zero impact on users without WebMCP (graceful no-op).
3. TypeScript-safe integration using `webmcp-types`.
4. A reusable pattern (`useWebMCP` composable) documented well enough that the
   next experiment on this site can reuse it.
5. A way to actually test: Chrome flag + DevTools WebMCP panel, plus automated
   tests where practical.

## Non-goals / Anti-goals

- **No server-side MCP endpoint** (that would be the complementary experiment,
  not this one).
- **No MCP resources/prompts** — WebMCP doesn't support them.
- **No polyfill** for non-Chromium browsers, no shims that fake support.
- **No heavy framework** around the API: the wrapper stays thin; raw spec
  shapes must remain recognizable in the code.
- **No redesign** of the site. Where an interactive tool needs a UI affordance
  (e.g. a visible filter state), it reuses/extends existing components minimally.
- **No author-provided agent iframe** in the first iteration (stretch goal,
  see Out of scope).

## Constraints

- Svelte 5 (runes), SvelteKit 3, TypeScript strict, pnpm, Vite+ toolchain,
  Cloudflare adapter. Site pages like `/skills`, `/about`, `/projects` are
  prerendered; WebMCP registration happens client-side after hydration, which
  is fine (browser API only exists client-side anyway).
- Skills and projects content is currently **hardcoded in the page markup**
  (`src/routes/skills/+page.svelte`, `src/routes/projects/+page.svelte`), not
  in data modules. Blog content comes from GitHub issues via
  `src/lib/blog.remote.ts` (server queries). Resources already live in data
  modules (`src/lib/resources/*.ts`).
- The `document.modelContext` vs `navigator.modelContext` API shape is still
  in flux; the wrapper must feature-detect both.

## Approaches considered

**A. Shared composable, per-route registration — chosen.** A
`src/lib/webmcp/` module provides a feature-detect wrapper and a Svelte 5
rune-based `useWebMCP()` composable. Each route registers the tools relevant
to it; the composable handles re-registration on state change and cleanup on
navigation. Matches the spec's ephemeral, page-state-dependent mental model;
each route is a self-contained learning example.

**B. One global registry in `+layout.svelte`.** All tools in one place,
route-switched. Simpler at first glance but becomes a god-module; reactive
route-dependent toolsets fight `provideContext`'s replace-all semantics.

**C. Vanilla module with plain `onMount` calls.** Closest to raw spec
examples, but hand-written register/cleanup/re-register in every route gets
noisy once state-aware tools enter the picture.

**Why A:** it balances learning the raw API (the wrapper is thin and readable)
with not repeating boilerplate, and gives a reusable pattern for future
experiments.

## Design

### 1. Core module: `src/lib/webmcp/`

```
src/lib/webmcp/
  model-context.ts    # feature detection + thin typed wrapper
  use-webmcp.svelte.ts # rune-based composable
  index.ts            # public exports
```

**`model-context.ts`**

- Feature detection, executed on the client only:
  - `document.modelContext?.registerTool(tool)` (current spec)
  - `navigator.modelContext?.provideContext({ tools })` (earlier draft shape)
  - Returns `null` when neither exists → everything downstream is a no-op.
- `registerTools(tools: WebMCPTool[]): (() => void)` — registers the set and
  returns a cleanup function (unregister or re-`provideContext([])`,
  per what the detected API supports).
- Tool type from `webmcp-types`, with input schemas described as JSON Schema
  objects as the spec requires.

**`use-webmcp.svelte.ts`**

```ts
useWebMCP(() => tools, { enabled?: boolean })
```

- `$effect`-based: re-registers whenever the reactive tool factory produces a
  new set (mirrors `provideContext` replace-all behavior for draft-API
  browsers; uses `registerTool` per-tool on current-spec browsers, diffing
  minimal — full re-register is acceptable at this scale).
- Runs client-side only (guards against SSR).
- Returns a reactive `supported` boolean so routes can render small
  "agent-ready" affordances when desired (e.g. a subtle indicator on the page).

### 2. Data extraction (prerequisite for tools)

To let tools read site content without scraping the DOM:

- **Skills** → move the hardcoded lists from `+page.svelte` into
  `src/lib/data/skills.ts` as typed data (`{ category, items[] }`), and have
  the page render from it. No visual change.
- **Projects** → `src/lib/data/projects.ts` with the project entries
  (name, description, links, icons); page renders from it.
- **Profile** → `src/lib/data/profile.ts`: **only facts derivable from the
  existing site** — no invented role/location/bio. Contents: site purpose
  (from the about-page narrative), the "Having fun & exploring" list (shared
  with skills data), and links already present on the site (GitHub, blog,
  RSS). Agents get truth, not fabrication. Fields the user wants to add later
  (role, location, contact) are a content edit, not a code change.
- **Blog** → already queryable server-side via `getBlogPosts`,
  `getBlogTags`, `getBlogPostsByTag` (`blog.remote.ts`). Client tools call
  these remote queries — they work in the browser after hydration.
- **Resources** → already data modules; reuse directly.

### 3. Tools per route

All read-only tools return plain structured objects (JSON-schema-shaped
results), with URLs as absolute (`https://porfirio.dev/...`) so an agent can
cite them.

| Route               | Tool                  | Kind                 | Notes                                                                                                                   |
| ------------------- | --------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/about`            | `get_profile`         | read-only            | Returns the profile data object                                                                                         |
| `/skills`           | `list_skills`         | read-only            | Optional `category` enum param                                                                                          |
| `/skills`           | `filter_skills`       | **interactive**      | Sets the visible category filter on the page; UI updates to match (WebMCP's "UI synchronization" requirement in action) |
| `/projects`         | `list_projects`       | read-only            | Returns project list                                                                                                    |
| `/blog`             | `search_blog`         | read-only            | `query` param; matches titles/tags, returns links                                                                       |
| `/blog`             | `list_blog_tags`      | read-only            | Tag names + post counts                                                                                                 |
| `/blog/[id]/[slug]` | `get_current_article` | **state-reflecting** | Returns the article currently open (title, tags, link) — demonstrates tools that depend on live page state              |
| `/resources`        | `list_resources`      | read-only            | Optional `type` enum: book/podcast/course                                                                               |

Interactive tool details:

- `filter_skills`: a small category filter UI is added to the skills page
  (chips/buttons, matching existing styling). The tool sets the same state a
  human click would — one state source shared by both. This is the canonical
  WebMCP demo: agent action visibly reflected in the UI.
- If time permits, a second interactive tool on the blog post page:
  `copy_article_link` (writes the canonical link to the clipboard) — trivial,
  but exercises the "tool with side effects outside app state" case.

### 4. Declarative API

The declarative form API gets its own small experiment on `/blog`:

- Add a small **search form** to the blog page (`<input name="q">` +
  submit). Annotate it with `toolname="search_blog_form"` and
  `tooldescription`, so agents can drive the actual form. Submitting the form
  filters the visible article list (client-side filter over already-loaded
  posts; no new server endpoint).
- This doubles as a real UX improvement (blog search currently doesn't exist)
  and the declarative-API learning piece.
- Note: the exact attribute names/behavior are part of the explainer, not the
  stable spec — isolated in one component so churn is contained.

### 5. Page affordances (small, optional)

Where an interactive tool exists, the page should visibly reflect state
already. Additionally: a tiny "🤖 agent-ready" indicator (only rendered when
`useWebMCP().supported` is true) in the header or footer of pages with tools,
purely as an exploration/learning aid. Easy to remove later.

### 6. Dependencies

- `webmcp-types` (dev/regular dep, ~types only) for `Tool`/schema types.
- Nothing else. No MCP SDK (that's server-side; not applicable).

## Testing & verification

1. **Unit (Vitest, already in toolchain):** `model-context.ts` detection
   logic with mocked `document.modelContext` / `navigator.modelContext`
   shapes, and no-API fallback. `use-webmcp` re-registration behavior with a
   fake API. These are the **automated acceptance gate**.
2. **Manual (user-run, documented in the PR):** no Chrome is installed on
   this machine, so live-browser verification is left to the user: Chrome
   with `#enable-webmcp-testing` enabled; inspect and invoke tools via the
   DevTools WebMCP panel; verify UI sync for `filter_skills`; verify the
   site is unchanged with the flag off and in a non-Chromium browser. The
   implementation ships a short "how to test" doc with exact steps.
3. **E2E:** dropped as an automated gate — no Chromium supporting the flag
   is available here and the flag surface is unstable. If the user's Chrome
   run reveals breakage, fix-forward.
4. `pnpm check`, `pnpm lint`, `pnpm test` all pass.

## Sequencing (reviewer question 3)

Two reviewable units, separate commits on the same branch:

1. **Commit 1 — data extraction only:** skills/projects/about → typed data
   modules, pages render from data with zero visual change. Pure refactor,
   independently testable and revertible.
2. **Commit 2+ — WebMCP:** the `src/lib/webmcp/` module, tools per route,
   declarative API experiment, unit tests, docs.

A rendering regression in the refactor can't contaminate the WebMCP code,
and each unit can be deployed/reverted alone.

## Risks / unknowns

- **API churn:** the standard is a draft; `registerTool` vs `provideContext`
  and declarative attribute names may shift. Contained by the thin wrapper.
- **Chromium flag behavior:** flag names and DevTools support may differ from
  docs at implementation time; manual verification may need adjustment.
- **`webmcp-types` maturity:** at 0.1.x; if its types conflict with the live
  API shape, we hand-roll minimal local types instead (accepted fallback).
- **Blog tools depend on server queries** (`$app/server` queries run in the
  browser in SvelteKit 3) — believed to work post-hydration on prerendered
  pages; verify early during implementation.

## Out of scope (stretch goals, only if time permits)

- Author-provided agent in an iframe with `allow="tools"` (Permissions
  Policy delegation demo).
- Blog post reactions via a tool (Reactions component exists but has no
  wired handler today — would need real backend work).
- A companion `/webmcp` page on the site explaining the experiment with
  usage instructions (nice for readers, not required for learning).

## What's left to the builder

- Exact JSON schemas per tool (descriptions tuned for agent clarity).
- Exact shape of `useWebMCP` options/return; file naming conventions per
  repo style.
- Which stretch goals, if any, to include.
- Deciding the minimal skills-page filter UI consistent with existing styles.
