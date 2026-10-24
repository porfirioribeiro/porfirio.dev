<script lang="ts">
  import Seo from '#lib/components/Seo.svelte';
  import Icon from '#lib/icons/Icon.svelte';
  import { projects } from '#lib/data/projects.js';
  import { breadcrumbSchema } from '#lib/seo.js';
  import { useWebMCP } from '#lib/webmcp/index.js';
  import { listProjectsTool } from '#lib/webmcp/tools.js';

  const description =
    'Small open-source projects by Porfírio Ribeiro, including rc-service, react-showof, date-input-manager, staticmaps-react and openapi2ts.';

  useWebMCP(() => [listProjectsTool(projects)]);
</script>

<Seo
  title="Projects — Porfírio Ribeiro | porfirio.dev"
  {description}
  jsonLd={breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ])}
/>

<h1>Projects</h1>

<p>
  A collection of small open-source projects I've built as learning tools or to
  use in my day-to-day work.
</p>

{#each projects as project, i (project.name)}
  <div class="project" class:last={i === projects.length - 1}>
    <div class="heading">
      <h2>{project.name}</h2>
      <div class="links">
        {#each project.links as link (link.label)}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on ${link.label}`}
          >
            <Icon icon={link.icon} size={20} />
          </a>
        {/each}
        {#each project.tech as tech (tech.name)}
          <span class="tech" aria-hidden="true"><Icon icon={tech.icon} size={18} /></span>
        {/each}
      </div>
    </div>
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

    .heading {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    h2 {
      font-weight: 600;
      font-size: 1.05rem;
      margin: 0;
    }

    .links {
      display: inline-flex;
      align-items: center;
      gap: 6px;

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
