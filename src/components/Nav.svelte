<script lang="ts">
  export let links: { s: string; t: string }[];
  export let segment: string;

  //segment might be undefined, so we use path to be a empty string
  let path: string;
  $: path = segment || "";
</script>

<style lang="scss">
  nav {
    position: fixed;
    width: 100%;
    height: 60px;
    background-color: white;
    z-index: 1;
    box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0,0,0,.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .placeholder {
    height: 60px;
  }
  ul {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    transition: color 0.2s, border 0.2s, padding 0.2s;
    color: gray;
  }

  li[aria-current] {
    color: green;
  }

  li:hover:not([aria-current]) {
    color: blue;
  }

  a {
    color: inherit;
    text-decoration: none;
    padding: 8px;
  }
</style>

<nav>
  <div>Porfirio.dev</div>
  <ul>
    {#each links as { s, t }}
      <li aria-current={path === s ? 'page' : undefined}>
        <a rel="prefetch" href={`/${s}`}>{t}</a>
      </li>
    {/each}
  </ul>
</nav>
<div class="placeholder" />
