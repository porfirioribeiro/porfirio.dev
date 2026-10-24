import { describe, expect, it } from 'vite-plus/test';
import { filterPosts, getCurrentArticleTool, searchBlogTool } from './blog-tools.js';
import type { BlogPostFull, BlogPostItem } from '#lib/types/blog.js';

function postItem(number: number, title: string, tags: string[]): BlogPostItem {
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

function postFull(number: number, title: string, tags: string[], isPublished = true): BlogPostFull {
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
    reactions: [],
    isPublished,
  };
}

type SearchResult = {
  results: { title: string; url: string; tags: string[]; description: string | null }[];
  count: number;
};
const searchResult = (r: unknown) => r as SearchResult;

type ArticleResult = {
  title: string;
  url: string;
  tags: string[];
  isPublished: boolean;
  description: string | null;
};
const articleResult = (r: unknown) => r as ArticleResult;

const posts = [
  postItem(1, 'SvelteKit Adventures', ['svelte', 'web']),
  postItem(2, 'Reactive Streams in Rust', ['rust']),
  postItem(3, 'Docker Tips', ['devops', 'web']),
];

describe('filterPosts', () => {
  it('filters posts by title, case-insensitively', () => {
    const result = filterPosts(posts, 'svelte');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('SvelteKit Adventures');
  });

  it('filters posts by tag, case-insensitively', () => {
    const result = filterPosts(posts, 'web');
    expect(result).toHaveLength(2);
  });

  it('returns an empty array for no matches', () => {
    const result = filterPosts(posts, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('returns an empty array for an empty query', () => {
    const result = filterPosts(posts, '');
    expect(result).toHaveLength(0);
  });

  it('trims whitespace from the query', () => {
    const result = filterPosts(posts, '  rust  ');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Reactive Streams in Rust');
  });
});

describe('getCurrentArticleTool', () => {
  it('returns the current article with absolute URL', () => {
    const currentPost = postFull(42, 'Test Article', ['test']);
    const tool = getCurrentArticleTool(() => currentPost);
    const result = articleResult(tool.execute());

    expect(result.title).toBe('Test Article');
    expect(result.url).toBe('https://porfirio.dev/blog/42/slug');
    expect(result.tags).toEqual(['test']);
  });

  it('reflects the published state', () => {
    const published = postFull(1, 'Published', ['test'], true);
    const unpublished = postFull(2, 'Draft', ['test'], false);

    const toolPub = getCurrentArticleTool(() => published);
    const toolDraft = getCurrentArticleTool(() => unpublished);

    expect(articleResult(toolPub.execute()).isPublished).toBe(true);
    expect(articleResult(toolDraft.execute()).isPublished).toBe(false);
  });

  it('returns description as null when not present', () => {
    const currentPost = postFull(1, 'No Desc', ['test']);
    const tool = getCurrentArticleTool(() => currentPost);
    const result = articleResult(tool.execute());

    expect(result.description).toBe(null);
  });

  it('reads post lazily, so it reflects current state', () => {
    let current = postFull(1, 'Original Title', ['test']);
    const tool = getCurrentArticleTool(() => current);

    let result = articleResult(tool.execute());
    expect(result.title).toBe('Original Title');

    current = postFull(2, 'Updated Title', ['test']);
    result = articleResult(tool.execute());
    expect(result.title).toBe('Updated Title');
  });
});

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
    current = [...posts, postItem(4, 'More Rust', ['rust'])];
    expect(tool.execute({ query: 'rust' }).count).toBe(2);
  });
});
