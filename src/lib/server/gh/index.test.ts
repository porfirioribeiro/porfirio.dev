import { describe, expect, it, vi } from 'vite-plus/test';
import { createGH } from './index.js';

function fakeEvent() {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
  const event = { fetch: fetchMock } as unknown as Parameters<typeof createGH>[0];
  return { event, fetchMock };
}

describe('createGH request headers', () => {
  it('omits the Authorization header when no token is configured', async () => {
    const { event, fetchMock } = fakeEvent();
    const gh = createGH(event, '');
    await gh.getAllBlogPosts();
    const [, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('sends a Bearer token when one is configured', async () => {
    const { event, fetchMock } = fakeEvent();
    const gh = createGH(event, 'secret');
    await gh.getAllBlogPosts();
    const [, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(init.headers.Authorization).toBe('Bearer secret');
  });
});
