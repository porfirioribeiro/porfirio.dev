<script>
  import Icon from "$lib/icons/Icon.svelte";
</script>

<h1>Projects</h1>

<p>
  Over the time I've been creating some small projects as learning tools or to
  later use as part of my daily job
</p>

<div class="project">
  <h2>
    rc-service
    <a
      href="https://github.com/porfirioribeiro/rc-service"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={24} /></a
    >
    <a
      href="https://www.npmjs.com/package/rc-service"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-npm" size={24} />
    </a>
    <span><Icon icon="logo-react" size={24} /></span>
    <span><Icon icon="logo-typescript" size={24} /></span>
  </h2>
  <p>
    React Context Services is a small (less than 1kb), dependency injection and
    state management made easy
  </p>
</div>
<div class="project">
  <h2>
    react-showof
    <a
      href="https://github.com/porfirioribeiro/react-showof"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={24} /></a
    >
    <a
      href="https://www.npmjs.com/package/react-showof"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-npm" size={24} />
    </a>
    <span><Icon icon="logo-react" size={24} /></span>
    <span><Icon icon="logo-typescript" size={24} /></span>
  </h2>
  <p>
    React-showof is a small (less than 500b) and opinionated component to help
    with (un)mounting transitions.
  </p>
</div>
<div class="project">
  <h2>
    date-input-manager
    <a
      href="https://github.com/porfirioribeiro/date-input-manager"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={24} /></a
    >
    <span><Icon icon="logo-typescript" size={24} /></span>
  </h2>
  <p>
    Manage input state, allowing to create easy to use inputs for writing dates
  </p>
</div>
<div class="project">
  <h2>
    staticmaps-react
    <a
      href="https://github.com/porfirioribeiro/staticmaps-react"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={24} /></a
    >
    <span><Icon icon="logo-react" size={24} /></span>
    <span><Icon icon="logo-typescript" size={24} /></span>
  </h2>
  <p>
    Render simple static maps with react, supporting Polygons, Markers and
    Overlay images Made as a side project, never published on npm, but very used
    inside company code.
  </p>
</div>
<div class="project">
  <h2>
    openapi2ts
    <a
      href="https://github.com/porfirioribeiro/openapi2ts"
      target="_blank"
      rel="noopener noreferrer"><Icon icon="logo-github" size={24} /></a
    >
    <span><Icon icon="logo-typescript" size={24} /></span>
  </h2>
  <p>
    Generate typescript files for models and definitions from swagger 2 json
    files
  </p>
</div>

<style lang="scss">
  .project {
    border-bottom: 1px solid white;
    h2 {
      font-weight: bold;
      display: flex;
      align-items: center;
      > * {
        margin: 0 6px;
        line-height: 0;
      }
    }

    p {
      font-size: 14px;
    }
  }
</style>
