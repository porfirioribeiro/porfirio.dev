<script context="module">
  export const prerender = true;
</script>

<svelte:head>
  <title>Skills</title>
  <meta name="description" content="porfirio.dev - Skills" />
</svelte:head>

<h1>Skills</h1>

<h3>Working with:</h3>
<ul>
  <li>React with Typescript</li>
  <li>SCSS / PostCSS / CSS Modules</li>
  <li>Spring Boot with Java / Kotlin</li>
  <li>Spring webmvc / Spring webflux</li>
  <li>PostgreSQL</li>
  <li>Hibernate / JPA /R2DBC</li>
  <li>Microservices with Docker / K8s</li>
  <li>Firebase</li>
  <li>Flutter with Dart</li>
</ul>

<h3>Having fun and exploring:</h3>
<ul>
  <li>Deno</li>
  <li>Svelte / Svelte-kit</li>
  <li>Reactive-Streams and RSocket</li>
  <li>Rust (SQLx, actix-web)</li>
</ul>

<style lang="scss">
  ul {
    padding: 0;
  }
  li {
    line-height: 1.8;
    list-style: none;
  }
  li::before {
    content: "🗹";
    margin-left: 10px;
    padding-right: 10px;
  }
</style>
