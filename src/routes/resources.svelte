<script context="module" lang="ts">
  export const prerender = true;

  import { books } from "$lib/resources/books";
  import { podcasts } from "$lib/resources/podcasts";

  export function load() {
    return {
      props: {
        books,
        podcasts,
      },
    };
  }
</script>

<script lang="ts">
  import Resources from "$lib/resources/index.svelte";
  import type { ResourceShape } from "$lib/resources/types";

  export let books: ResourceShape[];
  export let podcasts: ResourceShape[];
</script>

<svelte:head>
  <title>Resources</title>
  <meta name="description" content="porfirio.dev - Resources" />
</svelte:head>

<h1>Resources</h1>

<h3>Books</h3>

<p>A list of some books i enjoyed reading and i found interesting.</p>

<Resources resources={books} />

<h3>Podcasts</h3>

<p>
  A list of podcasts i enjoy listen to while i'm going for a walk every morning
</p>

<Resources resources={podcasts} />
