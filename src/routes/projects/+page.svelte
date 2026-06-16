<script>
  import Icon from "$lib/icons/Icon.svelte";
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

<div class="project">
  <h2>
    rc-service
    <a
      href="https://github.com/porfirioribeiro/rc-service"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={20} /></a
    >
    <a
      href="https://www.npmjs.com/package/rc-service"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-npm" size={20} />
    </a>
    <span class="tech"><Icon icon="logo-react" size={18} /></span>
    <span class="tech"><Icon icon="logo-typescript" size={18} /></span>
  </h2>
  <p>
    React Context Services — a tiny (&lt;1 kb) dependency injection and state
    management library for React.
  </p>
</div>
<div class="project">
  <h2>
    react-showof
    <a
      href="https://github.com/porfirioribeiro/react-showof"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={20} /></a
    >
    <a
      href="https://www.npmjs.com/package/react-showof"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-npm" size={20} />
    </a>
    <span class="tech"><Icon icon="logo-react" size={18} /></span>
    <span class="tech"><Icon icon="logo-typescript" size={18} /></span>
  </h2>
  <p>
    A small (&lt;500 b) opinionated component to help with mount/unmount transitions.
  </p>
</div>
<div class="project">
  <h2>
    date-input-manager
    <a
      href="https://github.com/porfirioribeiro/date-input-manager"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={20} /></a
    >
    <span class="tech"><Icon icon="logo-typescript" size={18} /></span>
  </h2>
  <p>
    Manages input state to make building date inputs straightforward and ergonomic.
  </p>
</div>
<div class="project">
  <h2>
    staticmaps-react
    <a
      href="https://github.com/porfirioribeiro/staticmaps-react"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={20} /></a
    >
    <span class="tech"><Icon icon="logo-react" size={18} /></span>
    <span class="tech"><Icon icon="logo-typescript" size={18} /></span>
  </h2>
  <p>
    Render simple static maps with React, supporting Polygons, Markers and
    Overlay images. Made as a side project, never published on npm, but heavily used
    inside company code.
  </p>
</div>
<div class="project last">
  <h2>
    openapi2ts
    <a
      href="https://github.com/porfirioribeiro/openapi2ts"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={20} /></a
    >
    <span class="tech"><Icon icon="logo-typescript" size={18} /></span>
  </h2>
  <p>
    Generate TypeScript types for models and definitions from Swagger 2 JSON
    files.
  </p>
</div>

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
