<script lang="ts">
  import Header from "$lib/Header/index.svelte";
  import "../app.scss";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Header />

<main>
  {@render children?.()}
</main>

<footer>
  <p>
    <a href="/about">Over-engineered</a> with
    <a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer"
      >SvelteKit</a
    > by Porfírio Ribeiro
  </p>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 70ch;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
