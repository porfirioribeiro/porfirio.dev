<script lang="ts">
  import type { ResourceShape } from "./types";

  interface Props {
    resources: ResourceShape[];
  }

  let { resources }: Props = $props();
</script>

<dl class="books">
  {#each resources as res}
    <dt>
      <a href={res.href} target="_blank" rel="noopener noreferrer">
        {res.title}
      </a>
    </dt>
    <dd>{res.author}</dd>
  {/each}
</dl>

<style lang="scss">
  dd {
    margin: 4px 0 12px 0;
    font-size: 14px;
    font-style: italic;
  }
</style>
