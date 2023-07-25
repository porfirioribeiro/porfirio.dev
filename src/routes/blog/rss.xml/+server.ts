import type { RequestHandler } from "./$types";
import { createGH } from "$lib/server/gh";

export const GET: RequestHandler = async (event) => {
  const posts = await createGH(event).getAllBlogPosts();

  const website = "https://porfirio.dev";

  const x = posts.map(
    (post) => `
    <item>
    <title>${post.title}</title>
    <description>Keywords: ${post.keywords}</description>
    <link>${website}${post.link}</link>
    <pubDate>${new Date(post.date)}</pubDate>
    <content:encoded>
      <div style="margin-top: 50px; font-style: italic;">
        <strong>
          <a href="${website}${post.link}">
            Keep reading
          </a>
        </strong>  
      </div>
    </content:encoded>
  </item>
    `,
  );

  return new Response(
    /*xml*/ `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:dc="https://purl.org/dc/elements/1.1/"
        xmlns:content="https://purl.org/rss/1.0/modules/content/"
        xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
        <channel>
            <title>porfirio.dev</title>
            <link>https://porfirio.dev</link>
            <description>Personal website and blog of Porfírio Ribeiro</description> 
            ${x.join("\n")} 
        </channel>
    </rss>
      `.trim(),
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=5, s-maxage=3600",
      },
    },
  );
};
