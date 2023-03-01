<script lang="ts">
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import BlogMeta from "$lib/components/BlogMeta.svelte";
  import TagChips from "$lib/components/TagChips.svelte";
  import type { PageData } from "./$types";
  import Markdown from "$lib/components/Markdown.svelte";
  import Reactions from "$lib/components/Reactions.svelte";

  export let data: PageData;
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
    <time>{data.post.created_at}</time>
    <TagChips tags={data.post.tags} />
  </div>
</article>

<section>
  {#each data.comments as comment}
    <article>
      <a href={comment.author.ghUrl}>
        <img src={comment.author.avatar} alt={comment.author.name} width="32" />
      </a>
      <a href={comment.ghUrl}>
        <time>
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
            includeSeconds: true,
          })}
        </time>
      </a>

      <Markdown body={comment.body} />
      <Reactions reactions={comment.reactions} />
    </article>
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
