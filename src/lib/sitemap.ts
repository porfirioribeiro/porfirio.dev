import { absoluteUrl } from './seo.js';
import type { BlogPostItem } from './types/blog.js';

/** Canonical, indexable pages that are not blog posts or tag archives. */
export const STATIC_SITEMAP_PATHS = [
  '/',
  '/projects',
  '/skills',
  '/resources',
  '/about',
  '/blog',
  '/blog/tag',
] as const;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

function urlEntry(loc: string, lastmod?: string) {
  return lastmod
    ? `  <url><loc>${escapeXml(loc)}</loc><lastmod>${escapeXml(lastmod)}</lastmod></url>`
    : `  <url><loc>${escapeXml(loc)}</loc></url>`;
}

/**
 * Builds the sitemap from published posts. Tag archives are derived from the
 * tags actually attached to a published post, so every listed URL has content.
 * `lastmod` is only emitted where the content provides a real date.
 */
export function buildSitemap(posts: BlogPostItem[]): string {
  const postEntries = new Map<string, string | undefined>();
  const tagEntries = new Map<string, { name: string; lastmod?: string }>();

  for (const post of posts) {
    postEntries.set(absoluteUrl(post.link), post.date || undefined);

    for (const tag of post.tags) {
      if (!tag.name) continue;
      const url = absoluteUrl(`/blog/tag/${encodeURIComponent(tag.name)}`);
      const existing = tagEntries.get(url);
      if (!existing) {
        tagEntries.set(url, { name: tag.name, lastmod: post.date || undefined });
      } else if (post.date && (!existing.lastmod || post.date > existing.lastmod)) {
        existing.lastmod = post.date;
      }
    }
  }

  const staticEntries = STATIC_SITEMAP_PATHS.map((path) => urlEntry(absoluteUrl(path)));

  const postUrls = [...postEntries.keys()].sort();
  const sortedPosts = postUrls.map((loc) => urlEntry(loc, postEntries.get(loc)));

  const sortedTags = [...tagEntries.entries()].sort(([, a], [, b]) => a.name.localeCompare(b.name));
  const tagUrls = sortedTags.map(([loc, tag]) => urlEntry(loc, tag.lastmod));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...sortedPosts,
    ...tagUrls,
    '</urlset>',
  ].join('\n');
}
