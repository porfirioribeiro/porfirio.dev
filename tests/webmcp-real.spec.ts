import { expect, test, type Page } from '@playwright/test';

// Real-API WebMCP end-to-end tests.
//
// Unlike webmcp.spec.ts (which injects a fake `document.modelContext`), this
// suite runs Chromium with the WebMCP feature enabled and exercises the real
// browser API: registration, getTools(), executeTool(), declarative form
// tools, and cleanup on navigation. Chromium-only — the flag does not exist
// in other engines.
test.use({
  baseURL: process.env.WEBMCP_BASE ?? 'http://localhost:5173',
  launchOptions: { args: ['--enable-features=WebMCP'] },
});

test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'WebMCP is a Chromium-only early preview');
});

async function toolNames(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const mc = document.modelContext;
    if (!mc) throw new Error('document.modelContext is not available');
    return (await mc.getTools()).map((t) => t.name);
  });
}

async function execute(page: Page, name: string, input: Record<string, unknown> = {}) {
  return page.evaluate(
    async ([n, i]) => {
      const mc = document.modelContext;
      if (!mc) throw new Error('document.modelContext is not available');
      const tools = await mc.getTools();
      const tool = tools.find((t) => t.name === n);
      if (!tool) throw new Error(`tool "${n}" not registered; have: ${tools.map((t) => t.name)}`);
      return JSON.parse(await mc.executeTool(tool, i)) as Record<string, unknown>;
    },
    [name, input] as const,
  );
}

test('the WebMCP API is exposed with the feature flag', async ({ page }) => {
  await page.goto('/skills');
  const hasApi = await page.evaluate(
    () => typeof document.modelContext?.registerTool === 'function',
  );
  expect(hasApi, 'document.modelContext missing — WebMCP feature flag not effective').toBe(true);
});

test('registers per-route tools, cleans up on navigation', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/about');
  await expect.poll(() => toolNames(page)).toEqual(['get_profile']);

  // SPA navigation — old tools must be aborted, new ones registered.
  // On mobile the nav sits behind the hamburger menu (see example.spec.ts).
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('link', { name: /skills/i })
    .first()
    .click();
  await expect.poll(() => toolNames(page)).toEqual(['filter_skills', 'list_skills']);

  await page.goto('/resources');
  await expect.poll(() => toolNames(page)).toEqual(['list_resources']);
  await page.goto('/projects');
  await expect.poll(() => toolNames(page)).toEqual(['list_projects']);

  // home page greets agents with the site map tool
  await page.goto('/');
  await expect.poll(() => toolNames(page)).toEqual(['site_overview']);
  const overview = await execute(page, 'site_overview');
  const pages = overview.pages as Array<{ url: string; tools: string[] }>;
  const skillsPage = pages.find((p) => p.url.endsWith('/skills'));
  expect(skillsPage?.tools).toEqual(['list_skills', 'filter_skills']);

  expect(errors).toEqual([]);
});

test('filter_skills executes through the real API and syncs the UI', async ({ page }) => {
  await page.goto('/skills');
  await expect.poll(() => toolNames(page)).toContain('filter_skills');

  const result = await execute(page, 'filter_skills', { category: 'Working with' });
  expect(result.visible).toEqual(['Working with']);
  // the visible page must reflect the agent's action
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Working with']);
  await expect(page.getByRole('button', { name: 'Working with' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await execute(page, 'filter_skills', { category: 'all' });
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(3);
});

test('blog: search, tags, declarative form tool, current article', async ({ page }) => {
  await page.goto('/blog');
  await expect
    .poll(() => toolNames(page))
    .toEqual(expect.arrayContaining(['search_blog', 'list_blog_tags', 'search_blog_form']));

  const search = await execute(page, 'search_blog', { query: 'svelte' });
  expect(search.count).toBeGreaterThan(0);
  const results = search.results as Array<{ url: string }>;
  expect(results[0].url).toMatch(/^https:\/\/porfirio\.dev\/blog\//);

  const tags = await execute(page, 'list_blog_tags');
  expect((tags.tags as unknown[]).length).toBeGreaterThan(0);

  // declarative API: the browser picked up toolname/tooldescription from the form
  const formAttrs = await page.evaluate(() => {
    const form = document.querySelector('form[toolname]');
    return {
      toolname: form?.getAttribute('toolname'),
      tooldescription: form?.getAttribute('tooldescription'),
    };
  });
  expect(formAttrs).toEqual({
    toolname: 'search_blog_form',
    tooldescription: expect.stringContaining('blog post list'),
  });

  // state-reflecting tool on the open article
  const firstPost = page.locator('article a').first();
  await expect(firstPost).toBeVisible();
  const href = await firstPost.getAttribute('href');
  await page.goto(href!);
  await expect.poll(() => toolNames(page)).toEqual(['get_current_article']);
  const article = await execute(page, 'get_current_article');
  expect(article.url).toMatch(/^https:\/\/porfirio\.dev\/blog\/\d+/);
  await expect(page.locator('h1').first()).toContainText(article.title as string);

  // navigating away unregisters the post's tools; home keeps only its own
  await page.goto('/');
  await expect.poll(() => toolNames(page)).toEqual(['site_overview']);
});
