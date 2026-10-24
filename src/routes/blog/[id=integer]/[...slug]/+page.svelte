<script lang="ts">
  import { formatDistanceToNow } from "date-fns";
  import BlogMeta from "#lib/components/BlogMeta.svelte";
  import TagChips from "#lib/components/TagChips.svelte";
  import Markdown from "#lib/components/Markdown.svelte";
  import Reactions from "#lib/components/Reactions.svelte";
  import { getBlogPost } from "#lib/blog.remote.js";
  import { useWebMCP } from "#lib/webmcp/index.js";
  import { getCurrentArticleTool } from "#lib/webmcp/blog-tools.js";

  let { params } = $props();

  const data = $derived(await getBlogPost({ id: params.id, slug: params.slug }));

  // State-reflecting tool: re-registers whenever the open article changes,
  // so it always describes the article currently on screen.
  useWebMCP(() => [getCurrentArticleTool(() => data.post)]);
</script>

<BlogMeta post={data.post} />
<svelte:head>
  {#if data.post.blocks.code}
    <link
      rel="stylesheet"
      href="https://unpkg.com/github-syntax-dark@0.5.0/lib/github-dark.css"
    />
  {/if}
  {#if data.post.blocks.twitter}
    <script
      async
      src="https://platform.twitter.com/widgets.js"
      charset="utf-8"
    ></script>
  {/if}
</svelte:head>

<article>
  <h1>{data.post.title}</h1>
  {#if !data.post.isPublished}
    <em class="draft-warn">Note: this blog post is not published</em>
  {/if}
  <Markdown body={data.post.body} />
  <Reactions reactions={data.post.reactions} />

  <div>
    <time datetime={data.post.date}>{data.post.date}</time>
    <TagChips tags={data.post.tags} />
  </div>
</article>

<section aria-labelledby="comments">
  <h2 id="comments">Comments</h2>
  {#each data.comments as comment (comment.id)}
    <article aria-label={`Comment by ${comment.author.name}`}>
      <a href={comment.author.ghUrl}>
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          width="32"
          height="32"
          loading="lazy"
          decoding="async"
        />
      </a>
      <a href={comment.ghUrl}>
        <time datetime={comment.created_at}>
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
            includeSeconds: true,
          })}
        </time>
      </a>

      <Markdown body={comment.body} />
      <Reactions reactions={comment.reactions} />
    </article>
  {:else}
    <p>No comments yet.</p>
  {/each}

  <a
    href={data.post.ghUrl + "#issuecomment-new"}
    target="_blank"
    rel="noreferrer"
  >
    Add a comment
  </a>
</section>

<style lang="scss">
  section {
    margin-top: 2rem;
    article {
      border: 1px solid white;
      padding: 1rem;
    }
  }
  .draft-warn {
    display: inline-block;
    padding: 5px 10px;
    margin: 5px 0;
    border: 1px solid rgba(255, 0, 0, 0.3);
    background: rgba(255, 0, 0, 0.1);
    border-radius: 5px;
  }
</style>
