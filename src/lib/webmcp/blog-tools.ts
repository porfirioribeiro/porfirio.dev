import type { BlogPostItem, BlogTag } from '#lib/types/blog.js';
import { absoluteUrl } from './tools.js';

type ExecuteResult = Record<string, unknown>;

/**
 * Tool: searches blog posts by title or tag. Read-only — it reports
 * matches but does not change the page.
 *
 * Takes a lazy posts getter because the blog page loads posts via a
 * remote query; deferring the read means the tool always sees fresh data.
 */
export function searchBlogTool(getPosts: () => BlogPostItem[]) {
  return {
    name: 'search_blog',
    title: 'Search blog posts',
    description:
      'Searches the blog of porfirio.dev by free-text query, matching post titles and tag names (case-insensitive). Returns matching posts with title, absolute URL, tags, and description.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Text to look for in post titles and tags, e.g. "svelte" or "rust".',
        },
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true },
    execute: (input: Record<string, unknown>): ExecuteResult => {
      const query = typeof input.query === 'string' ? input.query.trim().toLowerCase() : '';
      if (!query) return { results: [], count: 0 };
      const matches = getPosts().filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(query)),
      );
      const results = matches.map((post) => ({
        title: post.title,
        url: absoluteUrl(post.link),
        tags: post.tags.map((t) => t.name),
        description: post.description ?? null,
      }));
      return { results, count: results.length };
    },
  };
}

/** Tool: lists all blog tags with their absolute URLs. */
export function listBlogTagsTool(getTags: () => BlogTag[] | Promise<BlogTag[]>) {
  return {
    name: 'list_blog_tags',
    title: 'List blog tags',
    description:
      'Lists all tags used on the porfirio.dev blog, with absolute URLs to each tag archive page.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async (): Promise<ExecuteResult> => {
      const tags = await getTags();
      return {
        tags: tags.map((tag) => ({ name: tag.name, url: absoluteUrl(tag.link) })),
      };
    },
  };
}
