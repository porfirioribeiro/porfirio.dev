import type { RequestHandler } from './$types';
import { createGH } from '#lib/server/gh/index.js';
import { buildSitemap } from '#lib/sitemap.js';

export const GET: RequestHandler = async (event) => {
  const posts = await createGH(event).getAllBlogPosts();

  return new Response(buildSitemap(posts), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=5, s-maxage=86400',
    },
  });
};
