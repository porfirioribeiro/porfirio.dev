<script lang="ts">
  import { page } from '$app/state';
  import Seo from '#lib/components/Seo.svelte';

  const notFound = $derived(page.status === 404);
  const title = $derived(
    notFound ? 'Page not found | porfirio.dev' : 'Something went wrong | porfirio.dev',
  );
  const description = $derived(
    notFound
      ? 'The page you requested could not be found on porfirio.dev.'
      : 'An unexpected error occurred on porfirio.dev.',
  );
</script>

<Seo {title} {description} noindex />

<h1>{notFound ? 'Page not found' : 'Something went wrong'}</h1>

<p>
  {#if notFound}
    Sorry, that page does not exist or has moved.
  {:else}
    Sorry, something went wrong while loading this page.
  {/if}
</p>

<p>
  Try the <a href="/">homepage</a>, browse the <a href="/blog">blog</a>, or look at
  <a href="/projects">my projects</a>.
</p>
