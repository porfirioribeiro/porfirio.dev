<script lang="ts">
  import Seo from '#lib/components/Seo.svelte';
  import { skillCategories } from '#lib/data/skills.js';
  import { breadcrumbSchema } from '#lib/seo.js';
  import { useWebMCP } from '#lib/webmcp/index.js';
  import { listSkillsTool, filterSkillsTool } from '#lib/webmcp/skills-tools.js';

  const description =
    'The technologies Porfírio Ribeiro works with today, his previous frontend, backend and mobile experience, and what he is currently exploring.';

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

<Seo
  title="Skills — Porfírio Ribeiro | porfirio.dev"
  {description}
  jsonLd={breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Skills', path: '/skills' },
  ])}
/>

<h1>Skills</h1>

<div class="filters" role="group" aria-label="Filter skills by category">
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
<p class="visually-hidden" aria-live="polite">
  Showing {visibleCategories.length} of {categoryNames.length} categories.
</p>

{#each visibleCategories as category (category.name)}
  <h2 class="section-title">{category.name}</h2>
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

  .section-title {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--theme-muted);
    margin: 2rem 0 0.5rem;
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
