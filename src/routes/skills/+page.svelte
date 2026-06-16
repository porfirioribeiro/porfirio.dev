<svelte:head>
  <title>Skills</title>
  <meta name="description" content="porfirio.dev - Skills" />
</svelte:head>

<h1>Skills</h1>

<h3>Working with</h3>
<ul>
  <li>Vue with TypeScript</li>
  <li>SCSS / PostCSS / CSS Modules</li>
  <li>Microservices with Docker / Kubernetes</li>
</ul>

<h3>Previous experience</h3>
<ul>
  <li>React with TypeScript</li>
  <li>SCSS / PostCSS / CSS Modules</li>
  <li>Spring Boot with Java / Kotlin</li>
  <li>Spring WebMVC / Spring WebFlux</li>
  <li>PostgreSQL</li>
  <li>Hibernate / JPA / R2DBC</li>
  <li>Microservices with Docker / Kubernetes</li>
  <li>Firebase</li>
  <li>Flutter with Dart</li>
</ul>

<h3>Having fun &amp; exploring</h3>
<ul>
  <li>Deno</li>
  <li>Svelte / SvelteKit</li>
  <li>Reactive Streams and RSocket</li>
  <li>Rust (SQLx, actix-web)</li>
</ul>

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
  }
  li::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--theme-secondary);
    flex-shrink: 0;
  }
</style>
