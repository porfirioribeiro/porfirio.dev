<script lang="ts">
  import { getBlogTags } from '#lib/blog.remote.js';

  const tags = getBlogTags();
</script>

<h1>Tags</h1>

{#each await tags as tag (tag.name)}
  <a href={tag.link} style={`--color: ${tag.color}`} title={tag.description}>
    <h3><span style:background={tag.color}></span>{tag.name}</h3>
  </a>
  {#if tag.description}
    <p>
      {tag.description}
    </p>
  {/if}
{/each}

<style lang="scss">
  h3 {
    margin-bottom: 0;
    line-height: 10px;
    span {
      display: inline-block;
      width: 0.8em;
      height: 0.8em;
      margin-right: 0.5em;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
</style>
