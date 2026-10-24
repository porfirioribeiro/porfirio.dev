import { describe, expect, it } from 'vite-plus/test';
import { listResourcesTool } from './resources-tools.js';
import type { ResourceShape } from '#lib/resources/types.js';

const books: ResourceShape[] = [
  { title: 'Refactoring UI', author: 'Adam Wathan, Steve Schoger', href: 'https://example.com/ui' },
];
const podcasts: ResourceShape[] = [
  { title: 'Syntax', author: 'Wes Bos, Scott Tolinski', href: 'https://example.com/syntax' },
];
const courses: ResourceShape[] = [];

describe('listResourcesTool', () => {
  it('returns all resource types when no filter is given', () => {
    const tool = listResourcesTool({ book: books, podcast: podcasts, course: courses });
    const result = tool.execute({}) as { resources: { type: string; title: string }[] };
    expect(result.resources).toEqual([
      {
        type: 'book',
        title: 'Refactoring UI',
        author: 'Adam Wathan, Steve Schoger',
        url: 'https://example.com/ui',
      },
      {
        type: 'podcast',
        title: 'Syntax',
        author: 'Wes Bos, Scott Tolinski',
        url: 'https://example.com/syntax',
      },
    ]);
  });

  it('filters by a single type', () => {
    const tool = listResourcesTool({ book: books, podcast: podcasts, course: courses });
    const result = tool.execute({ type: 'podcast' }) as { resources: { type: string }[] };
    expect(result.resources).toHaveLength(1);
    expect(result.resources[0].type).toBe('podcast');
  });
});
