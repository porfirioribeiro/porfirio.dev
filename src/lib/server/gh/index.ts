import type { RequestEvent } from "@sveltejs/kit";
import type { Octokit } from "octokit";
import mkSlug from "slug";

import { GITHUB_TOKEN } from "$env/static/private";
import type {
  BlogPostAuthor,
  BlogPostFull,
  BlogPostItem,
  BlogPostShared,
  BlogPostComment,
  BlogTag,
} from "$lib/types/blog";

type RT = keyof Omit<GHIssue["reactions"], "url" | "total_count">;

const reactionIcons: Record<RT, string> = {
  "+1": "👍",
  "-1": "👎",
  laugh: "😄",
  hooray: "🎉",
  confused: "😕",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

//// posts

type GHIssue = Awaited<ReturnType<Octokit["rest"]["issues"]["get"]>>["data"];
type GHLabel = Partial<
  Awaited<ReturnType<Octokit["rest"]["issues"]["getLabel"]>>["data"]
>;
type GHIssueComment = Partial<
  Awaited<ReturnType<Octokit["rest"]["issues"]["getComment"]>>["data"]
>;

type GHUser = GHIssue["user"];

type GetPostsOptions = {
  tag?: string;
};

const owner = "porfirioribeiro";
const repo = "porfirio.dev";

const enum SystemLabels {
  Article = "$article",
  Published = "$published",
}

const PublishedArticleLabels = [SystemLabels.Article, SystemLabels.Published];

export function createGH({ fetch }: RequestEvent) {
  interface GHRequestOptions {
    mediaType?: "json" | "raw" | "text" | "html" | "full";
  }

  function ghRequestRaw(
    path: string,
    { mediaType = "json" }: GHRequestOptions = {}
  ) {
    const mtExt = mediaType == "json" ? "" : `.${mediaType}`;
    const url = `https://api.github.com/repos/${owner}/${repo}/${path}`;
    console.log("GET", url);

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: `application/vnd.github${mtExt}+json`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "porfirio.dev-Api",
      },
    });
  }

  function ghRequest<T>(path: string, o: GHRequestOptions = {}) {
    return ghRequestRaw(path, o).then(async (r) => {
      if (!r.ok) {
        console.error({
          path,
          status: r.status,
          statusText: r.statusText,
          body: await r.text(),
        });
      }
      return r.json();
    }) as Promise<T>;
  }

  return {
    async getAllBlogPosts({ tag }: GetPostsOptions = {}) {
      const labels = (PublishedArticleLabels as string[])
        .concat(tag ?? [])
        .join(",");

      // only isses created by the repository owner
      const r = await ghRequest<GHIssue[]>(
        `issues?labels=${labels}&creator=${owner}`,
        {
          mediaType: "html",
        }
      );
      return r.map(mapToBlogPostItem);
    },
    async getLabelByName(name: string) {
      const r = await ghRequest<GHLabel>(`labels/${name}`);

      return mapLabelToTag(r);
    },
    async getAllTags(): Promise<BlogTag[]> {
      const r = await ghRequest<GHLabel[]>(`labels`);

      return r.map(mapLabelToTag).filter(isValidTag);
    },
    async getBlogPostById(id: number): Promise<BlogPostFull | null> {
      const r = await ghRequestRaw(`issues/${id}`, {
        mediaType: "html",
      });
      if (!r.ok) return null;

      const issue = (await r.json()) as GHIssue;

      const labelNames = issue.labels.map(getLabelName);

      if (
        issue.pull_request || // not a pull request
        issue.user.login !== owner || // only isses created by the repository owner
        !labelNames.includes(SystemLabels.Article) // only articles
      )
        return null;

      return {
        ...mapToBlogPostShared(issue),
        isPublished: labelNames.includes(SystemLabels.Published),
        reactions: mapReactions(issue.reactions),
      };
    },
    async getCommentsForBlogPost(id: number): Promise<BlogPostComment[]> {
      const comments = await ghRequest<GHIssueComment[]>(
        `issues/${id}/comments`,
        {
          mediaType: "html",
        }
      );

      return comments.map<BlogPostComment>((c) => ({
        id: c.id,
        author: mapUserToAuthor(c.user),
        created_at: c.created_at,
        ghUrl: c.html_url,
        reactions: mapReactions(c.reactions),
        ...reparse(c.body_html),
      }));
    },
  };
}

function mapReactions(reactionMap: GHIssue["reactions"]) {
  return Object.entries(reactionIcons).flatMap(([name, icon]) => {
    const count = reactionMap[name];
    return count ? [{ name, count, icon }] : [];
  });
}

function mapToBlogPostShared(issue: GHIssue): BlogPostShared {
  const { meta, blocks, body } = reparse(issue.body_html);
  const slug = meta.slug || mkSlug(issue.title);
  const date = meta.date || mapDate(issue.created_at);

  const tags = issue.labels.flatMap((l) => {
    if (typeof l === "string" || l.name.startsWith("$")) return [];
    return mapLabelToTag(l);
  });

  return {
    number: issue.number,
    title: issue.title,
    slug,
    link: `/blog/${issue.number}/${slug}`,
    description: meta.description,
    ghUrl: issue.html_url,
    date,
    tags,
    keywords: tags.map((t) => t.name).join(", "),
    author: mapUserToAuthor(issue.user),
    blocks,
    body,
  };
}

const isValidTag = (t: BlogTag) => !t.name.startsWith("$");

const mapDate = (created_at: string) => created_at.split("T")[0];

function mapLabelToTag({ name, description, color }: GHLabel): BlogTag {
  return { name, description, link: "/blog/tag/" + name, color: `#${color}` };
}

function getLabelName(l: GHLabel | string) {
  return typeof l === "string" ? l : l.name;
}

function mapUserToAuthor({
  login,
  html_url,
  avatar_url,
}: GHUser): BlogPostAuthor {
  return { name: login, ghUrl: html_url, avatar: avatar_url };
}

function mapToBlogPostItem(issue: GHIssue): BlogPostItem {
  return {
    ...mapToBlogPostShared(issue),
    reactions: issue.reactions.total_count,
    comments: issue.comments,
  };
}

function reparse(body_html: string) {
  const blocks: BlogPostFull["blocks"] = {};
  let meta: Record<string, string> = {};

  const body = body_html
    .replace(/<a href="(.*)" rel="nofollow">#twitter<\/a>/g, (_, url) => {
      blocks.twitter = true;
      return `
    <blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-theme="dark">
    <a href="${url}" target="_blank">Tweet loading...</a></blockquote>
    `;
    })
    .replaceAll(
      /(snippet-clipboard-content|position-relative|overflow-auto|notranslate)\s*/g,
      ""
    )
    .replaceAll(/ data-snippet-clipboard-copy-content="[^"]*"/gm, "")
    .replaceAll(' dir="auto"', "")
    .replaceAll(' class=""', "")
    .replace(
      /<div><pre lang="sv-meta"><code>([\S\s]*)<\/code><\/pre><\/div>/,
      (_, a) => {
        meta = parseMeta(a);
        return "";
      }
    );

  if (body_html.includes('<div class="highlight')) blocks.code = true;

  return {
    body,
    meta,
    blocks,
  };
}

const mre = /(\w+):\s*(.*)/gm;
function parseMeta(a: string): Record<string, string> {
  return Object.fromEntries(
    Array.from(a.matchAll(mre), (m) => [m[1], m[2].trim()])
  );
}
