import type { BlogPostItem, BlogPostFull, BlogTag } from '#lib/types/blog.js';
import { absoluteUrl } from './tools.js';

type ExecuteResult = Record<string, unknown>;

/**
 * Filters blog posts by title or tag, case-insensitive.
 * Used by both the page view and the search tool to maintain
 * consistent matching logic.
 */
export function filterPosts(posts: BlogPostItem[], query: string): BlogPostItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.name.toLowerCase().includes(q)),
  );
}

/**
 * Tool: returns details of a blog article. State-reflecting tool: it should
 * be re-registered whenever the open article changes, so it always describes
 * the article currently on screen.
 */
export function getCurrentArticleTool(getPost: () => BlogPostFull) {
  return {
    name: 'get_current_article',
    title: 'Get current article',
    description:
      'Returns details of the blog article currently open on this page: title, absolute URL, tags, publication state, and description.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: (): ExecuteResult => {
      const post = getPost();
      return {
        title: post.title,
        url: absoluteUrl(post.link),
        tags: post.tags.map((t) => t.name),
        isPublished: post.isPublished,
        description: post.description ?? null,
      };
    },
  };
}

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
      const query = typeof input.query === 'string' ? input.query : '';
      const matches = filterPosts(getPosts(), query);
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
