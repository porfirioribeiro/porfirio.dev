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

<h3>Books</h3>

<dl>
  {#each books as book}
    <dt>
      <a href={book.href} target="__blank" rel="noopener">
        {book.title}
      </a>
    </dt>
    <dd>{book.author}</dd>
  {/each}
</dl>
