<script lang="ts">
  import { skillCategories } from '#lib/data/skills.js';
  import { useWebMCP } from '#lib/webmcp/index.js';
  import { listSkillsTool, filterSkillsTool } from '#lib/webmcp/skills-tools.js';

  let activeCategory = $state<string | null>(null);

  const visibleCategories = $derived(
    activeCategory ? skillCategories.filter((c) => c.name === activeCategory) : skillCategories,
  );

  const categoryNames = skillCategories.map((c) => c.name);

  function setCategory(name: string | null) {
    activeCategory = name;
  }

  useWebMCP(() => [listSkillsTool(skillCategories), filterSkillsTool(skillCategories, setCategory)]);
</script>

<svelte:head>
  <title>Skills</title>
  <meta name="description" content="porfirio.dev - Skills" />
</svelte:head>

<h1>Skills</h1>

<div class="filters">
  <button class:active={activeCategory === null} aria-pressed={activeCategory === null} onclick={() => setCategory(null)}>
    All
  </button>
  {#each categoryNames as name (name)}
    <button
      class:active={activeCategory === name}
      aria-pressed={activeCategory === name}
      onclick={() => setCategory(name)}
    >
      {name}
    </button>
  {/each}
</div>

{#each visibleCategories as category (category.name)}
  <h3>{category.name}</h3>
  <ul>
    {#each category.items as item (item)}
      <li>{item}</li>
    {/each}
  </ul>
{/each}

<style lang="scss">
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0.5rem 0 1rem;

    button {
      height: 26px;
      padding: 0 12px;
      font-size: 12px;
      background-color: transparent;
      border: 1px solid var(--theme-border);
      border-radius: 100px;
      appearance: none;
      color: var(--theme-muted);
      cursor: pointer;
      transition:
        color 0.2s,
        border-color 0.2s;

      &:hover {
        color: var(--theme-secondary);
        border-color: var(--theme-secondary);
      }

      &.active {
        color: var(--theme-secondary);
        border-color: var(--theme-secondary);
      }
    }
  }

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
