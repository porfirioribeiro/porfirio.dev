<script lang="ts">
  import Seo from "#lib/components/Seo.svelte";
  import { skillCategories } from "#lib/data/skills.js";
  import {
    personSchema,
    profilePageSchema,
    websiteSchema,
  } from "#lib/seo.js";
  import { useWebMCP } from "#lib/webmcp/index.js";
  import { siteOverviewTool } from "#lib/webmcp/tools.js";

  const description =
    'Porfírio Ribeiro is a self-taught software developer from Portugal working across the full stack — projects, skills, blog posts and resources.';
  const currentSkills =
    skillCategories.find((category) => category.name === 'Working with')?.items ?? [];

  useWebMCP(() => [siteOverviewTool()]);
</script>

<Seo
  title="Porfírio Ribeiro — Software Developer | porfirio.dev"
  {description}
  jsonLd={[profilePageSchema(description), personSchema(), websiteSchema(description)]}
/>

<section aria-labelledby="intro">
  <h1 id="intro">Porfírio Ribeiro</h1>
  <p>Hello! I'm Porfírio, a self-taught software developer from Portugal.</p>
  <p>
    I switched careers from farming to software development to follow my dream.
    Today I lead a small development team and work across the full stack.
  </p>
  <p>
    I started as a frontend developer with JavaScript, SCSS and React, then moved
    into backend development with Java/Kotlin and the Spring framework —
    becoming a full-stack developer along the way. I also built the company's
    mobile app with Dart and Flutter.
  </p>
  <p>
    Throughout this journey I've created some small open-source libraries, which
    you can find on
    <a
      href="https://github.com/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer">GitHub</a
    >
    and
    <a
      href="https://www.npmjs.com/~porfirio"
      target="_blank"
      rel="noopener noreferrer">npm</a
    >. I also keep a list of <a href="/resources">resources</a> I've found useful along the way.
  </p>
  <p>
    My one public talk was at a <a
      href="https://www.youtube.com/watch?v=X9vE-0qFAJI"
      target="_blank"
      rel="noopener noreferrer">meetup</a
    > where I talked about an investigation I was doing with Preact by adding a new
    API to write components based on the Vue Composition API.
  </p>
  <p>
    You can follow me on <a
      href="https://github.com/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer">GitHub</a
    >,
    <a
      href="https://twitter.com/porfirio"
      target="_blank"
      rel="noopener noreferrer">Twitter</a
    >,
    <a
      href="https://linkedin.com/in/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer">LinkedIn</a
    >
    or reach me at
    <a
      href="mailto:porfirioribeiro@gmail.com"
      target="_blank"
      rel="noopener noreferrer">porfirioribeiro@gmail.com</a
    >.
  </p>
</section>

<section aria-labelledby="working-with">
  <h2 id="working-with">What I work with</h2>
  <p>My current day-to-day stack includes:</p>
  <ul class="skills">
    {#each currentSkills as skill (skill)}
      <li>{skill}</li>
    {/each}
  </ul>
  <p>
    You can also read about my <a href="/skills">previous experience and what I'm exploring</a>,
    browse my <a href="/projects">open-source projects</a>, or read the
    <a href="/blog">blog</a>.
  </p>
</section>

<style lang="scss">
  .skills {
    padding: 0;
    margin: 0.5rem 0 1rem;
  }

  .skills li {
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
