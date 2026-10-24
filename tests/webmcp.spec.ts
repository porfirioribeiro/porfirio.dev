import { expect, test, type Page } from '@playwright/test';

// Chromium builds without the WebMCP flag lack the API, so we install a
// spec-shaped `document.modelContext` that records registrations and
// honours AbortSignals. It exercises the site's side of the contract.
test.use({ baseURL: process.env.WEBMCP_BASE ?? 'http://localhost:5173' });

type Registry = {
  names(): string[];
  call(name: string, input: unknown): Promise<unknown>;
};

declare global {
  interface Window {
    __webmcp: Registry;
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const tools = new Map<string, { execute: (i: unknown) => unknown }>();
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: {
        registerTool(
          tool: { name: string; execute: (i: unknown) => unknown },
          opts?: { signal?: AbortSignal },
        ) {
          if (tools.has(tool.name)) throw new DOMException('duplicate', 'InvalidStateError');
          tools.set(tool.name, tool);
          opts?.signal?.addEventListener('abort', () => tools.delete(tool.name));
          return Promise.resolve();
        },
      },
    });
    window.__webmcp = {
      names: () => [...tools.keys()].sort(),
      call: async (name, input) => tools.get(name)!.execute(input),
    };
  });
});

const names = (page: Page) => page.evaluate(() => window.__webmcp.names());
const call = (page: Page, name: string, input: unknown = {}) =>
  page.evaluate(([n, i]) => window.__webmcp.call(n as string, i), [name, input] as const);

test('registers per-route tools and unregisters on navigation', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/about');
  await expect.poll(() => names(page)).toEqual(['get_profile']);

  // On mobile the nav sits behind the hamburger menu (see example.spec.ts)
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('link', { name: /skills/i })
    .first()
    .click();
  await expect.poll(() => names(page)).toEqual(['filter_skills', 'list_skills']);

  await page.goto('/resources');
  await expect.poll(() => names(page)).toEqual(['list_resources']);
  await page.goto('/projects');
  await expect.poll(() => names(page)).toEqual(['list_projects']);
  expect(errors).toEqual([]);
});

test('filter_skills updates the visible UI', async ({ page }) => {
  await page.goto('/skills');
  await expect.poll(() => names(page)).toContain('filter_skills');
  await call(page, 'filter_skills', { category: 'Working with' });
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Working with']);
  await expect(page.getByRole('button', { name: 'Working with' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await call(page, 'filter_skills', { category: 'all' });
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(3);
});

test('blog tools and search form', async ({ page }) => {
  await page.goto('/blog');
  await expect.poll(() => names(page)).toEqual(['list_blog_tags', 'search_blog']);
  const tags = (await call(page, 'list_blog_tags')) as { tags: unknown[] };
  expect(tags.tags.length).toBeGreaterThan(0);

  const form = page.locator('form[toolname="search_blog_form"]');
  await expect(form).toHaveAttribute('tooldescription', /.+/);
  await expect(form.locator('input[name="q"]')).toHaveAttribute('toolparamdescription', /.+/);

  const before = await page.locator('article').count();
  await page.locator('input[name="q"]').fill('zzzz-no-match');
  await expect(page.locator('article')).toHaveCount(0);
  await page.locator('input[name="q"]').fill('');
  await expect(page.locator('article')).toHaveCount(before);
});

test('get_current_article follows the open post', async ({ page }) => {
  await page.goto('/blog');
  const links = page.locator('article a');
  await expect(links.first()).toBeVisible();
  await links.first().click();
  await expect.poll(() => names(page)).toEqual(['get_current_article']);
  const art = (await call(page, 'get_current_article')) as { title: string; url: string };
  expect(art.url).toMatch(/^https:\/\/porfirio\.dev\/blog\/\d+/);
  await expect(page.locator('h1').first()).toContainText(art.title);
});

test('agent-invoked form submit responds with the post count after the UI updates', async ({
  page,
}) => {
  await page.goto('/blog');
  await expect.poll(() => names(page)).toContain('search_blog');
  const result = await page.evaluate(async () => {
    const form = document.querySelector('form[toolname="search_blog_form"]') as HTMLFormElement;
    (form.querySelector('input[name="q"]') as HTMLInputElement).value = 'zzzz-no-match';
    const event = new Event('submit', { bubbles: true, cancelable: true }) as Event & {
      agentInvoked: boolean;
      respondWith: (p: Promise<string>) => void;
      submitter: null;
    };
    const response = new Promise<string>((resolve) => {
      event.agentInvoked = true;
      event.respondWith = (p) => void p.then(resolve);
    });
    form.dispatchEvent(event);
    return response;
  });
  expect(result).toContain('Showing 0 posts');
});
