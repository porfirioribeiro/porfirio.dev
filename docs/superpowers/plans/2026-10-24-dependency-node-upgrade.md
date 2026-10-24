# Dependency + Node LTS Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Node to the latest LTS (24.22.1) and all dependencies to latest compatible versions, holding TypeScript at 6.x.

**Architecture:** Single-package SvelteKit site on Vite+ (pnpm 12, catalog-pinned vite/vite-plus). Node is pinned via `.node-version`, which CI (`build.yml`, `playwright.yml`) reads via `node-version-file`. Vite+ manages the Node runtime (`vp env install`).

**Tech Stack:** SvelteKit 3, Svelte 5, Vite+ 1.4, pnpm 12, TypeScript 6.0.3, wrangler 4 (Cloudflare adapter), Cloudflare Workers (`nodejs_compat` on, compat date 2026-10-06).

**Spec:** Brainstorming session 2026-10-24 (no separate design doc; short-change flow). User-approved scope: option 2 — "LTS-conservative Node + latest of everything except TypeScript."

## Global Constraints

- Node: latest LTS **24.22.1** only (NOT Node 26; CF/wrangler only require `node >=22`, runtime is workerd — verified OK).
- TypeScript **stays 6.0.3**: `svelte-check` peer is `typescript ^5 || ^6`; `svelte-language-server` (Svelte VS Code extension) peer is `^5.9.2 || ^6.0.2`. TS 7 breaks both — do not install.
- `@types/node` goes to **26.x** (types-only, matches project's existing ahead-of-runtime style).
- vite/vite-plus bump via **catalog in `pnpm-workspace.yaml`** (both entries: `vite-plus: 1.4.0`, `vite: npm:@voidzero-dev/vite-plus-core@1.4.0`), not via `package.json` ranges.
- No `git push`. User reviews commits.

## Review Focus

- `vp check` (svelte-check + TS) must pass after TS-adjacent bumps — peer conflicts on typescript would surface as ERESOLVE or silent svelte-check failures.
- Production build (`vp build`) must pass — vite 8.3.3→newer + vite-plugin-svelte via catalog is the riskiest transitive change.
- Unit tests (`vp test`) and Playwright e2e (`pnpm test:e2e`) must pass on new Node pin.
- Lockfile consistency: `pnpm-lock.yaml` must be regenerated and committed alongside manifest changes.
- No accidental TypeScript 7 in the lockfile (`pnpm why typescript` / grep lockfile).

---

### Task 1: Bump Node pin to 24.22.1

**Files:**

- Modify: `.node-version` (`24.21.0` → `24.22.1`)

**Interfaces:**

- Produces: active Node runtime for all later tasks' commands (`node -v` reports v24.22.1).

- [x] **Step 1: Write `24.22.1` to `.node-version`**

- [x] **Step 2: Install and verify the runtime**

Run: `vp env install && node -v`
Expected: `v24.22.1`

### Task 2: Update all dependencies (catalog + manifests)

**Files:**

- Modify: `pnpm-workspace.yaml` (catalog: `vite-plus: 1.4.0`, `vite: npm:@voidzero-dev/vite-plus-core@1.1.0` → `@1.4.0`)
- Modify: `package.json` (`@types/node` → `^26.6.5`; all other ranges unchanged — semver covers in-range bumps)
- Modify: `pnpm-lock.yaml` (regenerated)

**Interfaces:**

- Consumes: Node 24.22.1 from Task 1.
- Produces: dependency tree that Task 3's verification runs against. `typescript` must resolve to 6.0.3.

- [x] **Step 1: Bump catalog versions in `pnpm-workspace.yaml`**

Set `vite-plus: 1.4.0` and `vite: npm:@voidzero-dev/vite-plus-core@1.4.0`.

- [x] **Step 2: Update in-range dependencies and `@types/node`**

Run: `pnpm update -r --latest=false` then edit `package.json` to `"@types/node": "^26.6.5"` and run `pnpm install`
Expected: `pnpm outdated` reports only `typescript 6.0.3 → 7.0.2` (intentional holdout).

- [x] **Step 3: Confirm TypeScript is pinned to 6.0.3**

Run: `pnpm why typescript | head -20` (or grep `pnpm-lock.yaml` for `typescript@7`)
Expected: all resolved TypeScript versions are 6.0.3; no `typescript@7`.

### Task 3: Full verification

**Files:** none modified (verification only; fixes go back into Task 2's files)

**Interfaces:**

- Consumes: updated tree from Task 2.

- [x] **Step 1: Format, lint, type-check**

Run: `vp check`
Expected: passes (or only pre-existing warnings present on `main` before the bump — note any delta).

- [x] **Step 2: Run unit tests**

Run: `vp test`
Expected: all tests pass.

- [x] **Step 3: Production build**

Run: `vp build`
Expected: SvelteKit build succeeds, adapter-cloudflare emits worker bundle.

- [x] **Step 4: Playwright e2e (if browsers installed)**

Run: `pnpm test:e2e`
Expected: pass. If browsers are missing on the machine, note it and skip rather than install silently.

### Task 4: Commit

**Files:**

- Modify: all changed files staged together

- [ ] **Step 1: Review diff**

Run: `git status --short && git diff --stat`
Expected: only `.node-version`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` (plus any verification-driven fixes).

- [ ] **Step 2: Commit (no push)**

```bash
git add -A
git commit -m "chore: bump Node to 24.22.1 LTS and update dependencies"
```

Expected: commit created; nothing pushed.
