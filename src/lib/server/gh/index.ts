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
import type { RequestEvent } from "@sveltejs/kit";

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

export function createGH({ fetch }: RequestEvent) {
  interface GHRequestOptions {
    mediaType?: "json" | "raw" | "text" | "html" | "full";
  }

  function ghRequest<T>(
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
    }).then(async (r) => {
      if (!r.ok) {
        console.error({
          url,
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
      // only issues with the $article label (and optionally the tag)
      const labels = tag ? `$article,${tag}` : "$article";
      // only isses created by the repository owner
      const r = await ghRequest<GHIssue[]>(
        `issues?labels=${labels}&creator=${owner}`
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
    async getBlogPostById(id: number): Promise<BlogPostFull> {
      const issue = await ghRequest<GHIssue>(`issues/${id}`, {
        mediaType: "html",
      });

      return {
        ...mapToBlogPostShared(issue),
        ...reparse(issue.body_html),
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
  const slug = mkSlug(issue.title);

  const tags = issue.labels.flatMap((l) => {
    if (typeof l === "string" || l.name.startsWith("$")) return [];
    return mapLabelToTag(l);
  });

  return {
    number: issue.number,
    title: issue.title,
    slug,
    link: `/blog/${issue.number}/${slug}`,
    ghUrl: issue.html_url,
    created_at: mapDate(issue.created_at),
    tags: tags,
    keywords: tags.map((t) => t.name).join(", "),
    author: mapUserToAuthor(issue.user),
  };
}

const isValidTag = (t: BlogTag) => !t.name.startsWith("$");

const mapDate = (created_at: string) => created_at.split("T")[0];

function mapLabelToTag({ name, description, color }: GHLabel): BlogTag {
  return { name, description, link: "/blog/tag/" + name, color: `#${color}` };
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
  let description: string | undefined;
  const blocks: BlogPostFull["blocks"] = {};

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
      /<div><pre lang="description"><code>([\S\s]*)<\/code><\/pre><\/div>/,
      (_, a) => {
        description = a;
        return "";
      }
    );

  if (body_html.includes('<div class="highlight')) blocks.code = true;

  return {
    body,
    description,
    blocks,
  };
}
