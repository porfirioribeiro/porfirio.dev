<script lang="ts">
  import { readableTextColor } from '#lib/color.js';
  import TagChips from './TagChips.svelte';
  import type { BlogTag } from '#lib/types/blog.js';

  interface Props {
    tags: BlogTag[];
  }

  let { tags }: Props = $props();
</script>

<div>
  {#each tags as tag (tag.name)}
    <a
      href={tag.link}
      style={`--color: ${tag.color ?? '#57606a'}; --on-tag: ${readableTextColor(tag.color)}`}
      title={tag.description}
    >
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
    color: var(--on-tag, #fff);
    text-decoration: none;
    font-size: 14px;
    background-color: var(--color);
    &:hover {
      text-decoration: underline;
    }
  }
</style>
