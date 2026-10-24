import { describe, expect, it } from 'vite-plus/test';
import { readableTextColor } from './color.js';
import { absoluteUrl, blogPostingSchema, serialiseJsonLd } from './seo.js';
import { buildSitemap } from './sitemap.js';
import type { BlogPostFull, BlogPostItem } from './types/blog.js';

function postItem(
  number: number,
  date: string,
  tags: string[],
  overrides: Partial<BlogPostItem> = {},
): BlogPostItem {
  return {
    number,
    title: `Post ${number}`,
    slug: `post-${number}`,
    description: undefined,
    blocks: {},
    link: `/blog/${number}/post-${number}`,
    ghUrl: `https://github.com/x/y/issues/${number}`,
    date,
    tags: tags.map((name) => ({
      name,
      link: '/blog/tag/' + encodeURIComponent(name),
    })),
    keywords: '',
    author: { name: 'Porfírio', ghUrl: 'https://github.com/porfirioribeiro' },
    body: '',
    reactions: 0,
    comments: 0,
    ...overrides,
  };
}

describe('absoluteUrl', () => {
  it('builds canonical absolute URLs without trailing slashes or queries', () => {
    expect(absoluteUrl('/')).toBe('https://porfirio.dev/');
    expect(absoluteUrl('/skills/')).toBe('https://porfirio.dev/skills');
    expect(absoluteUrl('/blog/tag/C%23?x=1#top')).toBe('https://porfirio.dev/blog/tag/C%23');
    expect(absoluteUrl('https://example.com/a/')).toBe('https://example.com/a');
  });
});

describe('buildSitemap', () => {
  const posts = [
    postItem(2, '2026-02-01', ['GitHub', 'C#']),
    postItem(1, '2025-01-01', ['GitHub']),
  ];

  it('lists canonical static pages and published posts', () => {
    const xml = buildSitemap(posts);
    expect(xml).toContain('<loc>https://porfirio.dev/</loc>');
    expect(xml).toContain('<loc>https://porfirio.dev/skills</loc>');
    expect(xml).toContain('<loc>https://porfirio.dev/blog/tag</loc>');
    expect(xml).toContain(
      '<loc>https://porfirio.dev/blog/2/post-2</loc><lastmod>2026-02-01</lastmod>',
    );
    expect(xml).not.toContain('/skills/');
  });

  it('derives tag archives from posts and uses the newest post date', () => {
    const xml = buildSitemap(posts);
    expect(xml).toContain(
      '<loc>https://porfirio.dev/blog/tag/GitHub</loc><lastmod>2026-02-01</lastmod>',
    );
    expect(xml).toContain(
      '<loc>https://porfirio.dev/blog/tag/C%23</loc><lastmod>2026-02-01</lastmod>',
    );
  });

  it('does not emit lastmod for static pages', () => {
    const xml = buildSitemap([]);
    expect(xml).toMatch(/<loc>https:\/\/porfirio\.dev\/about<\/loc><\/url>/);
  });

  it('has no duplicate URLs', () => {
    const xml = buildSitemap(posts);
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(new Set(locations).size).toBe(locations.length);
  });
});

describe('JSON-LD', () => {
  it('uses a stable person and article id', () => {
    const post: BlogPostFull = {
      ...postItem(7, '2026-03-01', ['Svelte']),
      isPublished: true,
      reactions: [],
      image: undefined,
    };
    const schema = blogPostingSchema(post);
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema['@id']).toBe('https://porfirio.dev/blog/7/post-7#article');
    expect(schema.author).toEqual({ '@id': 'https://porfirio.dev/#person' });
    expect(schema.keywords).toBe('Svelte');
  });

  it('escapes script-closing characters', () => {
    expect(serialiseJsonLd({ value: '</script>' })).not.toContain('</script>');
  });
});

describe('readableTextColor', () => {
  it('picks the higher-contrast text colour', () => {
    expect(readableTextColor('#ffffff')).toBe('#000000');
    expect(readableTextColor('#000000')).toBe('#ffffff');
    expect(readableTextColor('#bb86fc')).toBe('#000000');
    expect(readableTextColor(undefined)).toBe('#ffffff');
  });
});
