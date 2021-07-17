<script context="module" lang="ts">
  export const prerender = true;

  import { books } from "$lib/resources/books";

  export function load() {
    return {
      props: {
        books,
      },
    };
  }
</script>

<script lang="ts">
  import type { Book } from "$lib/resources/books";

  export let books: Book[];
</script>

<svelte:head>
  <title>Resources</title>
  <meta name="description" content="porfirio.dev - Resources" />
</svelte:head>


<h3>Books</h3>

<dl>
  {#each books as book}
    <dt>
      <a href={book.href} target="_blank" rel="noopener noreferrer">
        {book.title}
      </a>
    </dt>
    <dd>{book.author}</dd>
  {/each}
</dl>
