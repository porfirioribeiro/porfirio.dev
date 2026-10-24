import { describe, expect, it } from 'vite-plus/test';
import { searchBlogTool } from './blog-tools.js';
import type { BlogPostItem } from '#lib/types/blog.js';

function post(number: number, title: string, tags: string[]): BlogPostItem {
  return {
    number,
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    description: undefined,
    blocks: {},
    link: `/blog/${number}/slug`,
    ghUrl: `https://github.com/x/y/issues/${number}`,
    date: '2026-01-01',
    tags: tags.map((name) => ({ name, link: '/blog/tag/' + name })),
    keywords: '',
    author: { name: 'Porfírio', ghUrl: 'https://github.com/porfirioribeiro' },
    body: '',
    reactions: 0,
    comments: 0,
  };
}

type SearchResult = {
  results: { title: string; url: string; tags: string[]; description: string | null }[];
  count: number;
};
const searchResult = (r: unknown) => r as SearchResult;

const posts = [
  post(1, 'SvelteKit Adventures', ['svelte', 'web']),
  post(2, 'Reactive Streams in Rust', ['rust']),
  post(3, 'Docker Tips', ['devops', 'web']),
];

describe('searchBlogTool', () => {
  it('matches posts by title, case-insensitively', () => {
    const tool = searchBlogTool(() => posts);
    const result = searchResult(tool.execute({ query: 'svelte' }));
    expect(result.count).toBe(1);
    expect(result.results[0].title).toBe('SvelteKit Adventures');
  });

  it('matches posts by tag', () => {
    const tool = searchBlogTool(() => posts);
    const result = tool.execute({ query: 'web' });
    expect(result.count).toBe(2);
  });

  it('returns absolute URLs so agents can cite them', () => {
    const tool = searchBlogTool(() => posts);
    const result = searchResult(tool.execute({ query: 'docker' }));
    expect(result.results[0].url).toBe('https://porfirio.dev/blog/3/slug');
  });

  it('returns an empty result for no matches', () => {
    const tool = searchBlogTool(() => posts);
    const result = tool.execute({ query: 'nonexistent' });
    expect(result).toEqual({ results: [], count: 0 });
  });

  it('reads posts lazily so it always sees fresh state', () => {
    let current = posts;
    const tool = searchBlogTool(() => current);
    expect(tool.execute({ query: 'rust' }).count).toBe(1);
    current = [...posts, post(4, 'More Rust', ['rust'])];
    expect(tool.execute({ query: 'rust' }).count).toBe(2);
  });
});
