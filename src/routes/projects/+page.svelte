<script lang="ts">
  import Icon from '#lib/icons/Icon.svelte';
  import { projects } from '#lib/data/projects.js';
</script>

<svelte:head>
  <title>Projects</title>
  <meta name="description" content="porfirio.dev - Projects" />
</svelte:head>

<h1>Projects</h1>

<p>
  A collection of small open-source projects I've built as learning tools or to
  use in my day-to-day work.
</p>

{#each projects as project, i (project.name)}
  <div class="project" class:last={i === projects.length - 1}>
    <h2>
      {project.name}
      {#each project.links as link (link.label)}
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          <Icon icon={link.icon} size={20} />
        </a>
      {/each}
      {#each project.tech as tech (tech.name)}
        <span class="tech"><Icon icon={tech.icon} size={18} /></span>
      {/each}
    </h2>
    <p>{project.description}</p>
  </div>
{/each}

<style lang="scss">
  .project {
    border-bottom: 1px solid var(--theme-border);
    padding: 0.25rem 0 0.5rem;

    &.last {
      border-bottom: none;
    }

    h2 {
      font-weight: 600;
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;

      a,
      .tech {
        display: inline-flex;
        line-height: 0;
        color: var(--theme-muted);
        transition: color 0.2s;

        &:hover {
          color: var(--theme-secondary);
          text-decoration: none;
        }
      }
    }

    p {
      margin-top: 0.25rem;
      font-size: 0.9rem;
      color: var(--theme-muted);
    }
  }
</style>
