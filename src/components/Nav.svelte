<script lang="ts">
  export let links: { s: string; t: string }[];
  export let segment: string;

  //segment might be undefined, so we use path to be a empty string
  let path: string;
  $: path = segment || "";

  let headerClass = "pin";
  let floating = false;
  let y = 0;
  let lastY = 0;
  let lastDirection = "up";
  let atTop = true;

  function changeClass(y) {
    let result = headerClass;
    const scrolledPxs = lastY - y;
    const scrollDirection = scrolledPxs < 0 ? "down" : "up";
    const changedDirection = scrollDirection !== lastDirection;
    atTop = y === 0;
    if (changedDirection) {
      result = scrollDirection === "down" ? "unpin" : "pin";
      floating = scrollDirection === "down";
      lastDirection = scrollDirection;
    }
    lastY = y;
    return result;
  }

  $: headerClass = changeClass(y);

  $: console.log(headerClass, floating, atTop);
</script>

<style lang="scss">
  $header-height: 60px;
  nav {
    position: sticky;
    width: 100%;
    height: $header-height;
    background-color: white;
    z-index: 1;
    box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: -$header-height;
    transition: top 300ms, box-shadow 200ms, background 200ms, color 200ms;
  }

  .pin {
    top: 0;
  }

  .atTop {
    box-shadow: none;
  }
  .placeholder {
    height: $header-height;
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

<svelte:window bind:scrollY={y} />
<nav class:pin={lastDirection == 'up'} class:atTop>
  <div>Porfirio.dev</div>
  <ul>
    {#each links as { s, t }}
      <li aria-current={path === s ? 'page' : undefined}>
        <a rel="prefetch" href={`/${s}`}>{t}</a>
      </li>
    {/each}
  </ul>
</nav>
