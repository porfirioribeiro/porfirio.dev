<script lang="ts">
  import type { BlogTag } from "$lib/types/blog";

  interface Props {
    tags: BlogTag[];
  }

  let { tags }: Props = $props();
</script>

<div>
  {#each tags as tag}
    <a href={tag.link} style={`--color: ${tag.color}`} title={tag.description}>
      {tag.name}
    </a>
  {/each}
</div>

<style lang="scss">
  div {
    display: inline-flex;
    gap: 8px;
  }
  a {
    display: inline-block;
    padding: 3px 6px;
    border-radius: 2em;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    background-color: var(--color);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    &:hover {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
      text-decoration: underline;
    }
  }
</style>
