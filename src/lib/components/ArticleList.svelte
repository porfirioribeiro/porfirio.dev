<script lang="ts">
  import Icon from "$lib/icons/Icon.svelte";
  import type { BlogPostItem } from "$lib/types/blog";
  import TagChips from "./TagChips.svelte";

  export let posts: BlogPostItem[];
</script>

{#each posts as post}
  <article>
    <a class="title" href={post.link}><h3>{post.title}</h3></a>
    <div class="chips">
      <TagChips tags={post.tags} />
    </div>
    <time>{post.created_at}</time>
    <a
      href={`${post.ghUrl}#js-timeline-progressive-loader`}
      class="meta"
      target="_blank"
      rel="noreferrer"
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
    grid-template-areas: "title meta" "chips time";
    grid-template-columns: auto min-content;
    margin-bottom: 1em;
    .title {
      grid-area: title;
      flex-grow: 1;
      h3 {
        margin: 0.5rem 0;
      }
    }
    .chips {
      grid-area: chips;
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
      color: #666;
      font-size: 0.9em;
    }
  }
</style>
