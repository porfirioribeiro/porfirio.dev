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
    padding: 2rem 1.25rem;
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
    padding: 2rem;
    border-top: 1px solid var(--theme-border);
    font-size: 0.875rem;
    color: var(--theme-muted);
  }

  footer p {
    margin: 0;
  }

  footer a {
    font-weight: 600;
  }

  @media (min-width: 480px) {
    footer {
      padding: 2rem 0;
    }
  }
</style>
