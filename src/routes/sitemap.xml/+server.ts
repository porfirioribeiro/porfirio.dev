import type { RequestHandler } from "./$types";
import { createGH } from "$lib/server/gh";

export const GET: RequestHandler = async (event) => {
  const gh = createGH(event);

  const [posts, tags] = await Promise.all([
    gh.getAllBlogPosts(),
    gh.getAllTags(),
  ]);

  const x = [...posts, ...tags].map(
    (post) => `<url><loc>https://porfirio.dev${post.link}</loc></url>`,
  );

  return new Response(
    /*xml*/ `
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
        <url>
          <loc>https://porfirio.dev</loc>
        </url>
        <url>
          <loc>https://porfirio.dev/skills</loc>
        </url>
        <url>
          <loc>https://porfirio.dev/projects</loc>
        </url>
        <url>
        <loc>https://porfirio.dev/resources</loc>
        </url>
        <url>
          <loc>https://porfirio.dev/about</loc>
        </url>
        <url>
          <loc>https://porfirio.dev/blog</loc>
        </url>
        ${x.join("\n")}
      </urlset>
      `.trim(),
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=5, s-maxage=86400",
      },
    },
  );
};
