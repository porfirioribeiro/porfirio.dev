<script lang="ts">
  import Seo from '#lib/components/Seo.svelte';
  import Resources from '#lib/resources/index.svelte';
  import { books } from '#lib/resources/books.js';
  import { podcasts } from '#lib/resources/podcasts.js';
  import { courses } from '#lib/resources/courses.js';
  import { breadcrumbSchema } from '#lib/seo.js';
  import { useWebMCP } from '#lib/webmcp/index.js';
  import { listResourcesTool } from '#lib/webmcp/resources-tools.js';

  const description =
    'Books, podcasts and courses that Porfírio Ribeiro found useful while learning software development.';

  useWebMCP(() => [listResourcesTool({ book: books, podcast: podcasts, course: courses })]);
</script>

<Seo
  title="Developer Resources — Porfírio Ribeiro"
  {description}
  jsonLd={breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
  ])}
/>

<h1>Resources</h1>

<p>
  Over the last few years of self-taught learning I've read, listened to, and watched so many
  interesting things that helped me grow in my career as a developer. Here I highlight
  some of them — books, podcasts, and courses.
</p>

<h2 class="section-title">Books</h2>

<p>A list of some books I enjoyed reading and I found interesting.</p>

<Resources resources={books} />

<h2 class="section-title">Podcasts</h2>

<p>Podcasts I enjoy listening to on my morning walks.</p>

<Resources resources={podcasts} />

<h2 class="section-title">Courses</h2>

<p>
  Courses I took fully or partially to deepen my knowledge on specific topics.
</p>

<Resources resources={courses} />

<style lang="scss">
  .section-title {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--theme-muted);
    margin: 2rem 0 0.5rem;
  }
</style>
