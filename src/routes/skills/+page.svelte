<script lang="ts">
  import { skillCategories } from '#lib/data/skills.js';
</script>

<svelte:head>
  <title>Skills</title>
  <meta name="description" content="porfirio.dev - Skills" />
</svelte:head>

<h1>Skills</h1>

{#each skillCategories as category (category.name)}
  <h3>{category.name}</h3>
  <ul>
    {#each category.items as item (item)}
      <li>{item}</li>
    {/each}
  </ul>
{/each}

<style lang="scss">
  ul {
    padding: 0;
    margin: 0.5rem 0 1.5rem;
  }
  li {
    line-height: 1.9;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--theme-secondary);
      flex-shrink: 0;
    }
  }
</style>
