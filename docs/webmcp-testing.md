# WebMCP on porfirio.dev — Testing Guide

porfirio.dev exposes **WebMCP tools** to in-browser AI agents. WebMCP is a
proposed web standard (W3C Web Machine Learning CG) that lets a page register
structured "tools" the browser's agent can call. It runs entirely client-side
— there is no server endpoint, and tools exist only while a page is open.

**Status:** experimental, Chromium early preview only. Without support, the
site behaves exactly as before (all registration is a no-op).

## Enabling WebMCP in Chrome

1. Open `chrome://flags/#enable-webmcp-testing`
2. Set it to **Enabled**
3. Relaunch Chrome
4. Visit `http://localhost:5173` (dev) or the deployed site

In Chrome DevTools, the **WebMCP panel** lists the tools registered by the
current page, their schemas, and lets you invoke them manually.

## Tool inventory

| Page           | Tool                  | Kind             | What it does                                                |
| -------------- | --------------------- | ---------------- | ----------------------------------------------------------- |
| `/about`       | `get_profile`         | read-only        | Facts about the author: site purpose, exploring list, links |
| `/skills`      | `list_skills`         | read-only        | Skill categories, optionally filtered by `category`         |
| `/skills`      | `filter_skills`       | interactive      | Sets the visible category filter — watch the page update    |
| `/projects`    | `list_projects`       | read-only        | Open-source projects with descriptions and links            |
| `/blog`        | `search_blog`         | read-only        | Searches posts by title/tag text                            |
| `/blog`        | `list_blog_tags`      | read-only        | All blog tags with archive URLs                             |
| `/blog` (post) | `get_current_article` | state-reflecting | Describes the article currently on screen                   |
| `/resources`   | `list_resources`      | read-only        | Recommended books/podcasts/courses, optional `type` filter  |

The blog page also uses the **Declarative API**: the search form input
carries `toolname="search_blog_form"` / `tooldescription` attributes, turning
the form itself into a tool agents can drive.

## Manual verification checklist

- [ ] Site loads and looks identical with the flag **off** (or in
      Firefox/Safari): no console errors, no layout changes.
- [ ] With the flag on, DevTools → WebMCP panel lists the page's tools on
      each route above.
- [ ] Invoking `filter_skills` with `{ "category": "Working with" }` visibly
      updates the skills page (only that category shown, chip highlighted).
- [ ] `search_blog` with `{ "query": "svelte" }` returns matching posts with
      `https://porfirio.dev/...` URLs.
- [ ] On a blog post, `get_current_article` matches the article on screen;
      navigating to another post updates the tool's answer (re-registration).
- [ ] Navigating away from a route unregisters its tools (check the panel).

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
