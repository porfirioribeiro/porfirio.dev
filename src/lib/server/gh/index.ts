import type { Octokit } from "octokit";
import mkSlug from "slug";

import { GITHUB_TOKEN } from "$env/static/private";
import type {
  BlogPostFull,
  BlogPostItem,
  BlogPostShared,
  BlogTag,
} from "$lib/types/blog";

// export const octokit = new Octokit({
//   auth: GITHUB_TOKEN,
// });

//// posts

type GHIssue = Awaited<ReturnType<Octokit["rest"]["issues"]["get"]>>["data"];
type GHLabel = Partial<
  Awaited<ReturnType<Octokit["rest"]["issues"]["getLabel"]>>["data"]
>;

type GetPostsOptions = {
  tag?: string;
};

const owner = "porfirioribeiro";
const repo = "porfirio.dev";

interface GHRequestOptions {
  mediaType?: "json" | "raw" | "text" | "html" | "full";
}

function ghRequest<T>(
  path: string,
  { mediaType = "json" }: GHRequestOptions = {}
) {
  const mtExt = mediaType == "json" ? "" : `.${mediaType}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/${path}`;
  // TODO remove the token from logs
  console.log("ghRequest", url, GITHUB_TOKEN);

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: `application/vnd.github${mtExt}+json`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "porfirio.dev-Api",
    },
  }).then(async (r) => {
    console.log(
      "ghRequest",
      r.ok,
      r.status,
      r.statusText,
      Object.fromEntries(r.headers.entries())
    );
    if (!r.ok) {
      console.log("raw text", await r.text());
    }

    try {
      return r.json();
    } catch (e) {
      console.error("ghRequest", e);

      throw e;
    }
  }) as Promise<T>;
}

export async function getAllBlogPosts(
  { tag }: GetPostsOptions = {} //
): Promise<BlogPostItem[]> {
  // only issues with the $article label (and optionally the tag)
  const labels = tag ? `$article,${tag}` : "$article";
  // only isses created by the repository owner
  const r = await ghRequest<GHIssue[]>(
    `issues?labels=${labels}&creator=${owner}`
  );
  return r.map(mapToBlogPostItem);
}

export async function getLabelByName(name: string) {
  const r = await ghRequest<GHLabel>(`labels/${name}`);

  return mapLabelToTag(r);
}

export async function getAllTags(): Promise<BlogTag[]> {
  const r = await ghRequest<GHLabel[]>(`labels`);

  return r.map(mapLabelToTag).filter(isValidTag);
}

export async function getBlogPostById(id: number): Promise<BlogPostFull> {
  const r = await ghRequest<GHIssue>(`issues/${id}`, { mediaType: "html" });

  return mapToBlogPostFull(r);
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
    created_at: issue.created_at.split("T")[0],
    tags: tags,
    keywords: tags.map((t) => t.name).join(", "),
  };
}

const isValidTag = (t: BlogTag) => !t.name.startsWith("$");

function mapLabelToTag({ name, description, color }: GHLabel): BlogTag {
  return { name, description, link: "/blog/tag/" + name, color: `#${color}` };
}

function mapToBlogPostItem(issue: GHIssue): BlogPostItem {
  return {
    ...mapToBlogPostShared(issue),
    reactions: issue.reactions.total_count,
    comments: issue.comments,
  };
}

function mapToBlogPostFull(issue: GHIssue): BlogPostFull {
  return {
    ...mapToBlogPostShared(issue),
    ...reparse(issue.body_html),
  };
}

function reparse(body_html: string) {
  let hasTweets = false;
  let description: string | undefined;
  const body = body_html
    .replace(/<a href="(.*)" rel="nofollow">#twitter<\/a>/g, (_, url) => {
      hasTweets = true;
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

  return {
    body,
    description,
    blocks: {
      twitter: hasTweets,
      code: body_html.includes('<div class="highlight'),
    },
  };
}
