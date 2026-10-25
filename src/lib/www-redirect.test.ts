import { describe, expect, it } from 'vite-plus/test';
import worker from '../../workers/www-redirect.js';

describe('www redirect worker', () => {
  it.each([
    ['/', 'https://porfirio.dev/'],
    ['/skills', 'https://porfirio.dev/skills'],
    ['/blog/3/post?ref=www', 'https://porfirio.dev/blog/3/post?ref=www'],
  ])('redirects %s to the apex host', (path, expected) => {
    const response = worker.fetch(new Request(`https://www.porfirio.dev${path}`));

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe(expected);
  });
});
