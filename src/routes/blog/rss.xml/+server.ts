import type { RequestHandler } from './$types';
import { createGH } from '#lib/server/gh/index.js';
import { SITE_URL } from '#lib/seo.js';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const cdata = (value: string) => `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

export const GET: RequestHandler = async (event) => {
  const posts = await createGH(event).getAllBlogPosts();

  const latestDate = posts
    .map((post) => post.date)
    .filter(Boolean)
    .sort()
    .at(-1);

  const items = posts.map((post) => {
    const url = `${SITE_URL}${post.link}`;
    const description = post.description || `An article by Porfírio Ribeiro on ${SITE_URL}.`;

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${cdata(description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <content:encoded>${cdata(
        `<p>${escapeXml(description)}</p><p><a href="${escapeXml(url)}">Keep reading ${escapeXml(
          post.title,
        )}</a></p>`,
      )}</content:encoded>
    </item>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>porfirio.dev — Porfírio Ribeiro</title>
    <link>${SITE_URL}/</link>
    <description>Notes and articles about software development by Porfírio Ribeiro.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${latestDate ? `<lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>` : ''}
    ${items.join('\n')}
  </channel>
</rss>`.trim();

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=5, s-maxage=3600',
    },
  });
};
