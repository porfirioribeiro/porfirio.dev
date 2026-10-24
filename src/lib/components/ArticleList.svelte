<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import type { BlogPostItem } from "#lib/types/blog.js";
  import TagChips from "./TagChips.svelte";

  interface Props {
    posts: BlogPostItem[];
  }

  let { posts }: Props = $props();
</script>

{#each posts as post (post.number)}
  <article>
    <h2 class="post-title">
      <a class="title" href={post.link}>{post.title}</a>
    </h2>
    {#if post.description}
      <p class="description">{post.description}</p>
    {/if}
    <div class="chips">
      <TagChips tags={post.tags} />
    </div>
    <time datetime={post.date}>{post.date}</time>
    <a
      href={`${post.ghUrl}#js-timeline-progressive-loader`}
      class="meta"
      target="_blank"
      rel="noreferrer"
      aria-label={`Reactions and comments for ${post.title} on GitHub`}
    >
      <span>{post.reactions}</span><Icon icon="octoicon-smiley" size={16} />
      <span>{post.comments}</span><Icon icon="octoicon-comment" size={16} />
    </a>
  </article>
{/each}

<style lang="scss">
  article {
    display: grid;
    align-items: center;
    gap: 2px 8px;
    flex-wrap: wrap;
    grid-template-areas: "title meta" "description time" "chips chips";
    // grid-template-columns: auto min-content;
    margin-bottom: 1em;
    .post-title {
      grid-area: title;
      flex-grow: 1;
      margin: 0.5rem 0;
      font-size: 0.95rem;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--theme-muted);

      a {
        color: inherit;
      }
    }
    .chips {
      grid-area: chips;
    }
    .description {
      grid-area: description;
      margin: 0.5rem 0;
    }
    time {
      grid-area: time;
      font-size: 0.9em;
    }
    .meta {
      grid-area: meta;
      display: inline-flex;
      align-items: center;
      line-height: 21px;
      gap: 6px;
      margin-left: 0.5em;
      color: var(--theme-muted);
      font-size: 0.9em;
    }
  }
</style>
